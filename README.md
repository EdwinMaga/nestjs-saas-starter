![Node](https://img.shields.io/badge/node-18.x-green)
![NestJS](https://img.shields.io/badge/nestjs-backend-red)
![Stripe](https://img.shields.io/badge/payments-stripe-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

# 🚀 NestJS SaaS Starter

Starter backend profesional para construir aplicaciones **SaaS multi-tenant** con **NestJS**, **Prisma** y **Stripe**.

Este proyecto provee una base sólida para productos B2B modernos, incluyendo autenticación, organizaciones, control por planes y facturación recurrente.

---

## 🌍 Live Demo (Producción)

El backend está desplegado y accesible públicamente.

- **Base URL:** https://nestjs-saas-starter.onrender.com
- **Health Check:** https://nestjs-saas-starter.onrender.com/health
- **Swagger Docs:** https://nestjs-saas-starter.onrender.com/docs

> ⚠️ El proyecto es solo backend. Algunos endpoints requieren autenticación JWT y un plan activo.

---

## ✨ Features

- 🔐 Autenticación con JWT
- 🏢 Multi-tenant (organizaciones)
- 👥 Roles y permisos (ADMIN / USER)
- 💳 Stripe Checkout + Webhooks
- 📦 Planes de suscripción (FREE / PRO)
- 🚫 Restricción de funcionalidades por plan
- 🧠 Guards y decoradores reutilizables
- 📄 Documentación automática con Swagger
- 🗄️ PostgreSQL + Prisma ORM
- 🐳 Docker para base de datos local

---

## 🧱 Tech Stack

- **Backend:** NestJS, TypeScript  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Auth:** JWT, Passport  
- **Billing:** Stripe (Checkout + Webhooks)  
- **Docs:** Swagger  
- **Infra:** Docker  

---

## 🧠 Arquitectura

- Separación por módulos (Auth, Users, Billing, Organizations)
- Control de acceso basado en:
  - Autenticación
  - Rol
  - Plan de suscripción
- Diseño orientado a SaaS escalable y mantenible

---

## � Estructura del Proyecto

```
src/
├── modules/
│   ├── auth/              # Autenticación JWT
│   │   ├── guards/        # JwtAuthGuard
│   │   ├── strategies/    # JWT Strategy
│   │   └── dto/           # Login, Register, Accept Invite
│   ├── users/             # Gestión de usuarios
│   ├── invitations/       # Sistema de invitaciones
│   ├── billing/           # Integración Stripe
│   ├── prisma/            # Servicio Prisma
│   └── health/            # Health checks
├── common/
│   ├── decorators/        # @CurrentUser, @CurrentOrg, @Roles, @RequireSubscription
│   ├── guards/            # RolesGuard, SubscriptionGuard
│   └── interceptors/      # Logging, transformación
└── config/                # Variables de entorno
```

---

## �📄 API Documentation

El proyecto expone documentación interactiva usando **Swagger** una vez que el servidor está corriendo.

**Swagger UI:** [http://localhost:3000/docs](http://localhost:3000/docs)

---

## ⚙️ Setup local

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/edwinmaga/nestjs-saas-starter.git
cd nestjs-saas-starter
```

### 2️⃣ Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestjs_saas
JWT_SECRET=supersecret
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PRICE_PRO=price_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
FRONTEND_URL=http://localhost:3000
```

### 3️⃣ Base de datos

Levanta PostgreSQL con Docker:

```bash
docker compose up -d
```

Ejecuta las migraciones:

```bash
npx prisma migrate dev
```

### 4️⃣ Ejecutar el proyecto

```bash
npm install
npm run start:dev
```

---

## 💳 Stripe (modo test)

Para probar pagos en entorno local se utiliza Stripe CLI escuchando eventos y reenviándolos al backend.

```bash
stripe listen --forward-to localhost:3000/billing/webhook
```

**Tarjeta de prueba estándar de Stripe:**

```
4242 4242 4242 4242
```

---

## 🔐 Control por plan

Ejemplo de restricción por plan:

```typescript
@UseGuards(JwtAuthGuard, SubscriptionGuard)
@RequireSubscription('PRO')
@Post('invite')
inviteUser() {}
```

Los usuarios con plan FREE recibirán un error **403 Forbidden**.

---

## 🎯 Casos de uso

Este starter es ideal para:

- SaaS B2B
- MVPs de startups
- Freelancers backend
- Proyectos con suscripciones
- Sistemas multi-tenant

---

## 👤 Autor

**Edwin Magadan**  
Backend / Fullstack Developer  
📍 CDMX

- GitHub: [@edwinmaga](https://github.com/edwinmaga)
- LinkedIn: [edwinmagadan](https://linkedin.com/in/edwinmagadan)