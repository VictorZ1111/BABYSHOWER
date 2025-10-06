/**
 * ========================================================================================
 * CONFIGURACIÓN ESLINT: Baby Shower App - Linting y Calidad de Código
 * ========================================================================================
 * 
 * Este archivo configura ESLint v9+ (flat config) para mantener calidad de código
 * y consistencia en el proyecto React + TypeScript. Incluye reglas específicas
 * para React Hooks, Hot Module Replacement y mejores prácticas de desarrollo.
 */

/**
 * IMPORTACIÓN DE PLUGINS Y CONFIGURACIONES BASE
 * ============================================
 */

// Configuración base de JavaScript con reglas fundamentales  
import js from '@eslint/js'

// Variables globales definidas por entorno (browser, node, etc.)
import globals from 'globals'

// Plugin para reglas específicas de React Hooks
import reactHooks from 'eslint-plugin-react-hooks'

// Plugin para optimización de React Fast Refresh (HMR)
import reactRefresh from 'eslint-plugin-react-refresh'

// Configuraciones predefinidas de TypeScript para ESLint
import tseslint from 'typescript-eslint'

// Utilidades de configuración para ESLint v9 flat config
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * CONFIGURACIÓN PRINCIPAL DE ESLINT
 * ================================
 * 
 * Utiliza el nuevo formato "flat config" de ESLint v9+ que reemplaza
 * el archivo .eslintrc.json por una configuración más flexible y modular.
 */
export default defineConfig([
  /**
   * ARCHIVOS GLOBALMENTE IGNORADOS
   * =============================
   * 
   * Directorios y archivos que ESLint debe ignorar completamente
   * durante el análisis de código.
   */
  globalIgnores(['dist']),        // Ignora directorio de build de producción
  
  /**
   * CONFIGURACIÓN PRINCIPAL PARA ARCHIVOS TYPESCRIPT/REACT
   * =====================================================
   * 
   * Reglas y configuraciones aplicadas específicamente a archivos
   * TypeScript (.ts) y TypeScript React (.tsx).
   */
  {
    /**
     * PATRONES DE ARCHIVOS OBJETIVO
     * ===========================
     * 
     * Define qué archivos serán analizados por esta configuración.
     * Usa glob patterns para capturar todos los archivos TS/TSX.
     */
    files: ['**/*.{ts,tsx}'],     // Aplica a todos los archivos TypeScript y TSX
    
    /**
     * CONFIGURACIONES EXTENDIDAS
     * =========================
     * 
     * Conjunto de configuraciones predefinidas que se aplicarán
     * como base, cada una aporta un conjunto específico de reglas.
     */
    extends: [
      js.configs.recommended,                    // Reglas base de JavaScript recomendadas
      tseslint.configs.recommended,              // Reglas TypeScript recomendadas
      reactHooks.configs['recommended-latest'],  // Reglas React Hooks más recientes
      reactRefresh.configs.vite,                 // Optimizaciones para Vite HMR
    ],
    
    /**
     * CONFIGURACIÓN DE LENGUAJE Y ENTORNO
     * ==================================
     * 
     * Especifica la versión de ECMAScript y las variables globales
     * disponibles en el entorno de ejecución.
     */
    languageOptions: {
      ecmaVersion: 2020,          // Soporte para sintaxis ES2020 (async/await, optional chaining, etc.)
      globals: globals.browser,   // Variables globales del navegador (window, document, fetch, etc.)
    },
  },
])

/**
 * ========================================================================================
 * RESUMEN DEL ARCHIVO: eslint.config.js
 * ========================================================================================
 * 
 * PROPÓSITO PRINCIPAL:
 * Este archivo configura ESLint con el nuevo formato "flat config" para mantener
 * calidad de código, consistencia de estilo y detectar errores potenciales en
 * una aplicación React + TypeScript construida con Vite.
 *
 * ARQUITECTURA DE CONFIGURACIÓN:
 * - Flat Config Format: Utiliza el nuevo estándar ESLint v9+ más flexible
 * - Configuración Modular: Extiende múltiples configs especializados
 * - TypeScript First: Optimizado para proyectos TypeScript + React
 * - Vite Integration: Configurado específicamente para bundling con Vite
 *
 * PLUGINS Y REGLAS INCLUIDAS:
 * 1. @eslint/js: Reglas fundamentales de JavaScript (syntax errors, best practices)
 * 2. typescript-eslint: Type checking, interfaces, generics, TypeScript-specific rules
 * 3. react-hooks: Rules of Hooks, dependency arrays, hook usage patterns
 * 4. react-refresh: HMR optimization, component naming for Fast Refresh
 *
 * REGLAS DESTACADAS APLICADAS:
 * - JavaScript: no-unused-vars, no-undef, prefer-const, etc.
 * - TypeScript: @typescript-eslint/no-explicit-any, strict type checking
 * - React Hooks: exhaustive-deps, rules-of-hooks validation
 * - React Refresh: only-export-components para optimización HMR
 *
 * CONFIGURACIÓN DE ENTORNO:
 * - ECMAScript 2020: Soporte para optional chaining, nullish coalescing, etc.
 * - Browser Globals: window, document, fetch, localStorage, etc. disponibles
 * - Archivos Objetivo: Solo .ts y .tsx (ignora .js para proyectos TS puros)
 * - Ignores: Directorio dist/ excluido del análisis
 *
 * INTEGRACIÓN CON HERRAMIENTAS:
 * - VS Code: Extensión ESLint proporciona linting en tiempo real
 * - Vite: ESLint se ejecuta durante development y build
 * - Pre-commit Hooks: Puede integrarse con husky/lint-staged
 * - CI/CD: Validación automática en pipelines de deployment
 *
 * BENEFICIOS PARA EL PROYECTO BABY SHOWER:
 * - Prevención de errores en hooks de Instagram API integration
 * - Validación de tipos en interfaces de Cloudinary y APIs externas
 * - Detección de dependency arrays incorrectos en useEffect
 * - Optimización automática de React Fast Refresh para mejor DX
 * - Consistency en código de múltiples desarrolladores
 *
 * COMANDOS RELACIONADOS:
 * - `npm run lint`: Ejecuta ESLint en todo el proyecto
 * - `npm run lint:fix`: Ejecuta ESLint y corrige automáticamente errores
 * - VS Code auto-fix on save disponible con configuración apropiada
 *
 * CASOS DE USO:
 * - Proyectos React + TypeScript con requisitos de calidad de código
 * - Aplicaciones con APIs complejas que requieren type safety
 * - Equipos de desarrollo que necesitan consistencia de código
 * - Proyectos con deployment automatizado que requiere validación
 * - Aplicaciones con hooks complejos y state management avanzado
 * ========================================================================================
 */
