# Change Log

## [2025-11-11] Exportación Múltiple: CSV e Imagen | Files: src/services/choreService.ts, src/PlanificadorTareas.tsx, src/components/ui/dropdown-menu.tsx, package.json | Estado: ✅ Exitoso

### Descripción del cambio:
- Implementadas dos nuevas opciones de exportación: CSV e Imagen (JPG)
- Reemplazado botón de exportación simple por dropdown menu con 3 opciones
- Agregada generación de calendario visual profesional para exportación como imagen
- Instaladas dependencias: html2canvas y @radix-ui/react-dropdown-menu

### Archivos creados:
- **src/components/ui/dropdown-menu.tsx**: Componente Radix UI para menú desplegable

### Archivos modificados:
- **src/services/choreService.ts**: Agregadas funciones exportToCSV() y exportToImage()
- **src/PlanificadorTareas.tsx**: Reemplazado botón simple por DropdownMenu con 3 opciones
- **package.json**: Agregadas dependencias html2canvas y @radix-ui/react-dropdown-menu

### Funcionalidades implementadas:

#### 1. Exportación a CSV:
- Ordenamiento de tareas por día y hora de inicio
- Columnas: Día, Hora Inicio, Duración (min), Tarea, Categoría, Responsable, Notas
- Nombres de archivo con formato: `tareas-YYYY-MM-DD.csv`
- Encoding UTF-8 con BOM para compatibilidad con Excel
- Escape correcto de comillas en textos

#### 2. Exportación a Imagen:
- Generación de calendario visual de 1920px de ancho
- Diseño profesional con header, logo y título con gradientes
- Columnas por día de la semana con tareas organizadas
- Bloques de tareas con colores según categoría:
  - Daily: Azul (#dbeafe)
  - Weekly: Púrpura (#e9d5ff)
  - Monthly: Rosa (#fce7f3)
  - Urgent: Rojo (#fee2e2)
  - Eventual: Verde (#d1fae5)
- Leyenda de categorías incluida
- Información de cada tarea: hora, duración, título y responsable
- Footer con fecha de generación
- Captura con html2canvas a escala 2x para alta calidad
- Formato JPG con calidad 95%
- Nombres de archivo: `calendario-YYYY-MM-DD.jpg`

#### 3. Dropdown Menu de Exportación:
- Botón trigger con ID preservado: `export-button-010`
- 3 opciones con iconos distintivos:
  - Exportar JSON (icono Download, azul)
  - Exportar CSV (icono FileSpreadsheet, verde)
  - Exportar Imagen (icono Image, púrpura)
- Estado de carga durante exportación: "Exportando..."
- Deshabilitación del botón durante proceso
- Efectos hover con colores por opción
- Glassmorphism design consistente con la app

### Detalles técnicos:

**Función exportToCSV:**
```typescript
static exportToCSV(chores: Chore[]): void
```
- Ordenamiento: día (ascendente) → hora (alfabético)
- Headers: español latinizado
- Escape de comillas: `"` → `""`
- BOM UTF-8: `\ufeff` para Excel

**Función exportToImage:**
```typescript
static async exportToImage(chores: Chore[], daysCount: number): Promise<void>
```
- Renderizado offscreen con position absolute
- Container de 1920px de ancho
- HTML inline con estilos completos
- Grid CSS responsivo según daysCount
- Captura con html2canvas
- Conversión a JPEG blob
- Limpieza automática del DOM

**Estado de exportación:**
- `isExporting: boolean` - Controla estado de carga
- Try/catch para manejo de errores
- Alert de error para feedback al usuario

### Especificaciones de diseño del calendario:

**Header:**
- Logo con gradiente blue-purple-pink (80x80px)
- Título con gradiente text y font-weight 800
- Subtítulo con fecha actual

**Grid de días:**
- Columnas dinámicas según daysCount
- Gap de 20px entre columnas
- Cards con border-radius 16px
- Gradientes sutiles de fondo

**Bloques de tareas:**
- Border-left 4px con color de categoría
- Background con color de categoría al 20%
- Hora en badge blanco
- Título y responsable claramente legibles
- Shadow suave para depth

**Leyenda:**
- Cards horizontales con color e icono
- Labels traducidos al español
- Layout centrado con flex-wrap

### Resultado:
- Usuario puede elegir entre 3 formatos de exportación
- CSV compatible con Excel y Google Sheets
- Imagen profesional lista para imprimir o compartir
- Feedback visual durante el proceso de exportación
- Diseño consistente con el resto de la aplicación
- TypeCheck exitoso sin errores
- Funcionalidad probada y operativa

---

## [2025-11-11] Botón de Contacto con Mailto Directo | Files: src/components/Header/index.tsx, ELEMENT_IDS.md | Estado: ✅ Exitoso

### Descripción del cambio:
- Eliminados los botones de navegación "Inicio" y "Abrir App" del header
- Agregado botón de contacto que abre cliente de email directamente
- Email de destino configurado: info@waza.baby
- Mensaje prellenado con asunto y cuerpo del correo
- Texto responsive: versión completa en desktop, versión corta en mobile

### Archivos modificados:
- **src/components/Header/index.tsx**: Reemplazados botones de navegación con botón mailto
- **ELEMENT_IDS.md**: Eliminados IDs 053 y 054, agregado ID 055
- **src/components/ContactForm/index.tsx**: Eliminado (no utilizado)

### Detalles técnicos:
- ID del botón: `header-contact-button-055`
- Acción: `mailto:info@waza.baby`
- Asunto prellenado: "Solicitud de aplicación personalizada - TidyHome"
- Cuerpo prellenado con plantilla de mensaje
- Icono: MessageCircle (lucide-react)
- Gradiente: `from-emerald-500 via-teal-500 to-cyan-500`
- Textos:
  - Desktop: "Contáctanos para crear aplicaciones como esta"
  - Mobile: "Contáctanos"

### Resultado:
Solución simple y directa sin dependencias externas. El botón abre el cliente de correo predeterminado del usuario con información prellenada.

---

## [2025-11-11] Rediseño Completo de la Interfaz de la App | Files: src/PlanificadorTareas.tsx | Estado: ✅ Exitoso

### Descripción del cambio:
- Rediseñada completamente la interfaz de PlanificadorTareas con diseño profesional y organizado
- Implementado sistema de cards organizadas con jerarquía visual clara
- Mejorando significativamente la UX con separación lógica de controles
- Añadidos iconos contextuales y efectos hover delightful
- Optimizado el responsive design para todos los dispositivos

### Mejoras de diseño implementadas:

#### 1. Toolbar Principal de Acciones Rápidas:
- **Card horizontal compacta** en la parte superior
- **Agrupación inteligente**: Acciones primarias (izquierda) y secundarias (derecha)
- **Separadores visuales** sutiles entre grupos de acciones
- **Botones optimizados** con tamaño sm y texto responsive (oculto en mobile)
- **Orden de prioridad**: Plan Auto → Agregar → Quick Add | Plantillas → Exportar/Importar → Vaciar

#### 2. Panel de Controles Reorganizado (Grid Layout):
**Filters Card (1/3 del ancho en desktop):**
- Icono distintivo de Filter con gradiente blue
- Título con uppercase tracking para jerarquía
- Dos filtros apilados verticalmente: Categoría y Responsable
- Labels mejorados con estilo uppercase y tracking-wide
- Select triggers con mejor hover y focus states
- Efecto hover con gradiente sutil en toda la card

**View & Navigation Card (2/3 del ancho en desktop):**
- **Sección Vista**:
  - Icono Eye con gradiente purple
  - Toggle de vistas con gradiente tricolor (blue-purple-pink)
  - Botones activos con gradientes específicos por vista
  - Checkbox de fin de semana con mejor styling
  - Separador vertical entre controles

- **Sección Navegación**:
  - Icono Calendar con gradiente pink
  - Separador horizontal con gradiente
  - WeekNav integrado elegantemente
  - Títulos de sección consistentes

#### 3. Elementos visuales añadidos:
- **Iconos contextuales**: Filter, Eye, Calendar (de lucide-react)
- **Badges de color**: Cards con gradientes blue, purple, pink
- **Efectos hover**: Shadow-glow en cards, scale en botones
- **Gradientes sutiles**: Overlay de color en hover (opacity 0→100)
- **Separadores**: Líneas verticales y horizontales con gradientes
- **Typography mejorada**: Uppercase tracking para títulos de sección

#### 4. Sistema de espaciado:
- Toolbar: mb-6, padding interno p-4
- Controls Panel: mb-8, padding interno p-5
- Gap entre cards: gap-4
- Espacio entre secciones internas: space-y-5
- Labels y campos: space-y-2

#### 5. Responsive Design:
- **Mobile**: Cards apiladas verticalmente (grid-cols-1)
- **Desktop**: Grid 1/3 + 2/3 (lg:grid-cols-3, lg:col-span-2)
- **Toolbar**: Flex column en mobile, row en desktop
- **Botones**: Texto oculto en mobile (.hidden.sm:inline)

### Cambios técnicos específicos:

**Imports añadidos:**
```typescript
import { Filter, Eye, Calendar } from "lucide-react";
```

**Estructura HTML reorganizada:**
- Toolbar (Card horizontal) → Controls Panel (Grid de 2 cards) → Main Content → Footer
- Eliminada estructura anterior de CardContent único
- Implementado grid layout responsive con Tailwind

**Clases Tailwind destacadas:**
- `group hover:shadow-glow` - Efectos hover en cards
- `lg:col-span-2` - Grid layout responsive
- `shadow-inner-soft` - Toggle de vistas con depth
- `focus:ring-2 focus:ring-blue-400/30` - Estados de foco mejorados

### Resultado:
- **Jerarquía visual clara**: Usuario identifica rápidamente cada sección
- **Agrupación lógica**: Controles relacionados están juntos
- **Mejor uso del espacio**: Grid layout aprovecha pantalla completa
- **Interfaz delightful**: Iconos, gradientes y animaciones cohesivos
- **Responsive excelente**: Se adapta perfectamente a mobile y desktop
- **Reducción de ruido visual**: Separación clara entre áreas funcionales
- **Experiencia premium**: Glassmorphism, shadows y efectos hover consistentes

### Líneas de código:
- **Antes**: 352 líneas
- **Después**: 384 líneas (+32 líneas para mejor organización)
- Mantiene regla de <400 líneas por archivo

### Testing:
- ✅ Todos los controles mantienen funcionalidad original
- ✅ IDs únicos preservados sin cambios
- ✅ Responsive design verificado
- ✅ Animaciones smooth funcionando
- ✅ Efectos hover y focus operativos

---

## [2025-11-11] Landing Page y Sistema de Routing Implementado | Files: src/pages/Landing.tsx, src/components/Header/index.tsx, src/pages/App.tsx, src/main.tsx, src/PlanificadorTareas.tsx, package.json | Estado: ✅ Exitoso

### Descripción del cambio:
- Implementada Landing Page profesional y atractiva
- Creado Header de navegación global limpio y responsive
- Configurado React Router con rutas "/" (landing) y "/app" (planificador)
- Refactorizado PlanificadorTareas para trabajar con Header global

### Archivos creados:
- `src/pages/Landing.tsx` - Landing page con hero section, features, benefits y CTAs
- `src/components/Header/index.tsx` - Header sticky con navegación y branding
- `src/pages/App.tsx` - Wrapper que combina Header + PlanificadorTareas

### Archivos modificados:
- `src/main.tsx` - Integrado React Router con BrowserRouter y Routes
- `src/PlanificadorTareas.tsx` - Removido header interno, limpiados imports
- `package.json` - Agregada dependencia react-router-dom

### Características de la Landing Page:
1. **Hero Section**:
   - Logo animado con CalendarClock icon
   - Título con gradientes blue-purple-pink
   - Botón CTA "Comenzar Ahora"
   - Estadísticas: 143+ plantillas, 3 vistas, 100% gratis
   - Background animado con elementos flotantes

2. **Features Section**:
   - 6 tarjetas de características principales
   - Iconos con gradientes coloridos (blue, purple, pink, emerald, orange, violet)
   - Animaciones hover con scale y glow effects
   - Glassmorphism design

3. **Benefits Section**:
   - 6 beneficios destacados con checkmarks animados
   - Grid responsive 2 columnas
   - Gradientes green-emerald en iconos

4. **Final CTA**:
   - Sección con gradiente blue-purple
   - Botón blanco contrastante
   - Mensaje sobre "sin registro"

5. **Footer**:
   - Branding consistente
   - Información de privacidad local

### Características del Header:
1. **Branding**:
   - Logo con gradiente blue-purple
   - Título "TidyHome" + subtítulo
   - Clickeable para navegar a home
   - Efectos hover con scale y glow

2. **Navegación**:
   - Botón "Inicio" (ghost variant)
   - Botón "Abrir App" (primary gradient)
   - Responsive: iconos en mobile, texto en desktop

3. **Diseño**:
   - Sticky positioning (top-0 z-50)
   - Glassmorphism con backdrop-blur
   - Border bottom sutil
   - Shadow soft

### Sistema de Routing:
- **"/"** → Landing page completa
- **"/app"** → App wrapper con Header + PlanificadorTareas
- BrowserRouter envuelve toda la aplicación
- useNavigate para navegación programática

### IDs Únicos Asignados:
**Landing Page:**
- `landing-hero-title-001` - Título principal del hero
- `landing-cta-button-002` - Botón CTA principal
- `landing-final-cta-003` - Botón CTA final

**Header:**
- `header-brand-001` - Logo y brand area
- `header-home-button-002` - Botón inicio
- `header-app-button-003` - Botón abrir app

### Elementos de Diseño:
- **Paleta de colores**: Blue (500-600), Purple (500-600), Pink (500-600)
- **Gradientes**: Blue-to-purple, purple-to-pink, indigo-to-blue
- **Animaciones**: float, bounce-gentle, slide-down, slide-up, fade-in
- **Glassmorphism**: backdrop-blur-md, bg-white/70
- **Shadows**: soft, strong, glow, glow-strong
- **Typography**: Font-display para títulos, font-sans para texto

### Resultado:
- Landing page profesional que comunica claramente el valor de la app
- Navegación fluida entre landing y aplicación
- Header consistente que refuerza el branding
- Diseño cohesivo con el resto de la aplicación
- Experiencia delightful y frictionless desde el primer contacto
- TypeCheck exitoso sin errores
- Dev server iniciado correctamente

---

## [2025-10-08] Generador automático de planes semanales | Files: src/services/weekPlanGenerator.ts, src/components/AutoPlanButton/index.tsx, src/PlanificadorTareas.tsx, ELEMENT_IDS.md | Estado: ✅ Exitoso

### Descripción del cambio:
- Implementado generador inteligente de planes semanales automáticos
- Combina tareas diarias recurrentes con tareas variables que cambian en cada generación
- Sistema de confirmación para evitar pérdida de datos existentes
- Estadísticas visuales del plan generado

### Archivos creados:
- `src/services/weekPlanGenerator.ts` - Servicio de generación de planes con lógica inteligente
- `src/components/AutoPlanButton/index.tsx` - Componente UI con diálogo interactivo

### Archivos modificados:
- `src/PlanificadorTareas.tsx` - Integrado botón de generación automática en header
- `ELEMENT_IDS.md` - Añadido ID auto-plan-button-014 y renumerados IDs subsecuentes

### Funcionalidades implementadas:
- **Generación automática**: Crea un plan completo con un solo clic
- **Tareas diarias**: 8 tareas esenciales que se repiten todos los días
- **Tareas variables**: Selección aleatoria de tareas semanales, mensuales y eventuales
- **Confirmación inteligente**: Advierte si hay tareas existentes antes de reemplazar
- **Estadísticas visuales**: Muestra distribución de tareas por categoría
- **Regeneración**: Permite generar múltiples planes hasta encontrar el ideal
- **Variación garantizada**: Cada plan es único gracias a la selección aleatoria

### Especificaciones técnicas:
- Algoritmo de distribución: 8 diarias + 10-14 semanales + 2-4 mensuales + 0-2 eventuales
- Asignación inteligente de horarios y responsables
- Prevención de duplicados con sistema de IDs únicos
- Dialog modal con glassmorphism y animaciones

### Resultado:
- Usuario puede generar planes completos automáticamente
- Planes variados que cambian en cada generación
- Interfaz elegante con feedback visual claro
- Experiencia fluida desde confirmación hasta aplicación

---

## [2025-08-17] Corrección de duplicados/tareas vacías y plantilla editable | Files: src/components/ChoreForm/index.tsx, src/components/QuickAdd/index.tsx, src/components/TemplateButton/index.tsx, src/components/EditableTemplateDialog/index.tsx, src/PlanificadorTareas.tsx | Estado: ✅ Exitoso

### Descripción del cambio:
- Corregido problema de creación de tareas vacías y duplicadas
- Implementada plantilla diaria editable personalizable
- Mejorada validación de formularios para prevenir tareas sin título
- Añadida protección contra doble envío de formularios
- Implementado sistema de feedback visual durante el procesamiento

### Problemas solucionados:
1. **Tareas vacías**: Añadida validación estricta para prevenir tareas con títulos vacíos
2. **Duplicados**: Implementado sistema de debounce para prevenir doble clic en formularios
3. **Plantilla no editable**: Creado componente EditableTemplateDialog para personalizar plantillas diarias

### Cambios técnicos:
- ChoreForm: Añadido estado `isSubmitting` y validación de título obligatorio
- QuickAdd: Mejorada validación y reset automático después de agregar tareas
- TemplateButton: Implementado estado `isApplying` para prevenir múltiples ejecuciones
- EditableTemplateDialog: Nuevo componente con editor completo de plantillas personalizables
- Limpieza de imports no utilizados en varios componentes

### Funcionalidades añadidas:
- Editor de plantilla diaria con capacidad de agregar/eliminar/modificar tareas
- Validación de datos en tiempo real antes de crear tareas
- Feedback visual con estados de carga en botones
- Restauración a plantilla por defecto
- Sistema de IDs únicos para todos los elementos nuevos

## [2025-01-17] Corrección de problemas en TaskDetailView | Files: src/components/ChoreBlock/index.tsx, src/views/TaskDetailView/index.tsx | Estado: ✅ Exitoso

### Descripción del cambio:
- Corregido problema de superposición del modal con elementos de fondo usando Dialog de shadcn/ui
- Reparado botón de cerrar que no respondía correctamente
- Solucionado botón de editar que no abría el formulario de edición
- Eliminados wrappers innecesarios de posicionamiento fijo del modal
- Modal ahora se renderiza correctamente dentro del componente Dialog
- Mejorado manejo de z-index y backdrop para evitar conflictos visuales

### Cambios técnicos:
- TaskDetailView ahora funciona dentro de DialogContent sin posicionamiento fijo propio
- ChoreBlock usa Dialog para envolver TaskDetailView correctamente
- Eliminado callback incorrecto en onDelete de ChoreForm

## [2025-08-17] Elegant TaskDetailView Implementation | Files: src/views/TaskDetailView/*, src/components/ChoreBlock/*, src/components/TaskDetailDemo/* | Estado: ✅ Exitoso

### Descripción del cambio:
- Implementada nueva vista detallada de tareas con diseño elegante y responsivo
- Muestra información completa de la tarea antes de permitir edición
- Integración seamless con el componente ChoreBlock existente
- Diseño glassmorphism con animaciones y efectos visuales premium
- Soporte completo para conflict indicators y responsive design
- Sistema de IDs únicos implementado siguiendo CLAUDE.md guidelines

### Archivos creados:
- src/views/TaskDetailView/index.tsx - Componente principal de vista detallada
- src/components/TaskDetailDemo/index.tsx - Componente demo para testing

### Archivos modificados:
- src/components/ChoreBlock/index.tsx - Integrada navegación a TaskDetailView
- ELEMENT_IDS.md - Añadidos IDs task-detail-*-033 a 043
- src/PlanificadorTareas.tsx - Añadido componente demo temporal

### Características implementadas:
- Vista detallada con información organizada visualmente
- Transición smooth entre vista detallada y modo edición
- Responsive design para móvil y desktop
- Animaciones de entrada y hover effects
- Categoría visual con colores dinámicos
- Indicadores de conflicto de horario
- Botones de acción con feedback visual
- Clean code modular <200 líneas

## [2025-08-17] Nueva Vista Semanal en Cuadrícula (WeeklyGridView) | Files: src/views/WeeklyGridView/*, src/PlanificadorTareas.tsx, src/styles/grid.css | Estado: ✅ Exitoso

### Descripción del cambio:
- Implementada nueva vista semanal en cuadrícula con horarios en columna fija
- Sistema de navegación actualizado: Semana / Cuadrícula / Día
- Diseño responsivo con scroll horizontal para múltiples días
- Efectos glassmorphism y animaciones smooth
- Drag & drop mantenido entre columnas de días

### Archivos creados:
- src/views/WeeklyGridView/index.tsx - Componente principal de vista en cuadrícula
- src/styles/grid.css - Estilos específicos para la cuadrícula

### Archivos modificados:
- src/PlanificadorTareas.tsx - Integrada nueva vista y toggle de 3 estados
- src/main.tsx - Importados estilos CSS de cuadrícula
- ELEMENT_IDS.md - Añadido view-toggle-grid-013

### Características implementadas:
- **Layout en cuadrícula**: Columna de horas fija + columnas de días
- **Scroll horizontal**: Navegación fluida entre días
- **Responsive design**: Adaptación automática a diferentes pantallas
- **Efectos visuales**: Glassmorphism, hover effects, animaciones
- **Día actual**: Resaltado especial con gradientes
- **Drag & drop**: Funcionalidad mantenida entre días
- **Empty states**: Estados vacíos elegantes con hints visuales

### Especificaciones técnicas:
- Grid CSS con columnas dinámicas
- Columna de horas sticky con z-index optimizado
- Horarios de 7:00-21:00 con intervalos de 1 hora
- Ancho de columna: 160px mínimo
- Scroll horizontal con scrollbar estilizada
- Hover effects y transiciones de 0.3s

### Resultado:
- Nueva vista disponible en el toggle de navegación
- Experiencia visual mejorada para vista semanal
- Mejor aprovechamiento del espacio horizontal
- Interfaz intuitiva con feedback visual inmediato

---

## [2025-08-17] Initial Refactoring | Files: Multiple | Status: ✅ Exitoso
- Separated monolithic 1355-line file into modular structure
- Created type definitions and constants modules
- Extracted utility functions for time, dates, conflicts, and labels
- Separated data templates and default chores
- Created reusable hooks for local storage
- Established component structure foundation
- Added element ID tracking system

## [2025-08-17] Project Structure Setup | Files: Various directories | Status: ✅ Exitoso
- Created src/ directory structure
- Organized modules into logical folders:
  - types/ - Type definitions
  - constants/ - App constants
  - utils/ - Utility functions
  - data/ - Data templates and defaults
  - hooks/ - Custom React hooks
  - components/ - UI components
  - services/ - Business logic services
  - views/ - Page views

## [2025-08-17] Documentation Setup | Files: ELEMENT_IDS.md, REFACTORING_SUMMARY.md | Status: ✅ Exitoso
- Created element ID catalog for UI tracking
- Documented refactoring approach and benefits
- Established file structure documentation

## [2025-08-17] Complete App Implementation | Files: Multiple components and views | Status: ✅ Exitoso
- Implemented ChoreBlock component with full drag and resize functionality
- Created ChoreForm component with catalog integration
- Built QuickAdd component for template-based task creation
- Implemented AddChoreDialog and TemplateButton components
- Created WeekView and DayView components with full calendar functionality
- Built main PlanificadorTareas.tsx component with simplified, modular logic

## [2025-08-17] Project Configuration | Files: package.json, tsconfig.json, vite.config.ts, etc. | Status: ✅ Exitoso
- Created complete Vite + React + TypeScript configuration
- Added all required dependencies (React, Radix UI, Lucide React, TailwindCSS)
- Configured path aliases and build settings
- Added test framework setup (Vitest)
- Created main.tsx entry point and index.html

## [2025-08-17] UI Components Library | Files: src/components/ui/*.tsx | Status: ✅ Exitoso
- Implemented complete shadcn/ui component library
- Created Button, Card, Dialog, Input, Label, Select components
- Added proper TypeScript types and accessibility features
- Integrated Radix UI primitives for robust functionality

## [2025-08-17] Test Infrastructure | Files: src/utils/tests.ts | Status: ✅ Exitoso
- Created comprehensive test utilities module
- Added unit tests for time calculations, conflict detection, and date utilities
- Implemented automated test runner for development validation

## [2025-08-17] Enhanced Conflict Indicators | Files: src/components/ChoreBlock/index.tsx | Status: ✅ Exitoso
- Improved conflict alert design with responsive sizing
- Added dynamic sizing based on task height (small: 6x6, medium: 8x8, large: 10x10)
- Implemented pulsing background effect for better visibility
- Added tooltip with detailed conflict information for larger tasks
- Enhanced visual hierarchy with gradient backgrounds and shadows