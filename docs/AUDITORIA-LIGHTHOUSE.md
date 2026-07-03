# 📊 Auditoría y Optimización - Lighthouse & A11Y

Este documento explica las estrategias implementadas para alcanzar puntuaciones mayores a 90 en Lighthouse y cumplir con el estándar WCAG 2.1 AA en Accesibilidad.

## 1. Comandos de Verificación
Para auditar la plataforma y generar el reporte final en producción o desarrollo local, ejecuta los siguientes comandos:

```bash
# 1. Generar el reporte del Bundle Analyzer (Revisa el peso de JavaScript)
ANALYZE=true npm run build

# 2. Correr una auditoría de Lighthouse en entorno local (Requiere build previo y levantar el servidor)
npm run build
npm run start
# En otra terminal:
npx lighthouse http://localhost:3000 --view

# 3. Escanear la accesibilidad en la terminal con axe-core
npx axe http://localhost:3000
```

## 2. Optimizaciones Implementadas

### ⚡ Rendimiento (Performance)
1. **Server Components por defecto**: Toda la plataforma está construida utilizando RSC (React Server Components), delegando el JS únicamente a fragmentos interactivos marcados con `"use client"`.
2. **Fuentes web óptimas**: Integradas mediante `next/font/google` con la propiedad `display: swap` y self-hosting automático en el build.
3. **Bundle Analyzer**: Instanciado en `next.config.ts` para facilitar el monitoreo continuo del peso de los chunks por ruta.

### 🔍 SEO & Crawlers
1. **Sitemap Dinámico**: Disponible en `/sitemap.xml`, generado en tiempo real vía código (`sitemap.ts`).
2. **Robots.txt**: Disponible en `/robots.txt`, configurado para prevenir el rastreo en páginas privadas detrás de autenticación (ej: `/dashboard`).
3. **Metadatos Enriquecidos**: Integración de OpenGraph y Twitter Cards globales para pre-visualizaciones en redes sociales.
4. **Structured Data (JSON-LD)**: Inyección de `SoftwareApplication` estático para un mejor entendimiento de motores de búsqueda.

### ♿ Accesibilidad (A11Y)
1. **Skip to Content Link**: Se añadió un enlace oculto (solo visible al recibir foco vía tabulación) para permitir a lectores de pantalla saltar la navegación y llegar al contenido.
2. **Landmarks (Hitos)**: Las rutas base han sido envueltas en la etiqueta `<main id="main-content" role="main">` para fácil iteración semántica.
3. **Alto Contraste y Navegación**: Formularios y botones respetan la navegación mediante `<Tab>`, y los componentes UI (basados en Radix/shadcn) proveen *Focus Trap* natural dentro de modales y diálogos.

## 3. Consideraciones Finales
- Recuerda que **Lighthouse** en ambiente local siempre penaliza los tiempos de respuesta del servidor (TTFB) y no aplica caché global o CDN.
- Las mejores puntuaciones (>95) se reflejan al escanear la URL provista por Vercel (Producción) desde PageSpeed Insights.
