// Variables globales
let selectedImages = [];
let lastUsedInput = 'camera'; // 'camera' o 'gallery'

// Configuración de Instagram API
const INSTAGRAM_CONFIG = {
    ACCESS_TOKEN: 'IGAA8JIWr2fiFBZAFREZAjZAVbkZAob3BkX0FudmFSd3JjNXVOeXVNU3F4Vi15eEs2Smk5eFVzNXZAlM0hVa0F4ZAFV5YXhpUk1xTlktNWpYX1FTVFhsOWpUSkNpSlY2ZAG16OWpwVXFWT1hxZAnJWNkFyZAlVQNWJENmlHU2xJbUVxRGIxbwZDZD',
    INSTAGRAM_ACCOUNT_ID: '17841477304154562',
    API_VERSION: 'v18.0'
};

// Configuración de Cloudinary
const CLOUDINARY_CONFIG = {
    CLOUD_NAME: 'dv8rj8slt',
    API_KEY: '321574754928822',
    API_SECRET: '_7NIMpKMNUiBmx-YRQnJEGMJlPo',
    UPLOAD_PRESET: 'baby_shower_preset' // Lo crearemos
};

// Elementos del DOM
const botonSubirPrincipal = document.getElementById('botonSubirPrincipal');
const menuSubir = document.getElementById('menuSubir');
const opcionCamara = document.getElementById('opcionCamara');
const opcionGaleria = document.getElementById('opcionGaleria');
const photoPreview = document.querySelector('.vista-previa-fotos');
const photosGallery = document.querySelector('.galeria-fotos');
const photoCounter = document.querySelector('.contador-fotos');
const takeAnotherBtn = document.querySelector('.tomar-otra-foto');
const uploadGalleryBtn = document.querySelector('.subir-galeria');
const publishBtn = document.querySelector('.publicar');
const modalBienvenida = document.getElementById('modalBienvenida');
const mainUploadSection = document.querySelector('.seccion-subir-principal');

// Crear inputs de archivo (invisibles)
const cameraInput = document.createElement('input');
cameraInput.type = 'file';
cameraInput.accept = 'image/*';
cameraInput.capture = 'environment'; // Para abrir cámara trasera en móviles
cameraInput.style.display = 'none';
cameraInput.multiple = true; // Permitir múltiples archivos
document.body.appendChild(cameraInput);

const galleryInput = document.createElement('input');
galleryInput.type = 'file';
galleryInput.accept = 'image/*';
galleryInput.style.display = 'none';
galleryInput.multiple = true; // Permitir múltiples archivos
document.body.appendChild(galleryInput);

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar animación de bienvenida primero después de 300ms
    setTimeout(showanimacionBienvenida, 300);
    
    // Mostrar modal de bienvenida después de la animación (8 segundos)
    setTimeout(showmodalBienvenida, 8000);
    
    // Botón principal de subir fotos
    botonSubirPrincipal.addEventListener('click', function() {
        menuSubir.style.display = menuSubir.style.display === 'none' ? 'block' : 'none';
    });
    
    // Opción de cámara
    opcionCamara.addEventListener('click', function() {
        lastUsedInput = 'camera';
        cameraInput.click();
        menuSubir.style.display = 'none';
    });

    // Opción de galería
    opcionGaleria.addEventListener('click', function() {
        lastUsedInput = 'gallery';
        galleryInput.click();
        menuSubir.style.display = 'none';
    });

    // Botón "tomar otra foto" en preview
    takeAnotherBtn.addEventListener('click', function() {
        lastUsedInput = 'camera';
        cameraInput.click();
    });

    // Botón "subir desde galería" en preview
    uploadGalleryBtn.addEventListener('click', function() {
        lastUsedInput = 'gallery';
        galleryInput.click();
    });

    // Botón de celebrar en modal de bienvenida
    const botonCelebrar = document.getElementById('botonCelebrar');
    if (botonCelebrar) {
        botonCelebrar.addEventListener('click', function() {
            hidemodalBienvenida();
        });
    }

    // Input de cámara
    cameraInput.addEventListener('change', handleImageSelection);

    // Input de galería
    galleryInput.addEventListener('change', handleImageSelection);

    // Botón de agregar más fotos
    addMoreBtn.addEventListener('click', function() {
        if (lastUsedInput === 'camera') {
            cameraInput.click();
        } else {
            galleryInput.click();
        }
    });

    // Botón de publicar - Publicar en Instagram
    publishBtn.addEventListener('click', function() {
        if (selectedImages.length > 0) {
            publishToInstagram();
        } else {
            showAlert('No hay fotos seleccionadas para publicar.', 'error');
        }
    });

    // Cerrar modal al hacer clic fuera de él
    modalBienvenida.addEventListener('click', function(e) {
        if (e.target === modalBienvenida) {
            hidemodalBienvenida();
        }
    });
});

// Función para mostrar modal de bienvenida
function showmodalBienvenida() {
    modalBienvenida.classList.add('show');
}

// Función para ocultar modal de bienvenida
function hidemodalBienvenida() {
    modalBienvenida.classList.remove('show');
}

// Función para mostrar animación de bienvenida especial
function showanimacionBienvenida() {
    const animacionBienvenida = document.getElementById('animacionBienvenida');
    animacionBienvenida.classList.add('show');
    
    // Ocultar automáticamente después de 7 segundos
    setTimeout(() => {
        hideanimacionBienvenida();
    }, 7000);
}

// Función para ocultar animación de bienvenida
function hideanimacionBienvenida() {
    const animacionBienvenida = document.getElementById('animacionBienvenida');
    animacionBienvenida.classList.remove('show');
}

// Función para manejar la selección de múltiples imágenes
function handleImageSelection(event) {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    let validFiles = 0;
    
    files.forEach(file => {
        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            showAlert('Algunos archivos no son imágenes válidas y fueron omitidos.', 'warning');
            return;
        }

        // Validar tamaño de archivo (máximo 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showAlert('Algunas imágenes son demasiado grandes y fueron omitidas (máximo 10MB).', 'warning');
            return;
        }

        // Crear URL para preview
        const imageUrl = URL.createObjectURL(file);
        const imageId = Date.now() + Math.random(); // ID único
        
        // Agregar a la lista de imágenes seleccionadas
        selectedImages.push({
            id: imageId,
            file: file,
            url: imageUrl,
            source: lastUsedInput
        });
        
        validFiles++;
    });

    if (validFiles > 0) {
        updateGalleryDisplay();
        updateInterfaceState();
        
        // La función showPhotoPreview ya no es necesaria, updateInterfaceState se encarga
    }
    
    // Limpiar inputs
    cameraInput.value = '';
    galleryInput.value = '';
}

// Función para actualizar la visualización de la galería
function updateGalleryDisplay() {
    // Actualizar contador
    photoCounter.textContent = selectedImages.length;
    
    // Limpiar galería
    photosGallery.innerHTML = '';
    
    // Agregar cada imagen
    selectedImages.forEach(imageData => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${imageData.url}" alt="Foto seleccionada">
            <button class="photo-remove" onclick="removeImage('${imageData.id}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        photosGallery.appendChild(photoItem);
    });
    
    // Habilitar/deshabilitar botón de publicar
    publishBtn.disabled = selectedImages.length === 0;
}

// Función para actualizar el estado de la interfaz
function updateInterfaceState() {
    const footer = document.querySelector('.footer');
    
    if (selectedImages.length > 0) {
        // Ocultar botón principal y mostrar preview
        mainUploadSection.style.display = 'none';
        photoPreview.style.display = 'block';
        // Agregar clase expanded al footer para que se mantenga abajo
        footer.classList.add('expanded');
    } else {
        // Mostrar botón principal y ocultar preview
        mainUploadSection.style.display = 'block';
        photoPreview.style.display = 'none';
        // Quitar clase expanded del footer para que esté cerca del botón
        footer.classList.remove('expanded');
    }
}

// Función para eliminar una imagen (llamada desde el botón X)
function removeImage(imageId) {
    // Encontrar y eliminar la imagen
    const imageIndex = selectedImages.findIndex(img => img.id == imageId);
    if (imageIndex > -1) {
        // Liberar URL del objeto
        URL.revokeObjectURL(selectedImages[imageIndex].url);
        // Eliminar de la lista
        selectedImages.splice(imageIndex, 1);
        
        // Actualizar visualización
        updateGalleryDisplay();
        updateInterfaceState();
        
        showAlert('Foto eliminada.', 'info');
    }
}

// Función para mostrar la sección de preview
function showPhotoPreview() {
    photoPreview.style.display = 'block';
    
    // Animar la aparición
    photoPreview.style.opacity = '0';
    photoPreview.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        photoPreview.style.transition = 'all 0.5s ease';
        photoPreview.style.opacity = '1';
        photoPreview.style.transform = 'translateY(0)';
    }, 100);

    // Scroll suave hacia el preview
    setTimeout(() => {
        photoPreview.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 300);
}

// Función para ocultar la sección de preview
function hidePhotoPreview() {
    photoPreview.style.display = 'none';
    
    // Scroll hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para mostrar alertas
function showAlert(message, type = 'info') {
    // Crear elemento de alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas ${getAlertIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos de la alerta
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        padding: 15px 20px;
        border-radius: 12px;
        background: ${getAlertColor(type)};
        color: white;
        font-weight: 500;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease;
        max-width: 90%;
        font-family: 'Quicksand', sans-serif;
    `;

    // Añadir estilos de animación si no existen
    if (!document.getElementById('alert-styles')) {
        const style = document.createElement('style');
        style.id = 'alert-styles';
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            .alert-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    // Añadir al DOM
    document.body.appendChild(alert);

    // Remover después de 4 segundos
    setTimeout(() => {
        alert.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }, 4000);
}

// Funciones auxiliares para alertas
function getAlertIcon(type) {
    switch(type) {
        case 'error': return 'fa-exclamation-triangle';
        case 'success': return 'fa-check-circle';
        case 'warning': return 'fa-exclamation-circle';
        default: return 'fa-info-circle';
    }
}

function getAlertColor(type) {
    switch(type) {
        case 'error': return '#f44336';
        case 'success': return '#4caf50';
        case 'warning': return '#ff9800';
        default: return '#2196f3';
    }
}

// Función para detectar si es dispositivo móvil
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Configuración adicional cuando se carga la página
window.addEventListener('load', function() {
    // Ajustar textos según el dispositivo
    if (isMobileDevice()) {
        cameraBtn.innerHTML = '<i class="fas fa-camera"></i> Tomar Foto';
        // Asegurar que el input de cámara use la cámara del dispositivo
        cameraInput.setAttribute('capture', 'environment');
    } else {
        cameraBtn.innerHTML = '<i class="fas fa-camera"></i> Abrir Cámara';
    }
});

// Prevenir zoom en inputs en iOS
document.addEventListener('touchstart', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        e.target.style.fontSize = '16px';
    }
});

// Manejar orientación de dispositivo
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 500);
});

// ========================================
// FUNCIONES DE INSTAGRAM API
// ========================================

// Función principal para publicar en Instagram
async function publishToInstagram() {
    if (selectedImages.length === 0) {
        showAlert('No hay fotos para publicar.', 'error');
        return;
    }

    // Mostrar sección de carga
    showLoadingSection();

    try {
        // Publicar cada imagen
        for (let i = 0; i < selectedImages.length; i++) {
            const image = selectedImages[i];
            await publishSingleImage(image, i + 1);
        }

        // Mostrar éxito
        showSuccessSection();
        showAlert(`¡${selectedImages.length} foto${selectedImages.length > 1 ? 's' : ''} publicada${selectedImages.length > 1 ? 's' : ''} en Instagram!`, 'success');
        
        // Limpiar fotos seleccionadas después de un momento
        setTimeout(() => {
            clearSelectedImages();
        }, 3000);

    } catch (error) {
        console.error('Error al publicar en Instagram:', error);
        hideLoadingSection();
        showAlert('Error al publicar en Instagram. Inténtalo de nuevo.', 'error');
    }
}

// Función para publicar una imagen individual
async function publishSingleImage(imageData, imageNumber) {
    try {
        // Paso 1: Subir la imagen a un servicio temporal (simulado)
        const imageUrl = await uploadImageToTemporaryService(imageData);
        
        // Paso 2: Crear el contenedor de media en Instagram
        const mediaId = await createInstagramMedia(imageUrl);
        
        // Paso 3: Publicar el contenido
        await publishInstagramMedia(mediaId);
        
        console.log(`Imagen ${imageNumber} publicada exitosamente`);
        
    } catch (error) {
        console.error(`Error al publicar imagen ${imageNumber}:`, error);
        throw error;
    }
}

// Función para subir imagen a Cloudinary
async function uploadImageToTemporaryService(imageData) {
    try {
        // Convertir blob a archivo
        const file = await convertBlobToFile(imageData.url, `baby_shower_${Date.now()}.jpg`);
        
        // Subir a Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(file);
        
        console.log('Imagen subida a Cloudinary:', cloudinaryUrl);
        return cloudinaryUrl;
        
    } catch (error) {
        console.error('Error subiendo imagen a Cloudinary:', error);
        throw new Error('Error al procesar la imagen para Instagram');
    }
}

// Función auxiliar para convertir blob a archivo
async function convertBlobToFile(blobUrl, fileName) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
}

// Función para subir imagen a Cloudinary
async function uploadToCloudinary(file) {
    try {
        // Crear FormData para Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'baby_shower_unsigned'); // Preset sin firma
        formData.append('folder', 'baby_shower_photos');
        
        // Subir a Cloudinary (usando upload sin autenticación)
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error de Cloudinary: ${errorData.error?.message || response.statusText}`);
        }
        
        const data = await response.json();
        
        // Retornar la URL segura de la imagen
        return data.secure_url;
        
    } catch (error) {
        console.error('Error subiendo a Cloudinary:', error);
        throw new Error('Error al subir imagen a Cloudinary');
    }
}

// Función para generar firma de Cloudinary (si necesitas upload firmado)
function generateCloudinarySignature(params, apiSecret) {
    // Ordenar parámetros
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
    
    // Agregar API secret
    const stringToSign = sortedParams + apiSecret;
    
    // Generar hash SHA1 (necesitarías una librería como crypto-js)
    // Por simplicidad, usaremos upload sin firma
    return null;
}

// Función para crear media container en Instagram
async function createInstagramMedia(imageUrl) {
    const url = `https://graph.facebook.com/${INSTAGRAM_CONFIG.API_VERSION}/${INSTAGRAM_CONFIG.INSTAGRAM_ACCOUNT_ID}/media`;
    
    const formData = new FormData();
    formData.append('image_url', imageUrl);
    formData.append('caption', '¡Momento especial del Baby Shower! 💕👶 #BabyShowerAitana #MomentosEspeciales');
    formData.append('access_token', INSTAGRAM_CONFIG.ACCESS_TOKEN);
    
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error creating media: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.id;
}

// Función para publicar el media container
async function publishInstagramMedia(mediaId) {
    const url = `https://graph.facebook.com/${INSTAGRAM_CONFIG.API_VERSION}/${INSTAGRAM_CONFIG.INSTAGRAM_ACCOUNT_ID}/media_publish`;
    
    const formData = new FormData();
    formData.append('creation_id', mediaId);
    formData.append('access_token', INSTAGRAM_CONFIG.ACCESS_TOKEN);
    
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error publishing media: ${errorData.error?.message || response.statusText}`);
    }
    
    return await response.json();
}

// Función para mostrar sección de carga
function showLoadingSection() {
    const loadingSection = document.querySelector('.seccion-carga');
    const photoPreview = document.querySelector('.vista-previa-fotos');
    
    photoPreview.style.display = 'none';
    loadingSection.style.display = 'block';
    
    // Scroll hacia la sección de carga
    loadingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Función para ocultar sección de carga
function hideLoadingSection() {
    const loadingSection = document.querySelector('.seccion-carga');
    const photoPreview = document.querySelector('.vista-previa-fotos');
    
    loadingSection.style.display = 'none';
    photoPreview.style.display = 'block';
}

// Función para mostrar sección de éxito
function showSuccessSection() {
    const loadingSection = document.querySelector('.seccion-carga');
    const successSection = document.querySelector('.seccion-exito');
    
    loadingSection.style.display = 'none';
    successSection.style.display = 'block';
    
    // Scroll hacia la sección de éxito
    successSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Función para limpiar imágenes seleccionadas
function clearSelectedImages() {
    // Limpiar URLs de memoria
    selectedImages.forEach(img => {
        URL.revokeObjectURL(img.url);
    });
    
    // Resetear array
    selectedImages = [];
    
    // Actualizar interfaz
    updateGalleryDisplay();
    updateInterfaceState();
    
    // Ocultar sección de éxito y mostrar botón principal
    document.querySelector('.seccion-exito').style.display = 'none';
    document.querySelector('.seccion-subir-principal').style.display = 'block';
}

// Función para verificar el estado del token de Instagram
async function verifyInstagramToken() {
    try {
        const url = `https://graph.facebook.com/${INSTAGRAM_CONFIG.API_VERSION}/me?access_token=${INSTAGRAM_CONFIG.ACCESS_TOKEN}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Token inválido o expirado');
        }
        
        const data = await response.json();
        console.log('Token de Instagram verificado:', data.name);
        return true;
        
    } catch (error) {
        console.error('Error verificando token de Instagram:', error);
        showAlert('Error de configuración de Instagram. Contacta al administrador.', 'error');
        return false;
    }
}

// Verificar token al cargar la página
window.addEventListener('load', function() {
    // Verificar token de Instagram
    verifyInstagramToken();
});
