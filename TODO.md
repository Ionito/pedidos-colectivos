# TODO

## Pendiente

### Todo list

- que el modal no se cierre con click en el background
- mostrar carrito de compra para el usuario
- notidicacion que el pedido esta para la entrega (wp o mail, para wp el usuario tiene que haber cargado su telefono)
- crear web para explicar como funciona el producto, que es gratis, que te permite gestionar pedidos colectivos de una maner amuy facil
- Historial de pedidos, poder copiar un pedido viejo para volver a abrir un pedido con las mismas opciones, el que no es creador tambien puede volver a pedir lo mismo

### PWA (Progressive Web App)

Permitir que los usuarios instalen la web como una app en su teléfono o escritorio.

**Qué hay que hacer:**

- [ ] Instalar `next-pwa` (`npm install next-pwa`)
- [ ] Crear `public/manifest.json` con nombre, descripción, colores e iconos de la app
- [ ] Generar iconos en múltiples tamaños (192x192, 512x512, etc.)
- [ ] Agregar `<link rel="manifest">` en el `<head>` del layout
- [ ] Configurar `next-pwa` en `next.config.ts` para generar el service worker
- [ ] Opcionalmente: mostrar un botón personalizado de instalación usando el evento `beforeinstallprompt`

**Notas:**

- El stack actual (Next.js + Tailwind + Convex + Clerk) es compatible sin cambios mayores
- El service worker de PWA no interfiere con Clerk ni Convex
- Definir nombre de la app y color principal antes de empezar
