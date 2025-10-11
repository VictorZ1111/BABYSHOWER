// ========================================
// IMPORTACIONES
// ========================================
import { useState, useCallback, useRef, useEffect } from 'react';

// ========================================
// CONFIGURACIÓN DE APIs EXTERNAS
// ========================================

// Configuración de Instagram Graph API
const INSTAGRAM_CONFIG = {
  // Token de acceso de página (Page Access Token) - válido por 60 días
  ACCESS_TOKEN: import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN || 'EAATTNtjJ3OcBPjsQ0LZCWXQLIh7RlivJ8WE3e3LlldVD769ET2YOtMwIBdsJhCha51JKqVf3ic2CDjZAUnFhdtpQvacLS7qwRg0BHyMa0kgoJzExNcB6ZAuOqvYfzjpSCSeWXBZBjfABgwWBzWTWrDdwccKFg5ZCghoKG2EJZBwdHixJ3ZAl8X1iXxBZCiCOpx5QfJHW30z0ZCUBUfXaAUN2L',
  // ID de la cuenta comercial de Instagram (@baby_shower_daella)
  INSTAGRAM_ACCOUNT_ID: import.meta.env.VITE_INSTAGRAM_ACCOUNT_ID || '17841477304184562',
  // Versión de la API de Graph de Facebook/Instagram
  API_VERSION: 'v18.0'
};

// Configuración de Cloudinary (servicio de almacenamiento temporal de imágenes)
const CLOUDINARY_CONFIG = {
  // Nombre del cloud de Cloudinary
  CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dv8rj8slt',
  // API Key pública de Cloudinary
  API_KEY: '321574754928822',
  // API Secret de Cloudinary (para uploads firmados)
  API_SECRET: '_7NIMpKMNUiBmx-YRQnJEGMJlPo',
  // Preset de upload no firmado (permite subir sin autenticación backend)
  UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'baby_shower_unsigned'
};

// ========================================
// INTERFACES DE TYPESCRIPT
// ========================================

// Interface para los datos de cada imagen seleccionada
export interface ImageData {
  id: number;      // ID único de la imagen (timestamp + índice)
  file: File;      // Objeto File nativo del navegador
  url: string;     // URL temporal para preview (creada con URL.createObjectURL)
  name: string;    // Nombre del archivo
}

// Interface para el estado de progreso de subida
export interface UploadProgress {
  currentImage: number;    // Imagen actual que se está procesando (1, 2, 3...)
  totalImages: number;     // Total de imágenes a procesar
  message: string;         // Mensaje descriptivo del proceso actual
  isUploading: boolean;    // Si está en proceso de subida
  isCompleted: boolean;    // Si el proceso se completó exitosamente
}

// ========================================
// HOOK PERSONALIZADO PRINCIPAL
// ========================================
export const useInstagramUpload = () => {
  
  // ========================================
  // ESTADOS Y REFS DEL HOOK
  // ========================================
  
  // Array de imágenes seleccionadas por el usuario
  const [selectedImages, setSelectedImages] = useState<ImageData[]>([]);
  
  // Estado de progreso de la subida a Instagram
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    currentImage: 0,        // Inicialmente en 0
    totalImages: 0,         // Inicialmente en 0
    message: '',            // Sin mensaje inicial
    isUploading: false,     // No está subiendo inicialmente
    isCompleted: false      // No está completado inicialmente
  });

  // Referencias para control de memoria y cancelación
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutsRef = useRef<Set<number>>(new Set());
  const urlsToCleanupRef = useRef<Set<string>>(new Set());

  // Función de cleanup optimizada
  const performCleanup = useCallback(() => {
    // Cancelar request en progreso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Limpiar todos los timeouts
    timeoutsRef.current.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    timeoutsRef.current.clear();
    
    // Limpiar todas las URLs de objetos para liberar memoria
    urlsToCleanupRef.current.forEach(url => {
      URL.revokeObjectURL(url);
    });
    urlsToCleanupRef.current.clear();
  }, []);

  // Cleanup automático al desmontar componente
  useEffect(() => {
    return performCleanup;
  }, [performCleanup]);

  // Helper para crear timeout con tracking
  const createTrackedTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      timeoutsRef.current.delete(timeoutId);
      callback();
    }, delay);
    
    timeoutsRef.current.add(timeoutId);
    return timeoutId;
  }, []);

  // Helper para registrar URL para cleanup
  const registerUrlForCleanup = useCallback((url: string) => {
    urlsToCleanupRef.current.add(url);
  }, []);

  // ========================================
  // FUNCIONES DE MANEJO DE ARCHIVOS
  // ========================================
  
  // Función optimizada para comprimir y redimensionar imágenes
  const compressAndResizeImage = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular dimensiones optimizadas (máx 1920px)
        const maxSize = 1920;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        // Configurar canvas
        canvas.width = width;
        canvas.height = height;
        
        // Optimizaciones de rendering
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Dibujar imagen optimizada
          ctx.drawImage(img, 0, 0, width, height);
          
          // Comprimir con calidad adaptativa
          const quality = file.size > 5000000 ? 0.7 : 0.85; // Menos calidad si es muy grande
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback al archivo original
            }
          }, 'image/jpeg', quality);
        } else {
          resolve(file);
        }
        
        // Cleanup
        URL.revokeObjectURL(img.src);
      };
      
      img.onerror = () => resolve(file); // Fallback al archivo original
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Función para procesar archivos seleccionados desde cámara o galería (OPTIMIZADA)
  const handleFileSelection = useCallback(async (files: FileList) => {
    // Convierte FileList a Array para poder usar métodos de array
    const fileArray = Array.from(files);
    // Array temporal para nuevas imágenes válidas
    const newImages: ImageData[] = [];

    // Procesa cada archivo seleccionado de forma asíncrona
    for (const [index, file] of fileArray.entries()) {
      // Solo procesa archivos que sean imágenes
      if (file.type.startsWith('image/')) {
        try {
          // Comprimir y optimizar imagen
          const optimizedFile = await compressAndResizeImage(file);
          
          // Crea ID único basado en timestamp actual + índice
          const imageId = Date.now() + index;
          // Crea URL temporal para preview en el navegador (blob://...)
          const imageUrl = URL.createObjectURL(optimizedFile);
          
          // Agrega la imagen procesada al array temporal
          newImages.push({
            id: imageId,           // ID único para identificar la imagen
            file: optimizedFile,   // Archivo optimizado
            url: imageUrl,         // URL temporal para mostrar preview
            name: file.name        // Nombre original del archivo
          });
        } catch (error) {
          console.warn('Error optimizing image:', file.name, error);
          // Fallback: usar archivo original
          const imageId = Date.now() + index;
          const imageUrl = URL.createObjectURL(file);
          
          newImages.push({
            id: imageId,
            file: file,
            url: imageUrl,
            name: file.name
          });
        }
      }
    }

    // Agrega las nuevas imágenes al array existente (permite acumulación)
    setSelectedImages(prev => [...prev, ...newImages]);
  }, []); // useCallback sin dependencias porque no usa variables externas

  // ========================================
  // FUNCIONES DE GESTIÓN DE IMÁGENES
  // ========================================
  
  // Función para eliminar una imagen específica por ID
  const removeImage = useCallback((imageId: number) => {
    setSelectedImages(prev => {
      // Busca la imagen a eliminar para liberar su URL temporal
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        // Libera la memoria de la URL temporal (importante para performance)
        URL.revokeObjectURL(imageToRemove.url);
      }
      // Retorna array filtrado sin la imagen eliminada
      return prev.filter(img => img.id !== imageId);
    });
  }, []); // Sin dependencias porque solo usa parámetros y setState

  // Función para limpiar todas las imágenes seleccionadas
  const clearAllImages = useCallback(() => {
    // Libera la memoria de todas las URLs temporales
    selectedImages.forEach(img => {
      URL.revokeObjectURL(img.url);
    });
    // Reinicia el array de imágenes
    setSelectedImages([]);
    // Reinicia el estado de progreso
    setUploadProgress({
      currentImage: 0,
      totalImages: 0,
      message: '',
      isUploading: false,
      isCompleted: false
    });
  }, [selectedImages]); // Depende de selectedImages para liberar URLs correctas

  // ========================================
  // FUNCIONES AUXILIARES
  // ========================================
  
  // Función para crear delays/pausas en procesos asíncronos
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // ========================================
  // PROCESAMIENTO DE IMÁGENES PARA INSTAGRAM
  // ========================================
  
  // Función para redimensionar imágenes según requisitos de Instagram
  // Instagram tiene límites estrictos de aspect ratio y resolución
  const resizeImageForInstagram = (blob: Blob): Promise<Blob> => {
    return new Promise((resolve) => {
      // Crea elementos para procesamiento de imagen
      const img = new Image();                      // Elemento imagen
      const canvas = document.createElement('canvas'); // Canvas para redimensionar
      const ctx = canvas.getContext('2d');          // Contexto 2D del canvas
      
      // Cuando la imagen carga, procesa las dimensiones
      img.onload = function() {
        let { width, height } = img;
        const aspectRatio = width / height;  // Calcula ratio actual
        
        let targetWidth: number, targetHeight: number;
        
        // ========================================
        // LÓGICA DE REDIMENSIONAMIENTO SEGÚN INSTAGRAM
        // ========================================
        
        if (aspectRatio > 1.91) {
          // Imagen muy ancha -> aplicar máximo horizontal (1.91:1)
          // Instagram no acepta imágenes más anchas que 1.91:1
          targetWidth = 1080;
          targetHeight = Math.round(1080 / 1.91);
        } else if (aspectRatio < 0.8) {
          // Imagen muy alta -> aplicar máximo vertical (4:5 = 0.8)
          // Instagram no acepta imágenes más altas que 4:5
          targetWidth = Math.round(1080 * 0.8);
          targetHeight = 1080;
        } else if (aspectRatio >= 0.8 && aspectRatio <= 1.3) {
          // Imagen casi cuadrada -> forzar a cuadrada (1:1) para consistencia
          targetWidth = 1080;
          targetHeight = 1080;
        } else {
          // Imagen dentro de límites aceptables
          // Redimensionar solo si excede 1080px de ancho
          if (width > 1080) {
            targetWidth = 1080;
            targetHeight = Math.round(height * (1080 / width));
          } else {
            // Mantener tamaño original si es menor a 1080px
            targetWidth = width;
            targetHeight = height;
          }
        }
        
        // Configurar dimensiones del canvas
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Dibujar imagen redimensionada en el canvas
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        }
        
        // Convertir canvas a blob con compresión JPEG (calidad 0.9 = 90%)
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.9);
      };
      
      // Cargar imagen original para iniciar el proceso
      img.src = URL.createObjectURL(blob);
    });
  };

  // ========================================
  // FUNCIONES DE CLOUDINARY (ALMACENAMIENTO TEMPORAL)
  // ========================================
  
  // Función para convertir URL temporal a archivo redimensionado
  const convertBlobToFile = async (blobUrl: string, fileName: string): Promise<File> => {
    // Obtiene el blob desde la URL temporal
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    
    // Aplica redimensionamiento para Instagram
    const resizedBlob = await resizeImageForInstagram(blob);
    
    // Convierte a File con nombre personalizado
    return new File([resizedBlob], fileName, { type: resizedBlob.type });
  };

  // Función principal para subir imagen a Cloudinary
  // Cloudinary se usa como almacenamiento temporal porque Instagram requiere URLs públicas
  const uploadImageToCloudinary = async (imageData: ImageData): Promise<string> => {
    try {
      // Convierte y redimensiona la imagen
      const file = await convertBlobToFile(imageData.url, `baby_shower_${Date.now()}.jpg`);
      
      // Prepara FormData para la API de Cloudinary
      const formData = new FormData();
      formData.append('file', file);                                     // Archivo de imagen
      formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET); // Preset para uploads no autenticados
      formData.append('folder', 'baby_shower_photos');                   // Carpeta de organización
      
      // Hace request a la API de Cloudinary
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      // Verifica si la respuesta fue exitosa
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error de Cloudinary: ${errorText}`);
      }
      
      // Extrae la URL pública segura de la respuesta
      const data = await response.json();
      return data.secure_url;  // Esta URL es la que Instagram podrá acceder
    } catch (error: any) {
      // Propaga error con contexto específico de Cloudinary
      throw new Error(`Error al subir imagen: ${error.message}`);
    }
  };

  // ========================================
  // FUNCIONES DE INSTAGRAM GRAPH API
  // ========================================
  
  // Función para crear contenedor de media en Instagram (Paso 1 de 2)
  // Esto prepara la imagen para publicación pero no la publica aún
  const createInstagramMedia = async (imageUrl: string): Promise<string> => {
    // URL del endpoint de creación de media de Instagram
    const url = `https://graph.facebook.com/${INSTAGRAM_CONFIG.API_VERSION}/${INSTAGRAM_CONFIG.INSTAGRAM_ACCOUNT_ID}/media`;
    
    // Prepara los datos para el POST
    const formData = new FormData();
    formData.append('image_url', imageUrl);  // URL pública de Cloudinary
    // Caption personalizado para el baby shower con emojis y hashtags
    formData.append('caption', '¡Momento especial del Baby Shower! 💕👶 #BabyShowerAitana #MomentosEspeciales');
    formData.append('access_token', INSTAGRAM_CONFIG.ACCESS_TOKEN);  // Token de acceso
    
    // Hace la petición a Instagram API
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    // Verifica si fue exitoso
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error Instagram API: ${errorData.error?.message || response.statusText}`);
    }
    
    // Retorna el ID del contenedor creado
    const data = await response.json();
    return data.id;  // Este ID se usa en el paso 2 para publicar
  };

  /**
   * FUNCIÓN: PUBLICACIÓN DEL MEDIA EN INSTAGRAM (PASO 2 DE 2)
   * ====================================================
   * 
   * Esta función completa el proceso de 2 pasos para publicar en Instagram.
   * Toma el ID del contenedor de media creado en el paso 1 y lo publica públicamente.
   * 
   * Flujo de funcionamiento:
   * 1. Construye URL del endpoint de publicación de media
   * 2. Prepara FormData con el ID del contenedor y token de acceso
   * 3. Aplica delay de 2 segundos para asegurar que Instagram procese el media
   * 4. Envía petición POST al API de Instagram
   * 5. Valida respuesta y maneja errores específicos de Instagram
   * 6. Retorna datos de confirmación de publicación
   * 
   * @param mediaId - ID del contenedor de media creado previamente
   * @returns Promise con datos de respuesta de Instagram tras la publicación
   */
  const publishInstagramMedia = async (mediaId: string): Promise<any> => {
    // URL del endpoint de publicación de Instagram Graph API
    const url = `https://graph.facebook.com/${INSTAGRAM_CONFIG.API_VERSION}/${INSTAGRAM_CONFIG.INSTAGRAM_ACCOUNT_ID}/media_publish`;
    
    // Prepara los datos para la petición de publicación
    const formData = new FormData();
    formData.append('creation_id', mediaId);  // ID del contenedor creado en paso 1
    formData.append('access_token', INSTAGRAM_CONFIG.ACCESS_TOKEN);  // Token de autorización
    
    // Delay crítico: Instagram necesita tiempo para procesar el media antes de publicar
    // Sin este delay, la API puede retornar error de "media not ready"
    await delay(2000);
    
    // Envía la petición de publicación al API de Instagram
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    // Validación de respuesta y manejo de errores específicos de Instagram
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error publicando: ${errorData.error?.message || response.statusText}`);
    }
    
    // Retorna datos de confirmación de publicación exitosa
    return await response.json();
  };

  /**
   * FUNCIÓN: PUBLICACIÓN DE IMAGEN INDIVIDUAL
   * ========================================
   * 
   * Esta función coordina el proceso completo para publicar una sola imagen en Instagram.
   * Ejecuta los 3 pasos necesarios: subida a Cloudinary, creación de contenedor y publicación.
   * 
   * Proceso paso a paso:
   * 1. Subida a Cloudinary: Convierte imagen a URL pública accesible
   * 2. Creación de contenedor: Prepara el media en Instagram sin publicar
   * 3. Publicación: Hace visible el contenido en el feed de Instagram
   * 
   * Durante cada paso actualiza el progreso para informar al usuario del estado actual.
   * Maneja errores específicos y los propaga con información contextual.
   * 
   * @param imageData - Objeto con datos de la imagen (file, url, caption)
   * @param imageNumber - Número de imagen en la secuencia (para tracking)
   */
  const publishSingleImage = async (imageData: ImageData, imageNumber: number): Promise<void> => {
    try {
      // PASO 1: SUBIDA A CLOUDINARY
      // Actualiza UI para mostrar progreso de subida
      setUploadProgress(prev => ({
        ...prev,
        message: `Subiendo imagen ${imageNumber} a servidor...`
      }));
      
      // Sube imagen a Cloudinary y obtiene URL pública
      const imageUrl = await uploadImageToCloudinary(imageData);
      
      // PASO 2: CREACIÓN DE CONTENEDOR EN INSTAGRAM
      // Actualiza UI para mostrar progreso de preparación
      setUploadProgress(prev => ({
        ...prev,
        message: `Preparando imagen ${imageNumber} para Instagram...`
      }));
      
      // Crea contenedor de media en Instagram (aún no visible públicamente)
      const mediaId = await createInstagramMedia(imageUrl);
      
      // PASO 3: PUBLICACIÓN EN INSTAGRAM
      // Actualiza UI para mostrar progreso de publicación
      setUploadProgress(prev => ({
        ...prev,
        message: `Publicando imagen ${imageNumber} en Instagram...`
      }));
      
      // Publica el contenedor, haciendo la imagen visible en Instagram
      await publishInstagramMedia(mediaId);
      
    } catch (error: any) {
      // Manejo de errores con contexto específico de la imagen
      console.error(`Error al publicar imagen ${imageNumber}:`, error);
      throw new Error(`Error en imagen ${imageNumber}: ${error.message}`);
    }
  };

  /**
   * FUNCIÓN PRINCIPAL: PUBLICACIÓN MASIVA EN INSTAGRAM
   * =================================================
   * 
   * Esta es la función principal exportada por el hook que coordina todo el proceso
   * de publicación masiva de imágenes en Instagram. Utiliza useCallback para optimización.
   * 
   * Características principales:
   * - Procesa múltiples imágenes secuencialmente con delays entre publicaciones
   * - Maneja errores individualmente sin detener el proceso completo
   * - Proporciona seguimiento detallado del progreso en tiempo real
   * - Implementa rate limiting para cumplir con límites de API de Instagram
   * - Cuenta éxitos y errores para reporte final
   * 
   * Flujo de ejecución:
   * 1. Validación inicial de imágenes seleccionadas
   * 2. Inicialización del estado de progreso
   * 3. Procesamiento secuencial de cada imagen
   * 4. Delays entre publicaciones para evitar rate limits
   * 5. Manejo individual de errores sin detener el flujo
   * 6. Reporte final de resultados
   * 
   * @returns Promise con objeto conteniendo contadores de éxito y error
   */
  const publishToInstagram = useCallback(async (): Promise<{ successCount: number; errorCount: number }> => {
    // VALIDACIÓN INICIAL
    // Verifica que hay imágenes seleccionadas antes de proceder
    if (selectedImages.length === 0) {
      throw new Error('No hay fotos para publicar.');
    }

    // INICIALIZACIÓN DEL ESTADO DE PROGRESO
    // Configura el estado inicial para tracking del proceso
    setUploadProgress({
      currentImage: 0,
      totalImages: selectedImages.length,
      message: 'Iniciando publicación...',
      isUploading: true,
      isCompleted: false
    });

    // CONTADORES PARA REPORTE FINAL
    let successCount = 0;  // Cuenta imágenes publicadas exitosamente
    let errorCount = 0;    // Cuenta imágenes que fallaron
    
    try {
      // PROCESAMIENTO SECUENCIAL DE IMÁGENES
      // Se procesan una por una para cumplir con rate limits de Instagram
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        
        try {
          // Actualiza progreso para mostrar imagen actual
          setUploadProgress(prev => ({
            ...prev,
            currentImage: i + 1,
            message: `Publicando imagen ${i + 1} de ${selectedImages.length}...`
          }));
          
          // Publica la imagen individual usando función auxiliar
          await publishSingleImage(image, i + 1);
          successCount++;  // Incrementa contador de éxitos
          
          // DELAY ENTRE PUBLICACIONES
          // Evita rate limiting de Instagram API (excepto en la última imagen)
          if (i < selectedImages.length - 1) {
            setUploadProgress(prev => ({
              ...prev,
              message: `Imagen ${i + 1} publicada. Preparando siguiente...`
            }));
            await delay(3000);  // 3 segundos entre publicaciones
          }
          
        } catch (error: any) {
          // MANEJO DE ERRORES INDIVIDUALES
          // Los errores no detienen el proceso, solo se registran
          console.error(`Error en imagen ${i + 1}:`, error);
          errorCount++;  // Incrementa contador de errores
          
          // Continúa con las siguientes imágenes tras un delay menor
          if (i < selectedImages.length - 1) {
            setUploadProgress(prev => ({
              ...prev,
              message: `Error en imagen ${i + 1}. Continuando con la siguiente...`
            }));
            await delay(2000);  // Delay menor para errores
          }
        }
      }

      // FINALIZACIÓN EXITOSA
      // Actualiza el estado para indicar completación del proceso
      setUploadProgress(prev => ({
        ...prev,
        isUploading: false,
        isCompleted: true,
        message: 'Publicación completada'
      }));

      // Retorna estadísticas finales del proceso
      return { successCount, errorCount };

    } catch (error: any) {
      // MANEJO DE ERRORES CRÍTICOS
      // Errores que detienen todo el proceso
      setUploadProgress(prev => ({
        ...prev,
        isUploading: false,
        isCompleted: false,
        message: `Error: ${error.message}`
      }));
      throw error;
    }
  }, [selectedImages]);  // Dependencia: se recrea cuando cambian las imágenes seleccionadas

  /**
   * RETORNO DEL HOOK - API PÚBLICA
   * ==============================
   * 
   * El hook retorna un objeto con todas las funciones y estados necesarios
   * para manejar la selección y publicación de imágenes en Instagram.
   * 
   * Estados exportados:
   * - selectedImages: Array de imágenes actualmente seleccionadas
   * - uploadProgress: Objeto con información de progreso de subida
   * 
   * Funciones exportadas:
   * - handleFileSelection: Para seleccionar archivos del dispositivo
   * - removeImage: Para eliminar una imagen específica de la selección
   * - clearAllImages: Para limpiar toda la selección de imágenes
   * - publishToInstagram: Para ejecutar el proceso completo de publicación
   */
  return {
    selectedImages,      // Estado: Array de imágenes seleccionadas
    uploadProgress,      // Estado: Progreso actual de subida/publicación
    handleFileSelection, // Función: Manejo de selección de archivos
    removeImage,         // Función: Eliminación de imagen individual
    clearAllImages,      // Función: Limpieza completa de selección
    publishToInstagram   // Función: Proceso principal de publicación
  };
};

/**
 * ========================================================================================
 * RESUMEN DEL ARCHIVO: useInstagramUpload.ts
 * ========================================================================================
 * 
 * PROPÓSITO PRINCIPAL:
 * Este archivo contiene un custom hook de React que maneja todo el proceso de publicación
 * de imágenes en Instagram de forma masiva. Integra Cloudinary para almacenamiento temporal
 * y la API de Instagram Graph para publicación automática.
 * 
 * ARQUITECTURA TÉCNICA:
 * - Custom Hook de React con useState y useCallback para optimización
 * - Integración con Instagram Graph API v18.0 para publicación automatizada  
 * - Uso de Cloudinary como CDN temporal para hosting de imágenes
 * - Procesamiento de imágenes con redimensionamiento automático para compliance
 * - Manejo de estados complejos para tracking de progreso en tiempo real
 * 
 * FLUJO PRINCIPAL DE TRABAJO:
 * 1. Selección de archivos desde dispositivo del usuario
 * 2. Validación y procesamiento de imágenes (formato, tamaño, calidad)
 * 3. Redimensionamiento automático para cumplir requisitos de Instagram
 * 4. Subida secuencial a Cloudinary para obtener URLs públicas
 * 5. Creación de contenedores de media en Instagram (sin publicar)
 * 6. Publicación final con delays para evitar rate limiting
 * 7. Tracking completo de progreso y manejo de errores individuales
 * 
 * CARACTERÍSTICAS DESTACADAS:
 * - Procesamiento masivo con capacidad de manejar múltiples imágenes
 * - Sistema de progreso granular con actualizaciones en tiempo real  
 * - Manejo robusto de errores que no detiene el proceso completo
 * - Rate limiting inteligente para cumplir con límites de API
 * - Optimización de memoria con processing por lotes
 * - Soporte completo para diferentes formatos de imagen
 * - Integración seamless con componentes React mediante estados reactivos
 * 
 * DEPENDENCIAS CLAVE:
 * - React hooks (useState, useCallback) para manejo de estado
 * - Instagram Graph API v18.0 para publicación automática
 * - Cloudinary API para almacenamiento temporal de imágenes
 * - Canvas API del navegador para procesamiento de imágenes
 * - FormData API para construcción de peticiones multipart
 * 
 * CONFIGURACIÓN REQUERIDA:
 * - Token de acceso de Instagram Business Account (@baby_shower_daella)
 * - Credenciales de Cloudinary (cloud name, upload preset)
 * - ID de cuenta de Instagram Business para targeting de publicaciones
 * 
 * CASOS DE USO:
 * Este hook está diseñado específicamente para la aplicación de baby shower
 * donde los invitados pueden seleccionar múltiples fotos del evento y
 * publicarlas automáticamente en la cuenta de Instagram del evento con
 * seguimiento visual del progreso de subida.
 * ========================================================================================
 */