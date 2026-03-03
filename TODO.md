# TODO

## Pendiente

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
