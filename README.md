# Rotary Club Arica - Web Application ⚙️

¡Bienvenido al repositorio oficial del **Rotary Club Arica**! 
Esta aplicación web moderna es el sitio institucional del club, diseñado no solo para presentar de forma atractiva la esencia de la organización, sino también para dotar a los administradores de un **Panel de Gestión Integral** (Admin Dashboard) desde donde puedan administrar los contenidos fácilmente.

## 🚀 Tecnologías Usadas

El proyecto está construido bajo una arquitectura robusta y moderna, utilizando las mejores herramientas del ecosistema actual:

* **[Next.js](https://nextjs.org/) (App Router)**: Framework principal para React, usando la nueva estructura `/app` que permite renderizado del lado del servidor (SSR), generación estática (SSG) y rutas de API avanzadas.
* **[React 19](https://react.dev/)**: Librería subyacente para la construcción de interfaces interactivas empleando Server Components.
* **[TypeScript](https://www.typescriptlang.org/)**: Provee tipado estático, reduciendo errores durante el desarrollo y mejorando la calidad y mantenimiento del código.
* **[Supabase](https://supabase.com/)**: Plataforma Backend-as-a-Service (BaaS) open-source utilizada para:
  * **Autenticación (@supabase/ssr)**: Manejo seguro de sesiones (cookies) y protección de las rutas administrativas.
  * **Base de Datos (PostgreSQL)**: Almacenamiento eficiente de la información de eventos, fotos y publicaciones.
  * **Storage (Almacenamiento)**: Para guardar los archivos PDF del boletín "El Papelito" y las imágenes de la galería.
* **Estilos y UI**:
  * **Bootstrap (CSS/Icons)**: Sistema base para maquetar de forma rápida y netamente *responsive*.
  * **Vanilla CSS (`globals.css`)**: Para personalización de marca con un diseño moderno (glassmorphism leves, dark themes en paneles y paleta de colores oficial estilo Rotary Gold/Blue).

## 📐 Arquitectura del Proyecto

El código está estructurado fuertemente alrededor de las directrices del **App Router** de Next.js. Las carpetas principales son:

```text
rotary-arica-web/
├── app/                  # Next.js App Router (Rutas de la aplicación)
│   ├── admin/            # 🔒 Panel de Administración (requiere sesión en Supabase)
│   │   ├── eventos/      # CRUD para Eventos del calendario
│   │   ├── galeria/      # Gestión de Fotos (Upload a Storage)
│   │   ├── papelito/     # Gestión del Boletín PDF
│   │   └── login/        # Acceso de Administradores
│   ├── globals.css       # Estilos globales y paleta de colores de Rotary
│   ├── layout.tsx        # Layout principal de la web pública
│   └── page.tsx          # Landing Page Institucional
├── components/           # Componentes Reutilizables de React
│   ├── Calendar.tsx      # Calendario dinámico
│   ├── Countdown.tsx     # Temporizador para eventos especiales
│   └── Gallery.tsx       # Visor moderno de imágenes
├── public/               # Archivos estáticos accesibles directamente
│   └── assets/           # Logos institucionales (RotaryMoE), iconos, etc.
├── utils/
│   └── supabase/         # Helpers de Supabase (@supabase/ssr)
│       ├── middleware.ts # Protección de middleware y actualización de JWT
│       ├── server.ts     # Cliente para Server Components
│       └── client.ts     # Cliente para Client Components
└── package.json          # Dependencias y scripts
```

## ✨ Funcionalidades Principales

### 🌐 Portal Público Institucional (Landing Page)
1. **Hero & Identidad**: Muestra la misión, visión y los valores fundamentales "Dar de sí antes de pensar en sí".
2. **Calendario de Eventos Dinámico**: Se alimenta directamente desde Supabase. Los usuarios pueden ver la fecha, título y detalles de las próximas acciones rotarias.
3. **Galería Fotográfica**: Muro en estilo albañilería (masonry/grid) donde los rotarios y visitantes ven las obras y reuniones en fotografías cacheadas para alto rendimiento.
4. **El Papelito Viewer**: Un lector de PDFs integrado amigable (gerontodiseño) enfocado en una alta legibilidad para que el socio acceda fácilmente al boletín quincenal del club.

### 🔒 Panel de Administración (`/admin`)
Para ingresar al sistema se requiere autenticación gestionada por Supabase Auth:
* **Dashboard Estadístico**: Vista general de todo el sitio.
* **Módulo "Eventos"**: Permite agregar, editar y eliminar eventos, los cuales se reflejan automáticamente en el calendario de la Landing Page.
* **Módulo "Galería"**: Sistema para subir fotografías directamente al bucket local/remoto de Storage y presentarlos en la portada.
* **Módulo "El Papelito"**: Carga masiva y metadatos de los boletines oficiales en formato `.pdf`.

## 🎨 Enfoque de Diseño y UX

El diseño está centrado en entregar una **apariencia premium y corporativa**, evocando confianza y la larga trayectoria rotaria:
- **Responsive Web Design**: Mobile-first, garantizando que el sitio se vea espectacular desde celulares hasta Smart TVs.
- **Micro-interacciones**: Efectos "hover" fluidos, transiciones suaves y estados de carga precisos.
- **Gerontodiseño (Accesibilidad)**: Considerando la demografía habitual del club, las herramientas interactivas, como el lector de PDFs ("Papelito"), tienen botones de navegación grandes, fuentes muy legibles, soporte de zoom y buen constraste.
- **Uso de Colores Oficiales**: Respetando el "Color Branding" mundial de Rotary.

## 🛠️ Guía de Instalación y Desarrollo Local

### 1. Clonar el repositorio y Dependencias
```bash
git clone <tu-repositorio>
cd rotary-arica-web
npm install
```

### 2. Configuración de Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto. Deberás proporcionar las credenciales de tu proyecto de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
# Opcional si usas scripts de bases de datos
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key 
```

### 3. Servidor de Desarrollo
Para arrancar el sitio en tu máquina local:
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---
*Hecho para el Rotary Club Arica. Servir para Cambiar Vidas.*
