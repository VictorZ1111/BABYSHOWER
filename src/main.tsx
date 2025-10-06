/**
 * ========================================================================================
 * PUNTO DE ENTRADA PRINCIPAL: main.tsx - Bootstrap de la Aplicación React
 * ========================================================================================
 * 
 * Este archivo es el punto de entrada principal de la aplicación React que configura
 * el renderizado inicial, importa estilos globales y monta el componente raíz en el DOM.
 * Utiliza la nueva API de React 18 con createRoot para renderizado concurrente.
 */

/**
 * IMPORTACIONES PRINCIPALES
 * ========================
 */

// React 18 StrictMode para detección de problemas y mejores prácticas
import { StrictMode } from 'react'

// Nueva API de renderizado de React 18 para renderizado concurrente
import { createRoot } from 'react-dom/client'

// Estilos globales de la aplicación (reset, variables CSS, fuentes)
import './index.css'

// Componente principal de la aplicación
import App from './App.tsx'
// Componente de prueba temporal
import TestApp from './TestApp.tsx'

/**
 * CONFIGURACIÓN DE RENDERIZADO PRINCIPAL
 * =====================================
 * 
 * Inicializa la aplicación React utilizando la nueva API createRoot de React 18
 * que habilita funcionalidades como renderizado concurrente y actualizaciones automáticas.
 * 
 * Flujo de inicialización:
 * 1. Busca el elemento DOM con id 'root' (definido en index.html)
 * 2. Crea un root de React 18 con capacidades concurrentes  
 * 3. Renderiza la aplicación envuelta en StrictMode para debugging
 * 4. Monta todos los componentes y inicia el ciclo de vida de React
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 
      STRICT MODE: Wrapper de Desarrollo
      =================================
      
      StrictMode es un wrapper que ayuda a:
      - Detectar componentes con efectos secundarios inseguros
      - Advertir sobre APIs obsoletas o deprecated
      - Detectar renders adicionales inesperados  
      - Validar que los effects tienen cleanup apropiado
      - Solo afecta desarrollo, se elimina automáticamente en producción
    */}
    <TestApp />
  </StrictMode>,
)

/**
 * ========================================================================================
 * RESUMEN DEL ARCHIVO: main.tsx
 * ========================================================================================
 * 
 * PROPÓSITO PRINCIPAL:
 * Este archivo actúa como el bootstrap o punto de arranque de la aplicación React,
 * configurando el renderizado inicial y estableciendo el contexto base para toda
 * la aplicación de baby shower.
 * 
 * ARQUITECTURA DE INICIALIZACIÓN:
 * - Utiliza React 18 createRoot API para renderizado concurrente avanzado
 * - Implementa StrictMode para debugging y best practices durante desarrollo
 * - Importa estilos globales antes del montaje de componentes
 * - Proporciona type safety con TypeScript (.tsx extension)
 * 
 * CARACTERÍSTICAS TÉCNICAS:
 * - Renderizado Concurrente: React 18 permite interrumpir y reanudar renders
 * - Automatic Batching: Múltiples actualizaciones de estado se agrupan automáticamente  
 * - Suspense Ready: Preparado para lazy loading y data fetching patterns
 * - Server Components Compatible: Base para futuras implementaciones SSR
 * - Strict Mode Validation: Debugging avanzado durante desarrollo
 * 
 * FLUJO DE EJECUCIÓN:
 * 1. Se ejecuta cuando el navegador carga el bundle JavaScript
 * 2. Importa y aplica estilos globales CSS inmediatamente
 * 3. Busca el elemento #root en el DOM (desde index.html)
 * 4. Crea root de React con capacidades concurrentes
 * 5. Monta App component dentro de StrictMode wrapper
 * 6. Inicia el ciclo de vida completo de React (render, commit, effects)
 * 
 * OPTIMIZACIÓN Y PERFORMANCE:
 * - createRoot habilita time slicing para renders no bloqueantes
 * - StrictMode ayuda a identificar problemas de performance temprano
 * - TypeScript compilation-time checks reducen runtime errors
 * - Tree shaking automático de imports no utilizados
 * - CSS import optimizado por bundler (Vite)
 * 
 * CASOS DE USO:
 * - Punto de entrada para cualquier aplicación React 18+
 * - Base para aplicaciones SPA (Single Page Application)
 * - Bootstrap para aplicaciones con TypeScript
 * - Inicialización de aplicaciones que requieren StrictMode validation
 * - Setup base para aplicaciones que usarán Concurrent Features
 * 
 * DEPENDENCIAS CLAVE:
 * - React 18+ para createRoot API y Concurrent Features
 * - react-dom/client para nuevas APIs de renderizado
 * - TypeScript para type safety y mejor developer experience
 * - Bundler compatible (Vite) para resolución de imports y CSS
 * 
 * CONSIDERACIONES DE DESARROLLO:
 * - StrictMode causa double-rendering en desarrollo para detectar side effects
 * - El operador ! en getElementById asume que el elemento existe (type assertion)
 * - Import de CSS global debe ocurrir antes del componente App
 * - Archivo minimalista por diseño, la lógica compleja va en App.tsx
 * ========================================================================================
 */
