# PartHub - Marketplace de Repuestos para Autos y Motos

PartHub es un marketplace moderno para la compra y venta de repuestos, artículos y accesorios para carros y motos. La plataforma conecta a compradores con empresas verificadas que ofrecen productos de calidad.

## Características

- Catálogo de productos con filtros avanzados
- Búsqueda de productos por nombre, categoría, marca, etc.
- Visualización detallada de productos con imágenes, descripciones y especificaciones
- Carrito de compras para gestionar los productos seleccionados
- Sistema de autenticación para usuarios registrados y empresas
- Perfiles de vendedores verificados
- Diseño responsive para una experiencia óptima en todos los dispositivos

## Tecnologías utilizadas

- React 19
- TypeScript
- React Router 7
- TailwindCSS 4
- React Query
- Axios
- Vite
- trigger 1 2 3 4 5 6 7 9

## Requisitos previos

- Node.js 18.0 o superior
- npm 9.0 o superior

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/parthub.git
cd parthub
```

2. Instala las dependencias:
```bash
cd frontend
npm install
```

## Ejecución en desarrollo

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo de Vite. La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

## Construcción para producción

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos optimizados se generarán en el directorio `dist`.

Para previsualizar la versión de producción localmente:

```bash
npm run preview
```

## Estructura del proyecto

```
frontend/
├── public/            # Archivos estáticos
├── src/
│   ├── assets/        # Imágenes, fuentes y otros recursos
│   ├── components/    # Componentes reutilizables
│   │   ├── layout/    # Componentes de layout (Navbar, Footer, etc.)
│   │   └── ui/        # Componentes de UI (Button, Card, etc.)
│   ├── context/       # Contextos de React (Auth, Cart, etc.)
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Componentes de página
│   ├── services/      # Servicios para API y otras funcionalidades
│   ├── types/         # Definiciones de tipos TypeScript
│   ├── utils/         # Funciones utilitarias
│   ├── App.tsx        # Componente principal
│   ├── main.tsx       # Punto de entrada
│   └── index.css      # Estilos globales
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Desarrollo

### Convenciones de código

- Utilizamos componentes funcionales con hooks
- Preferimos TypeScript para todo el código
- Seguimos las convenciones de ESLint para mantener un código limpio
- Utilizamos TailwindCSS para los estilos

### Flujo de trabajo

1. Crea una nueva rama para cada característica o corrección
2. Desarrolla y prueba localmente
3. Envía un pull request a la rama principal
4. Después de la revisión, fusiona los cambios

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Authors
Crackmilo
Crackrcia
--
