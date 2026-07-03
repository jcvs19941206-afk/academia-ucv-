# DESIGN.md — AcademIA
### Design System — Fuente de verdad visual única

---

## Tabla de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| v1.0 | 2026-07-02 | Design Engineering (AI-generated draft) | Versión inicial, alineada al scope MVP definido en PRD-AcademIA-v1.0.md |

## Tabla de contenido

1. [Principios de Diseño](#1-principios-de-diseño)
2. [Design Tokens](#2-design-tokens-completos)
3. [Modo Claro y Oscuro](#3-modo-claro-y-oscuro--estrategia-de-implementación)
4. [Catálogo de Componentes](#4-catálogo-de-componentes)
5. [Layout Patterns](#5-layout-patterns)
6. [Iconografía](#6-iconografía-lucide)
7. [Estados de Componentes y Página](#7-estados-de-componentes-y-página)
8. [Motion Design](#8-motion-design)
9. [Accesibilidad](#9-accesibilidad-checklist)
10. [Clases Utilitarias Recurrentes](#10-clases-utilitarias-recurrentes)
11. [Glosario de Términos de Diseño](#11-glosario-de-términos-de-diseño)
12. [Checklist de Consistencia Visual](#12-checklist-de-consistencia-visual-code-review)

**Stack de diseño:** Next.js 15 (App Router) + TypeScript estricto · Tailwind CSS v3+ (`tailwindcss-animate`) · shadcn/ui (New York) + Radix UI · `lucide-react` v0.400+ · `next-themes` · Framer Motion (`motion`) · `cn()` de `@/lib/utils`.

**Nota de scope:** Este documento cubre únicamente lo requerido por las 4 pantallas del MVP (Login, Dashboard, Lista de Tareas, Detalle de Tarea) definidas en `PRD-AcademIA-v1.0.md`. Componentes fuera de ese scope no se documentan aquí.

---

## 1. Principios de Diseño

| # | Principio | Explicación | Ejemplo de aplicación |
|---|-----------|-------------|----------------------|
| 1 | Jerarquía clara > Decoración | Cada elemento tiene un propósito visual | Cards sin bordes gruesos, sombras sutiles |
| 2 | Mobile-first, escritorio sin sacrificio | La UI funciona en cualquier tamaño | Sidebar → Bottom nav en mobile |
| 3 | Densidad informativa controlada | Mostrar info sin abrumar | Tabla compacta con hover reveal |
| 4 | Accesibilidad como base, no afterthought | WCAG AA mínimo en todos los modos | Contraste 4.5:1, focus visible |
| 5 | Consistencia > Creatividad puntual | Un solo sistema, sin excepciones | Misma paleta, radios, espaciado siempre |

**Decisión:** Ante cualquier conflicto entre principios (ej. densidad vs. accesibilidad), el principio 4 tiene prioridad de veto sobre los demás.

---

## 2. Design Tokens Completos

### 2.1 Colores base

| Token CSS | Light (HSL) | Dark (HSL) | Uso |
|-----------|-------------|------------|-----|
| `--color-primary` | `hsl(210 58% 31%)` | `hsl(210 50% 50%)` | Botones principales, links, header activo |
| `--color-primary-foreground` | `hsl(0 0% 100%)` | `hsl(0 0% 100%)` | Texto sobre primary |
| `--color-secondary` | `hsl(210 40% 96%)` | `hsl(210 30% 20%)` | Fondo de secciones secundarias |
| `--color-secondary-foreground` | `hsl(210 58% 31%)` | `hsl(210 40% 90%)` | Texto sobre secondary |
| `--color-accent` | `hsl(172 65% 47%)` | `hsl(172 55% 55%)` | Acento turquesa, badges, highlights |
| `--color-accent-foreground` | `hsl(0 0% 100%)` | `hsl(0 0% 100%)` | Texto sobre accent |
| `--color-destructive` | `hsl(0 84% 60%)` | `hsl(0 70% 50%)` | Errores, eliminar, urgencia |
| `--color-destructive-foreground` | `hsl(0 0% 100%)` | `hsl(0 0% 100%)` | Texto sobre destructive |
| `--color-warning` | `hsl(38 92% 50%)` | `hsl(38 80% 55%)` | Alertas, prioridad media |
| `--color-warning-foreground` | `hsl(0 0% 100%)` | `hsl(0 0% 100%)` | Texto sobre warning |
| `--color-success` | `hsl(142 71% 45%)` | `hsl(142 60% 50%)` | Completado, éxito, prioridad baja |
| `--color-success-foreground` | `hsl(0 0% 100%)` | `hsl(0 0% 100%)` | Texto sobre success |
| `--color-info` | `hsl(210 58% 31%)` | `hsl(210 50% 55%)` | Información, help text |
| `--color-info-foreground` | `hsl(0 0% 100%)` | `hsl(0 0% 100%)` | Texto sobre info |

### 2.2 Neutros

| Token CSS | Light (HSL) | Dark (HSL) | Uso |
|-----------|-------------|------------|-----|
| `--background` | `hsl(40 20% 97%)` | `hsl(220 20% 6%)` | Fondo general de la app |
| `--foreground` | `hsl(220 15% 15%)` | `hsl(220 10% 92%)` | Texto principal |
| `--card` | `hsl(0 0% 100%)` | `hsl(220 15% 10%)` | Fondo de cards |
| `--card-foreground` | `hsl(220 15% 15%)` | `hsl(220 10% 90%)` | Texto en cards |
| `--popover` | `hsl(0 0% 100%)` | `hsl(220 15% 10%)` | Fondo de modales/dropdowns |
| `--popover-foreground` | `hsl(220 15% 15%)` | `hsl(220 10% 90%)` | Texto en popovers |
| `--muted` | `hsl(220 10% 92%)` | `hsl(220 15% 18%)` | Fondo de elementos muted |
| `--muted-foreground` | `hsl(220 10% 50%)` | `hsl(220 10% 60%)` | Texto secundario, placeholders |
| `--border` | `hsl(220 10% 85%)` | `hsl(220 15% 22%)` | Bordes de componentes |
| `--input` | `hsl(220 10% 85%)` | `hsl(220 15% 22%)` | Bordes de inputs |
| `--ring` | `hsl(210 58% 31%)` | `hsl(210 50% 50%)` | Focus ring |

### 2.3 Semáforo de Prioridad

> Cubre las 3 prioridades del modelo de datos del MVP (`priority_enum`: low/medium/high). "Urgente" se documenta porque el catálogo de badges lo define como extensión natural del semáforo, pero **no existe en el enum del MVP** — queda reservado para un futuro `priority_enum` de 4 valores.

| Prioridad | Color | HSL Light | HSL Dark | Badge Variant | Icono |
|-----------|-------|-----------|----------|---------------|-------|
| Urgente *(reservado, no en MVP)* | Rojo | `hsl(0 84% 60%)` | `hsl(0 70% 50%)` | `destructive` | `AlertTriangle` |
| Alta | Naranja | `hsl(24 95% 53%)` | `hsl(24 80% 50%)` | `warning` | `ArrowUp` |
| Media | Ámbar | `hsl(38 92% 50%)` | `hsl(38 80% 55%)` | `secondary` | `Minus` |
| Baja | Verde | `hsl(142 71% 45%)` | `hsl(142 60% 50%)` | `outline` | `ArrowDown` |

### 2.4 Tipografía

| Propiedad | Valor |
|-----------|-------|
| Font family base | `Inter Variable`, `Inter`, sans-serif |
| Font family code/mono | `JetBrains Mono Variable`, `Fira Code`, monospace |
| Escala modular | 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 px |
| Font weights disponibles | 400 (regular) / 500 (medium) / 600 (semibold) / 700 (bold) |
| Line-height base | `1.6` (cuerpo), `1.2` (títulos) |
| Letter-spacing títulos | `-0.02em` (`tracking-tight`) |
| Clase base párrafo | `text-sm md:text-base leading-relaxed` |
| Jerarquía visual | `h1: text-3xl md:text-4xl font-bold` · `h2: text-2xl font-semibold` · `h3: text-xl font-semibold` · `h4: text-lg font-medium` |

### 2.5 Espaciado (baseline 4px)

| Token | px | Clase Tailwind | Uso |
|-------|----|----------------|-----|
| `space-1` | 4px | `gap-1`, `p-1` | Micro-espaciado entre iconos y texto |
| `space-2` | 8px | `gap-2`, `p-2` | Espaciado interno en badges |
| `space-3` | 12px | `gap-3`, `p-3` | Entre elementos de formulario |
| `space-4` | 16px | `gap-4`, `p-4` | Padding estándar de cards |
| `space-6` | 24px | `gap-6`, `p-6` | Entre secciones de página |
| `space-8` | 32px | `gap-8`, `p-8` | Padding de contenedor principal |
| `space-10` | 40px | `gap-10`, `p-10` | Separación de bloques grandes |
| `space-12` | 48px | `gap-12` | Separación de secciones en dashboard |

### 2.6 Radii

| Token | px | Clase Tailwind | Uso |
|-------|----|----------------|-----|
| `none` | 0px | `rounded-none` | Inputs, tablas (por defecto) |
| `sm` | 4px | `rounded-sm` | Badges pequeños, tags |
| `md` | 6px | `rounded-md` | Botones, inputs (por defecto shadcn) |
| `lg` | 8px | `rounded-lg` | Cards, modales, dropdowns |
| `xl` | 12px | `rounded-xl` | Sidebar, contenedores grandes |
| `2xl` | 16px | `rounded-2xl` | Sheets en desktop |
| `full` | 9999px | `rounded-full` | Avatares, pills |

### 2.7 Shadows

| Nivel | Light | Dark | Uso |
|-------|-------|------|-----|
| `sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | `0 1px 2px 0 rgb(0 0 0 / 0.3)` | Cards, dropdowns |
| `md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | `0 4px 6px -1px rgb(0 0 0 / 0.4)` | Hover en cards, modales |
| `lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | `0 10px 15px -3px rgb(0 0 0 / 0.5)` | Sheets |
| `xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1)` | `0 20px 25px -5px rgb(0 0 0 / 0.5)` | Toast, notificaciones flotantes |

### 2.8 Breakpoints

| Nombre | px | Tailwind | Target |
|--------|----|----------|--------|
| `sm` | 640px | `sm:` | Mobile landscape |
| `md` | 768px | `md:` | Tablet |
| `lg` | 1024px | `lg:` | Desktop pequeño |
| `xl` | 1280px | `xl:` | Desktop estándar |
| `2xl` | 1536px | `2xl:` | Desktop grande |

**Decisión:** Todos los tokens de color se declaran como variables CSS en `:root` / `.dark` y se mapean en `tailwind.config.ts` vía `hsl(var(--token))`; ningún componente referencia un valor HSL literal fuera de este archivo.

---

## 3. Modo Claro y Oscuro — Estrategia de Implementación

### 3.1 Arquitectura

```css
:root { /* tokens modo claro */ }
.dark { /* tokens modo oscuro */ }
```

- `next-themes` con `ThemeProvider` en el root layout.
- Clase `.dark` en `<html>` para activar modo oscuro.
- Transición: `transition-colors duration-300` en `body`.
- Persistencia: `localStorage`, con fallback a `prefers-color-scheme`.

### 3.2 Reglas de contraste (WCAG AA)

- Texto normal (<18px): ratio mínimo **4.5:1**
- Texto grande (>18px bold o >24px regular): ratio mínimo **3:1**
- Componentes UI (bordes, iconos): ratio mínimo **3:1**
- Estados disabled: opacidad 40% sobre el fondo

### 3.3 Estrategia de imágenes

- Iconos y logos: SVG con `currentColor` para adaptación automática.
- Si hay imágenes bitmap (fuera de scope MVP): `filter: invert(1) hue-rotate(180deg)` en modo oscuro.

**Decisión:** El modo oscuro no es opcional post-MVP ni un tema aparte — todo componente del catálogo (sección 4) se define con sus dos valores (Light/Dark) desde el primer commit, para evitar refactors de theming después del lanzamiento.

---

## 4. Catálogo de Componentes

### 4.1 Button

| Propiedad | Valores |
|-----------|---------|
| Variantes | `default`, `secondary`, `destructive`, `outline`, `ghost`, `link` |
| Tamaños | `sm` (h-8 text-xs), `default` (h-10 text-sm), `lg` (h-12 text-base), `icon` (h-10 w-10) |
| Estados | default · hover (`brightness-110`) · active (`scale-95`) · disabled (`opacity-50`) · loading (reemplazar texto con spinner) |
| Animación | `transition-all duration-200 ease-in-out` |
| ARIA | `role="button"`, `aria-disabled` cuando corresponda |

### 4.2 Card

| Propiedad | Valor |
|-----------|-------|
| Estructura | `Card > CardHeader > CardTitle + CardDescription > CardContent > CardFooter` |
| Bordes | `rounded-xl border bg-card text-card-foreground shadow-sm` |
| Hover | `hover:shadow-md transition-shadow duration-200` (solo en cards clickeables) |
| Padding | `p-4 md:p-6` |
| Gap interno | `space-y-4` |

### 4.3 Sheet (Drawer)

> Reemplaza a `Dialog` como componente de modal principal del MVP: se usa para el detalle de tarea (side `right`) y para la navegación en mobile (side `left`). No se documenta `Dialog` porque el MVP no lo requiere (ver PRD sección 9, Decisión).

| Propiedad | Valor |
|-----------|-------|
| Side | `left` (sidebar mobile), `right` (detalle de tarea) |
| Tamaño | `sm` (max-w-sm), `default` (max-w-md), `lg` (max-w-lg), `full` (w-full, mobile) |
| Overlay | `bg-black/50 backdrop-blur-sm` |
| Animación | Slide desde el lado correspondiente + fade del overlay |
| Cierre | Click fuera, Escape, botón X |
| ARIA | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |

### 4.4 Badge

| Propiedad | Valores |
|-----------|---------|
| Variantes | `default` (primary), `secondary`, `destructive`, `outline`, `warning`, `success` |
| Tamaños | `sm` (`text-xs px-2 py-0.5`), `default` (`text-xs px-2.5 py-0.5`) |
| Prioridades | Alta→`warning`, Media→`secondary`, Baja→`outline` (mapeo del `priority_enum` del MVP, sección 2.3) |

### 4.5 Table

| Propiedad | Valor |
|-----------|-------|
| Layout | `Table > TableHeader > TableRow > TableHead` + `TableBody > TableRow > TableCell` |
| Hover | `hover:bg-muted/80 transition-colors` |
| Sticky header | `sticky top-0 bg-background z-10` |
| Empty state | Mostrar `EmptyState` cuando no hay filas (ver sección 7.2) |

### 4.6 Form (Input, Select, Textarea)

| Propiedad | Valor |
|-----------|-------|
| Input | `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50` |
| Textarea | Igual que Input + `min-h-[80px] resize-y` |
| Select | `SelectTrigger` de shadcn, mismo estilo visual que Input |
| Error state | Borde `border-destructive` + mensaje `text-destructive text-sm` |

### 4.7 Toast / Sonner

| Propiedad | Valor |
|-----------|-------|
| Librería | `sonner` (integración shadcn) |
| Posición | `bottom-right` en desktop, `top-center` en mobile |
| Variantes | `success`, `error`, `warning`, `info` |
| Duración | 4s por defecto; persistente en errores críticos |
| Animación | Slide up + fade |

### 4.8 Skeleton

| Propiedad | Valor |
|-----------|-------|
| Clase base | `animate-pulse rounded-md bg-muted` |
| Variantes | Card skeleton (rectangular), Text skeleton (líneas de ancho variable), Avatar skeleton (círculo) |
| Regla | La forma del skeleton debe coincidir con las dimensiones del contenido real |

### 4.9 EmptyState

| Propiedad | Valor |
|-----------|-------|
| Estructura | `flex flex-col items-center justify-center py-12 gap-4 text-center` |
| Icono | Lucide icon grande (48–64px) en `text-muted-foreground` |
| Título | `text-lg font-semibold` |
| Descripción | `text-sm text-muted-foreground` |
| CTA | `Button` opcional para la acción principal |

### 4.10 Avatar

| Propiedad | Valor |
|-----------|-------|
| Tamaños | `sm` (h-8 w-8), `default` (h-10 w-10), `lg` (h-12 w-12) |
| Fallback | Iniciales sobre `bg-muted text-muted-foreground font-medium` |
| Hover (dropdown TopBar) | `ring-2 ring-background` |

**Decisión:** Del catálogo original evaluado para AcademIA se excluyen explícitamente `Dialog`, `Tabs` y `Checkbox`/`Radio` de este documento porque ninguna de las 4 pantallas del MVP los requiere (regla de calidad #4: "no documentes lo que no se usa en el MVP"). Se re-introducen cuando el roadmap post-MVP (etiquetas, calendario) los active.

---

## 5. Layout Patterns

### 5.1 App Shell (Dashboard)

```
┌──────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │              │  │  TopBar              │  │
│  │   Sidebar    │  │  [Search]    [Avatar]│  │
│  │   (w-64)     │  ├──────────────────────┤  │
│  │              │  │                      │  │
│  │   Dashboard  │  │   Main Content       │  │
│  │   Cursos     │  │   (flex-1)           │  │
│  │   Tareas     │  │                      │  │
│  │              │  │                      │  │
│  └──────────────┘  └──────────────────────┘  │
└──────────────────────────────────────────────┘
```

**Responsive:**
- `lg+`: Sidebar visible (`w-64`), colapsable a iconos (`w-16`)
- `md`: Sidebar oculto, `Sheet` (side `left`) para navegación
- `sm`: Bottom navigation reemplaza al sidebar

### 5.2 Dashboard Grid

```css
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
/* Equivalente Tailwind: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 */
```

### 5.3 Form Layout

- Ancho máximo: `max-w-lg mx-auto` en páginas dedicadas (Login).
- En `Sheet` (detalle de tarea): ancho completo del panel.
- Espaciado vertical: `space-y-6` entre campos.
- Labels: `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`.

**Decisión:** El breakpoint de colapso del sidebar es `lg` (1024px), no `md`, porque la vista de Tareas necesita el ancho completo de tablet (768–1023px) para mostrar los filtros combinables sin scroll horizontal.

---

## 6. Iconografía (Lucide)

| Regla | Valor |
|-------|-------|
| Librería | `lucide-react` v0.400+ |
| Stroke width por defecto | `strokeWidth={2.5}` |
| Tamaños en UI | `size={16}` (inline), `size={20}` (botones), `size={24}` (secciones) |
| Tamaños en EmptyState | `size={48}` (mediano), `size={64}` (grande) |
| Color | `currentColor` (hereda del texto del contenedor) |
| Convención de import | `import { Plus } from "lucide-react"` → `<Plus />` (sin prefijo `Lucide` en el nombre del componente importado) |

### Iconos por funcionalidad (scope MVP)

| Funcionalidad | Icono |
|---------------|-------|
| Logo app | `GraduationCap` |
| Dashboard | `LayoutDashboard` |
| Cursos | `BookOpen` |
| Tareas | `ClipboardList` |
| Agregar | `Plus` |
| Editar | `Pencil` |
| Eliminar | `Trash2` |
| Buscar | `Search` |
| Usuario | `User` |
| Cerrar sesión | `LogOut` |
| Completado | `CheckCircle2` |
| Prioridad alta | `ArrowUp` |
| Prioridad media | `Minus` |
| Prioridad baja | `ArrowDown` |
| Fecha | `Calendar` |
| Filtro | `Filter` |
| Menú (mobile) | `Menu` |
| Cerrar (Sheet/Toast) | `X` |
| Loading | `Loader2` (con `animate-spin`) |
| Error | `AlertTriangle` |

**Decisión:** `AlertCircle` (semáforo "Urgente") se retira de esta tabla porque esa prioridad no existe en el `priority_enum` del MVP; `AlertTriangle` se conserva únicamente para el Error State (sección 7.3), no como icono de prioridad.

---

## 7. Estados de Componentes y Página

### 7.1 Loading State

| Componente | Skeleton a usar |
|------------|-----------------|
| Metric Card | `h-24 w-full animate-pulse rounded-xl bg-muted` |
| Table | 5 filas de `h-12 w-full rounded-md bg-muted` |
| Chart | `h-64 w-full animate-pulse rounded-xl bg-muted` |
| Avatar | `h-10 w-10 animate-pulse rounded-full bg-muted` |
| Text | `h-4 w-3/4 rounded bg-muted`, `h-4 w-1/2 rounded bg-muted` |

**Regla:** El skeleton debe respetar la forma del contenido real, no ser genérico.

### 7.2 Empty State

```
┌──────────────────────────────────────┐
│                                      │
│         [Icono Lucide 64px]          │
│                                      │
│      Título: "No hay tareas aún"     │
│                                      │
│   Subtítulo: "Crea tu primera tarea  │
│    para empezar a organizarte"       │
│                                      │
│       [Button: Crear tarea]          │
│                                      │
└──────────────────────────────────────┘
```

**Regla:** Cada sección con datos variables tiene un EmptyState único (no genérico); el CTA lleva a la acción principal de esa sección — coincide 1:1 con los escenarios "estado vacío" de las Historias 3 y 4 en el PRD.

### 7.3 Error State

```
┌──────────────────────────────────────┐
│         [AlertTriangle]              │
│                                      │
│     "Algo salió mal" (título)        │
│                                      │
│     Mensaje descriptivo del error    │
│     (ej: "No pudimos cargar tus      │
│      tareas. Intenta de nuevo.")     │
│                                      │
│  [Button: Reintentar]  [Volver atrás]│
└──────────────────────────────────────┘
```

**Regla:** Siempre incluir una acción recuperable (retry, volver atrás).

### 7.4 Partial Data State

Cuando una sección carga y otra falla en el Dashboard:
- La sección que falló muestra `ErrorState` in-situ, sin bloquear la página completa.
- Las secciones que cargaron bien se muestran con normalidad.
- El error se refuerza con un `Toast`, además del estado inline.

**Decisión:** Ningún componente de datos (Table, Metric Card, Chart) se implementa sin sus tres estados (loading/empty/error) definidos aquí; esto entra al Definition of Done de la Fase 5 del PRD junto con el checklist de accesibilidad.

---

## 8. Motion Design

### 8.1 Animaciones por componente

| Componente | Animación | Código |
|------------|-----------|--------|
| Sheet | Slide desde el lado | `<motion.div initial={{ x: 300 }} animate={{ x: 0 }} />` |
| Toast | Slide up + Fade | Manejado automáticamente por `sonner` |
| Hover en cards | Elevación suave | `hover:shadow-md transition-shadow duration-200` |
| Hover en botones | Brightness + Scale | `hover:brightness-110 active:scale-95 transition-all duration-200` |
| Check de tarea completada | Crossfade + Strike | `line-through text-muted-foreground transition-all duration-300` |
| Skeleton | Pulse | `animate-pulse` |
| Loading spinner | Rotación | `<Loader2 className="animate-spin" />` |
| Sidebar colapso | Width transition | `transition-all duration-300 ease-in-out` |
| Page transition | Fade in | `animate-in fade-in duration-500` |

### 8.2 Reglas de motion

- Duración: 150–300ms para micro-interacciones; 300–500ms para transiciones de página.
- Easing: `ease-in-out` por defecto; `ease-out` para entradas.
- Sin animación para usuarios con `prefers-reduced-motion: reduce`.
- Sin animación en elementos que aparecen ya renderizados por SSR (evitar parpadeo en hidratación).

**Decisión:** No se documenta motion para `Dialog` ni `Tabs` (sección 4, componentes excluidos del MVP); si se re-introducen, heredan las mismas reglas de duración/easing de esta sección sin crear una nueva convención.

---

## 9. Accesibilidad (Checklist)

- [ ] Todos los formularios tienen `<label>` con `htmlFor` vinculado al `id` del input
- [ ] Todos los iconos decorativos tienen `aria-hidden="true"`
- [ ] Todos los iconos informativos tienen `aria-label` descriptivo
- [ ] Navegación por teclado: Tab en orden lógico, Enter/Escape en Sheets
- [ ] Focus visible: `focus-visible:ring-2 focus-visible:ring-ring` en todos los elementos interactivos
- [ ] Skip to content link al inicio de la página
- [ ] Roles ARIA: `role="dialog"`, `role="alert"`, `role="navigation"`, `role="main"`
- [ ] Estados loading: `aria-busy="true"` en contenedores que cargan
- [ ] Mensajes de error: `role="alert"` para que los lectores de pantalla los anuncien
- [ ] Contraste: WCAG AA mínimo (4.5:1 texto, 3:1 componentes) en ambos modos

**Decisión:** Este checklist es idéntico en alcance al de `PRD-AcademIA-v1.0.md` sección 15, pero aquí se detalla a nivel de implementación (selectores y atributos exactos) para que sea directamente verificable en code review.

---

## 10. Clases Utilitarias Recurrentes

| Uso | Clase Tailwind |
|-----|----------------|
| Contenedor de página | `space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto` |
| Título de sección | `text-lg md:text-xl font-semibold tracking-tight` |
| Subtítulo | `text-sm text-muted-foreground` |
| Card estándar | `rounded-xl border bg-card text-card-foreground shadow-sm` |
| Separador | `h-px bg-border my-6` |
| Grid métricas | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` |
| Form contenedor | `max-w-lg mx-auto space-y-6` |
| Tabla wrapper | `rounded-xl border overflow-hidden` |
| Sidebar item | `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground` |
| Badge wrapper | `flex flex-wrap gap-2` |
| Empty state | `flex flex-col items-center justify-center py-12 gap-4 text-center` |
| Error contenedor | `flex flex-col items-center justify-center py-12 gap-4 text-center` |

---

## 11. Glosario de Términos de Diseño

| Término | Definición |
|---------|------------|
| Token | Variable de diseño (color, spacing, radius) con valor único |
| Componente | Elemento de UI atómico (Button, Card, Input) |
| Patrón | Combinación de componentes para un propósito (form layout, dashboard grid) |
| Variante | Modificación visual de un componente (Button variant: default, destructive...) |
| Estado | Condición visual de un componente (hover, active, disabled, loading, error) |
| Empty State | Vista cuando no hay datos que mostrar |
| Skeleton | Placeholder animado que indica carga |
| Breakpoint | Punto de quiebre responsive |
| Elevation | Profundidad visual dada por sombras |
| Dense mode | Modo de alta densidad informativa (menos padding, más datos visibles) |

---

## 12. Checklist de Consistencia Visual (Code Review)

- [ ] Todos los colores vienen de variables CSS, no hay hex hardcodeados
- [ ] Todos los border-radius usan los tokens definidos (`lg`=8px en cards, `md`=6px en inputs)
- [ ] Todos los espaciados son múltiplos de 4px
- [ ] Todos los iconos son de Lucide, `strokeWidth={2.5}`
- [ ] Todas las sombras usan los tokens definidos en 2.7
- [ ] La tipografía usa Inter y la escala definida en 2.4
- [ ] El modo oscuro está implementado y no tiene fugas de color
- [ ] Los estados (loading, empty, error) están implementados en cada sección con datos variables
- [ ] El contraste cumple WCAG AA en ambos modos
- [ ] No hay componentes de UI que no vengan de shadcn/ui

**Decisión:** Este checklist es bloqueante en Pull Request (no opcional) durante la Fase 5 del plan de implementación (`PRD-AcademIA-v1.0.md` sección 10); un PR que no lo cumple no se mergea a `main`, sin excepción por presión de deadline.

---

*Fin del documento. DESIGN.md — fuente de verdad visual única, consumible por Stitch MCP, Antigravity MCP y desarrolladores full-stack sin ambigüedades.*
