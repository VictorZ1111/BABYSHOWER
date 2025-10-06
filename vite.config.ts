import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

/**
 * ========================================================================================
 * RESUMEN DEL ARCHIVO: vite.config.ts
 * ========================================================================================
 * 
 * PROPÓSITO PRINCIPAL:
 * Este archivo configura Vite como build tool y development server para la aplicación
 * React de baby shower, optimizando el desarrollo local y el build de producción con
 * herramientas modernas y experimentales como React Compiler.
 *
 * ARQUITECTURA DE BUILD:
 * - Vite como bundler principal (sustituto de webpack)
 * - TypeScript configuración integrada
 * - React Plugin oficial para JSX y Fast Refresh
 * - React Compiler experimental para optimizaciones automáticas
 * - Hot Module Replacement (HMR) para desarrollo instantáneo
 *
 * CARACTERÍSTICAS TÉCNICAS:
 * 1. **Fast Development**: Server de desarrollo ultra-rápido con ES modules
 * 2. **React Fast Refresh**: HMR específico para React sin perder state
 * 3. **TypeScript Native**: Soporte nativo TypeScript sin configuración extra
 * 4. **React Compiler**: Optimizaciones automáticas experimentales de React 19
 * 5. **Build Optimization**: Tree-shaking y code-splitting automáticos
 *
 * REACT COMPILER EXPERIMENTAL:
 * - Plugin babel-plugin-react-compiler de React 19
 * - Optimiza automáticamente componentes sin memoization manual
 * - Elimina la necesidad de useMemo, useCallback, React.memo en muchos casos
 * - Mejora performance sin cambios de código del desarrollador
 * - Análisis estático para detectar oportunidades de optimización
 *
 * FLUJO DE DESARROLLO:
 * 1. `npm run dev`: Inicia servidor de desarrollo con HMR
 * 2. Vite sirve archivos usando ES modules nativos
 * 3. React Plugin maneja transformación JSX → JavaScript
 * 4. React Compiler optimiza componentes automáticamente
 * 5. Fast Refresh preserva state durante cambios de código
 * 6. TypeScript checking en paralelo para type safety
 *
 * FLUJO DE PRODUCCIÓN:
 * 1. `npm run build`: Build optimizado para producción
 * 2. Rollup bundling con tree-shaking automático
 * 3. Code splitting para cargas optimales
 * 4. Minification y compression de assets
 * 5. Optimización de imports y eliminación de dead code
 * 6. Generación de manifest para cache busting
 *
 * OPTIMIZACIONES AUTOMÁTICAS:
 * - ES Module imports nativos en desarrollo
 * - Dependency pre-bundling para node_modules
 * - CSS code splitting automático
 * - Asset processing (imágenes, fuentes, etc.)
 * - Source maps para debugging
 * - Build cache para velocidad incremental
 *
 * INTEGRACIÓN CON BABY SHOWER APP:
 * - Desarrollo de componentes con animaciones Framer Motion
 * - Build optimizado de assets (imágenes del baby shower)
 * - Bundling eficiente de dependencias (React, TypeScript, APIs)
 * - Optimización automática de hooks complejos (useInstagramUpload)
 * - Fast refresh durante desarrollo de animaciones complejas
 *
 * CONFIGURACIONES IMPLÍCITAS (POR DEFECTO):
 * - Puerto desarrollo: 5173 (configurable con --port)
 * - Output directory: dist/ (usado por vercel.json)
 * - Soporte automático para .env files
 * - Alias @/ para src/ directory
 * - Optimización de imports de node_modules
 *
 * COMANDOS RELACIONADOS:
 * - `npm run dev`: Desarrollo local con HMR
 * - `npm run build`: Build de producción optimizado
 * - `npm run preview`: Preview del build local
 * - `vite --host`: Expone server a red local
 * - `vite build --watch`: Build incremental
 *
 * CASOS DE USO:
 * - Aplicaciones React modernas con TypeScript
 * - Proyectos que requieren HMR rápido y eficiente
 * - Apps con dependencias complejas que necesitan bundling optimizado
 * - Desarrollo con React 19 experimental features
 * - Proyectos que priorizan developer experience y build speed
 *
 * VENTAJAS SOBRE WEBPACK:
 * - Startup tiempo: ~10x más rápido en desarrollo
 * - HMR: Instantáneo vs segundos en webpack
 * - Configuración: Minimal vs extensa configuración
 * - Build speed: Rollup optimizado vs webpack complejo
 * - ES Modules: Nativo vs polyfill/transpilation
 * ========================================================================================
 */
