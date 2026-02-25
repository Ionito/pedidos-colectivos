# PC — Pedidos Colectivos

Una app web mobile-first para organizar compras colectivas entre grupos de personas.

## ¿Para qué sirve?

PC (Pedidos Colectivos) resuelve un problema cotidiano: coordinar una compra grupal. Cuando alguien consigue acceso a un proveedor o quiere organizar un pedido compartido, la logística de "¿quién quiere qué y cuánto?" suele hacerse por WhatsApp, con mensajes dispersos y difíciles de consolidar.

Con PC, el organizador crea un pedido, carga los productos disponibles y comparte el link. Cada participante elige sus cantidades antes del cierre, y todos pueden ver en tiempo real quién pidió qué.

## Funcionalidades

- **Pedidos colectivos**: cualquier usuario puede crear un pedido con título, descripción, productos y fecha límite de adhesión
- **Carga rápida de productos**: pegás una lista de texto en formato libre y la app la parsea automáticamente (detecta nombre, precio y unidad)
- **Participación en tiempo real**: los participantes eligen cantidades con botones +/−, y los cambios se reflejan instantáneamente para todos
- **Resumen por participante**: cada pedido muestra quién se sumó, qué eligió y el subtotal de cada persona
- **Cierre de pedido**: el creador puede cerrar el pedido cuando se cumple el plazo
- **Login con Google o Facebook**: no hace falta crear una cuenta nueva

## Ejemplo de carga de productos

Al crear un pedido, podés pegar una lista como esta directamente en el campo de productos:

```
_Langostinos desvenados $3500 x 100 grs
_Langostinos enteros L1 $2800 x 100 grs
_Camarones pre-cocidos $3800 x 100 grs
_Mix de mariscos $35000 kg
```

La app detecta el nombre, precio y unidad de cada línea y genera los productos automáticamente con una vista previa en tiempo real.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend + Backend | Next.js 16 (App Router) |
| Base de datos + tiempo real | Convex |
| Autenticación | Clerk (Google + Facebook OAuth) |
| Estilos | Tailwind CSS |
| Deploy | Vercel |

## Cómo correr el proyecto localmente

### Requisitos previos

1. **Cuenta en [Clerk](https://dashboard.clerk.com)** — crear una app y activar Google y Facebook como proveedores OAuth
2. **Cuenta en [Convex](https://dashboard.convex.dev)** — crear un proyecto

### Variables de entorno

Completar el archivo `.env.local` con:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/orders
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/orders
NEXT_PUBLIC_CONVEX_URL=https://....convex.cloud
CLERK_JWT_ISSUER_DOMAIN=https://....clerk.accounts.dev
```

### Instalación y desarrollo

```bash
# Instalar dependencias
npm install

# Terminal 1 — Convex (mantener corriendo)
npx convex dev

# Terminal 2 — Next.js
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Estructura del proyecto

```
convex/          → Schema de base de datos y funciones del servidor
src/
├── app/         → Páginas (/, /orders, /orders/new, /orders/[id])
├── components/  → Componentes React (OrderCard, ProductList, etc.)
└── lib/         → Lógica reutilizable (parser de texto, formatters)
```

## Deploy

El proyecto está configurado para deploy en Vercel. Basta con conectar el repositorio y cargar las variables de entorno en el dashboard de Vercel.
