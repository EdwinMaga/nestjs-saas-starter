import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createCheckout(orgId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });

    let customerId = org?.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        name: org?.name,
      });

      customerId = customer.id;

      await this.prisma.organization.update({
        where: { id: orgId },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_PRO!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/billing/success`,
      cancel_url: `${process.env.FRONTEND_URL}/billing/cancel`,
    });

    return { url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-12-15.clover',
    });

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      console.error('Webhook signature verification failed.');
      throw err;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionCanceled(event);
        break;

      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event);
        break;
    }

    return { received: true };
  }

  private async handleCheckoutCompleted(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;

    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    await this.prisma.organization.update({
      where: { stripeCustomerId: customerId },
      data: {
        plan: 'PRO',
        stripeSubId: subscriptionId,
      },
    });
  }

  private async handleSubscriptionCanceled(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;

    await this.prisma.organization.updateMany({
      where: { stripeSubId: subscription.id },
      data: {
        plan: 'FREE',
        stripeSubId: null,
      },
    });
  }

  private async handlePaymentFailed(event: Stripe.Event) {
    const invoice = event.data.object as Stripe.Invoice;

    await this.prisma.organization.updateMany({
      where: { stripeCustomerId: invoice.customer as string },
      data: {
        plan: 'FREE',
      },
    });
  }
}
