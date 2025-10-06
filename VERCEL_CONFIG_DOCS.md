# Documentación: vercel.json

## CONFIGURACIÓN VERCEL: Baby Shower App - Deployment y Routing Configuration

Este archivo configura el deployment en Vercel para la aplicación React SPA, especificando el proceso de build, directorio de distribución y reglas de routing necesarias para el correcto funcionamiento de una Single Page Application.

### Estructura del Archivo

```json
{
  "version": 2,              // Versión de la API de Vercel
  "builds": [...],           // Configuración de build process
  "routes": [...]            // Reglas de routing para SPA
}
```

### Elementos Principales

#### 1. Version
- **"version": 2**: Especifica la versión de la plataforma Vercel a utilizar
- La versión 2 es la actual y soporta todas las funcionalidades modernas

#### 2. Builds Configuration
- **"src": "package.json"**: Indica a Vercel que use package.json como punto de entrada
- **"use": "@vercel/static-build"**: Builder oficial para aplicaciones estáticas como React apps
- **"distDir": "dist"**: Especifica dónde Vite genera los archivos de build de producción

#### 3. Routes (Rewrite Rules)
- **"src": "/(.*)"**: Patrón regex que captura todas las rutas posibles
- **"dest": "/index.html"**: Redirige todas las rutas a index.html para SPA functionality

## ARQUITECTURA DE DEPLOYMENT

### Static Build Process
- Aplicación se construye como archivos estáticos optimizados
- SPA Routing: Todas las rutas se redirigen a index.html para client-side routing
- Vite Integration: Configurado específicamente para builds de Vite
- CDN Distribution: Archivos servidos desde CDN global de Vercel

### Proceso de Deployment
1. Vercel detecta push a repositorio conectado (GitHub)
2. Ejecuta `npm install` para instalar dependencias
3. Ejecuta `npm run build` (script definido en package.json)
4. Vite genera archivos optimizados en directorio dist/
5. Vercel despliega contenido de dist/ a CDN global
6. Aplica reglas de routing para SPA functionality

## CARACTERÍSTICAS DEL DEPLOYMENT

### Funcionalidades Automáticas
- **Zero Configuration**: Mínima configuración necesaria
- **Automatic Builds**: Build automático en cada commit
- **Global CDN**: Distribución mundial con baja latencia
- **HTTPS Automático**: SSL/TLS certificates automáticos
- **Preview Deployments**: Cada PR genera un preview único
- **Domain Management**: Soporte para dominios custom

### SPA Routing Support
- **Catch-All Route**: `/(.*)`captura todas las rutas posibles
- **Client-Side Routing**: React Router maneja navegación interna
- **History API**: Soporte completo para browser history
- **Direct URL Access**: URLs directas funcionan correctamente
- **Refresh Support**: F5/refresh mantiene la ruta actual

## OPTIMIZACIONES INCLUIDAS

### Performance
- **Static Asset Caching**: Archivos estáticos cacheados automáticamente
- **Gzip/Brotli Compression**: Compresión automática de assets
- **HTTP/2 Support**: Protocolo HTTP/2 habilitado por defecto
- **Edge Caching**: Contenido cacheado en edge locations globales
- **Build Cache**: Dependencias cacheadas entre builds para velocidad

### Flujo para Baby Shower App
1. Usuario visita cualquier URL (ej: `/gallery`, `/upload`)
2. Vercel intercepta la request con routing rule
3. Sirve `index.html` independientemente de la ruta
4. React app se carga y React Router toma control
5. React Router renderiza el componente apropiado para la ruta
6. Usuario ve la página correcta sin reload completo

## ENVIRONMENT VARIABLES

### Configuración
- Variables de entorno se configuran en Vercel Dashboard
- `VITE_*` variables son inyectadas durante build time
- Instagram API tokens y Cloudinary configs van aquí
- Diferentes valores para Preview vs Production deployments

### Variables Críticas para Baby Shower App
```
VITE_INSTAGRAM_ACCESS_TOKEN=<token>
VITE_INSTAGRAM_ACCOUNT_ID=<id>
VITE_CLOUDINARY_CLOUD_NAME=<name>
VITE_CLOUDINARY_UPLOAD_PRESET=<preset>
```

## COMANDOS RELACIONADOS

### Vercel CLI
```bash
vercel                    # Deploy manual desde CLI
vercel --prod            # Deploy directo a producción
vercel env               # Gestionar variables de entorno
vercel logs              # Ver logs de deployment y runtime
```

### Npm Scripts
```bash
npm run build            # Build de producción local
npm run preview          # Preview del build local
npm run dev              # Desarrollo con hot reload
```

## CASOS DE USO

### Aplicaciones Ideales
- Single Page Applications (SPAs) con client-side routing
- React apps construidas con Vite que requieren deployment estático
- Aplicaciones que necesitan routing history API support
- Proyectos que requieren deployment automático desde Git
- Apps con rutas dinámicas que deben servirse desde index.html

### Alternativas de Configuración
- **rewrites**: Array alternativo para reglas de routing más complejas
- **headers**: Configurar headers HTTP custom para security/performance
- **redirects**: Redirecciones permanentes entre rutas
- **functions**: Serverless functions si se necesita backend functionality

## TROUBLESHOOTING

### Problemas Comunes
1. **404 en rutas directas**: Verificar que routing rule `/(.*) -> /index.html` esté configurado
2. **Build failures**: Revisar que `distDir` apunte al directorio correcto de Vite
3. **Environment variables**: Asegurar que variables `VITE_*` estén configuradas en Vercel
4. **Assets no cargan**: Verificar que paths relativos estén correctamente configurados

### Debugging
- Usar `vercel logs` para ver errores de build y runtime
- Preview deployments para testing antes de producción
- Vercel Dashboard para monitorear deployments y analytics