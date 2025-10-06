console.log('🚀 SCRIPT INICIANDO...');

// Variables globales
let selectedImages = [];
let lastUsedInput = 'camera';

// Variables para elementos DOM (se inicializarán cuando DOM esté listo)
let cameraInput, galleryInput;
let botonSubirPrincipal, menuSubir, opcionCamara, opcionGaleria;
let photoPreview, photosGallery, photoCounter;
let takeAnotherBtn, uploadGalleryBtn, publishBtn;
let modalBienvenida, mainUploadSection;

console.log('✅ VARIABLES DECLARADAS');

// Configuración de Instagram API
const INSTAGRAM_CONFIG = {
    ACCESS_TOKEN: 'EAATTNtjJ3OcBPjsQ0LZCWXQLIh7RlivJ8WE3e3LlldVD769ET2YOtMwIBdsJhCha51JKqVf3ic2CDjZAUnFhdtpQvacLS7qwRg0BHyMa0kgoJzExNcB6ZAuOqvYfzjpSCSeWXBZBjfABgwWBzWTWrDdwccKFg5ZCghoKG2EJZBwdHixJ3ZAl8X1iXxBZCiCOpx5QfJHW30z0ZCUBUfXaAUN2L',
    INSTAGRAM_ACCOUNT_ID: '17841477304184562',
    API_VERSION: 'v18.0'
};

// Configuración de Cloudinary
const CLOUDINARY_CONFIG = {
    CLOUD_NAME: 'dv8rj8slt',
    API_KEY: '321574754928822',
    API_SECRET: '_7NIMpKMNUiBmx-YRQnJEGMJlPo',
    UPLOAD_PRESET: 'baby_shower_unsigned'
};

console.log('🔧 CONFIGURACIÓN CARGADA');

// Event Listeners - TODO SE EJECUTA CUANDO EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', function() {
    alert('🎯 DOM CARGADO! Inicializando...');
    
    // Inicializar elementos del DOM
    botonSubirPrincipal = document.getElementById('botonSubirPrincipal');
    menuSubir = document.getElementById('menuSubir');
    opcionCamara = document.getElementById('opcionCamara');
    opcionGaleria = document.getElementById('opcionGaleria');
    photoPreview = document.querySelector('.vista-previa-fotos');
    photosGallery = document.querySelector('.galeria-fotos');
    photoCounter = document.querySelector('.contador-fotos');
    takeAnotherBtn = document.querySelector('.tomar-otra-foto');
    uploadGalleryBtn = document.querySelector('.subir-galeria');
    publishBtn = document.querySelector('.publicar');
    modalBienvenida = document.getElementById('modalBienvenida');
    mainUploadSection = document.querySelector('.seccion-subir-principal');
    
    alert('📱 ELEMENTOS ENCONTRADOS! PublishBtn: ' + (publishBtn ? 'SÍ' : 'NO'));
    
    // Crear inputs de archivo
    cameraInput = document.createElement('input');
    cameraInput.type = 'file';
    cameraInput.accept = 'image/*';
    cameraInput.capture = 'environment';
    cameraInput.style.display = 'none';
    cameraInput.multiple = true;
    document.body.appendChild(cameraInput);
    
    galleryInput = document.createElement('input');
    galleryInput.type = 'file';
    galleryInput.accept = 'image/*';
    galleryInput.style.display = 'none';
    galleryInput.multiple = true;
    document.body.appendChild(galleryInput);
    
    alert('📂 INPUTS CREADOS');
    
    // Configurar event listeners
    setupEventListeners();
    
    // Mostrar animaciones
    setTimeout(showanimacionBienvenida, 300);
    setTimeout(showmodalBienvenida, 8000);
});

// Función para configurar todos los event listeners
function setupEventListeners() {
    alert('🔗 CONFIGURANDO EVENT LISTENERS...');
    
    // Botón principal de subir fotos
    if (botonSubirPrincipal) {
        botonSubirPrincipal.addEventListener('click', function() {
            menuSubir.style.display = menuSubir.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    // Opción de cámara
    if (opcionCamara) {
        opcionCamara.addEventListener('click', function() {
            lastUsedInput = 'camera';
            cameraInput.click();
            menuSubir.style.display = 'none';
        });
    }
    
    // Opción de galería
    if (opcionGaleria) {
        opcionGaleria.addEventListener('click', function() {
            lastUsedInput = 'gallery';
            galleryInput.click();
            menuSubir.style.display = 'none';
        });
    }
    
    // Input de cámara
    if (cameraInput) {
        cameraInput.addEventListener('change', handleFileSelection);
    }
    
    // Input de galería
    if (galleryInput) {
        galleryInput.addEventListener('change', handleFileSelection);
    }
    
    // Botones de acciones en preview
    if (takeAnotherBtn) {
        takeAnotherBtn.addEventListener('click', function() {
            cameraInput.click();
        });
    }
    
    if (uploadGalleryBtn) {
        uploadGalleryBtn.addEventListener('click', function() {
            galleryInput.click();
        });
    }
    
    // BOTÓN DE PUBLICAR - EL MÁS IMPORTANTE
    if (publishBtn) {
        alert('✅ CONFIGURANDO BOTÓN PUBLICAR...');
        
        publishBtn.addEventListener('click', function() {
            console.log('🔥 Botón publicar clickeado. Fotos:', selectedImages.length);
            
            if (selectedImages.length > 0) {
                publishToInstagram();
            } else {
                showAlert('No hay fotos seleccionadas para publicar.', 'error');
            }
        });
        
        alert('✅ BOTÓN PUBLICAR CONFIGURADO');
    } else {
        alert('❌ ERROR: No se encontró el botón publicar');
    }
    
    // Modal de bienvenida
    if (modalBienvenida) {
        modalBienvenida.addEventListener('click', function(e) {
            if (e.target === modalBienvenida) {
                hidemodalBienvenida();
            }
        });
    }
    
    alert('✅ TODOS LOS EVENT LISTENERS CONFIGURADOS');
}

// Función principal para publicar en Instagram
async function publishToInstagram() {
    if (selectedImages.length === 0) {
        showAlert('No hay fotos para publicar.', 'error');
        return;
    }

    // Mostrar sección de carga
    showLoadingSection();

    try {
        let successCount = 0;
        let errorCount = 0;
        
        // Publicar cada imagen con delay entre publicaciones
        for (let i = 0; i < selectedImages.length; i++) {
            const image = selectedImages[i];
            
            try {
                // Mostrar progreso
                updateLoadingText(`Publicando imagen ${i + 1} de ${selectedImages.length}...`);
                
                await publishSingleImage(image, i + 1);
                successCount++;
                
                // Esperar entre publicaciones (excepto la última)
                if (i < selectedImages.length - 1) {
                    updateLoadingText(`Imagen ${i + 1} publicada. Preparando siguiente...`);
                    await delay(3000); // Reducido a 3 segundos
                }
                
            } catch (error) {
                console.error(`Error en imagen ${i + 1}:`, error);
                errorCount++;
                
                // Continuar con las siguientes imágenes
                if (i < selectedImages.length - 1) {
                    updateLoadingText(`Error en imagen ${i + 1}. Continuando con la siguiente...`);
                    await delay(2000);
                }
            }
        }

        // Mostrar resultado
        if (successCount > 0) {
            showSuccessSection();
            
            if (errorCount === 0) {
                showAlert(`¡${successCount} foto${successCount > 1 ? 's' : ''} publicada${successCount > 1 ? 's' : ''} exitosamente!`, 'success');
            } else {
                showAlert(`${successCount} fotos publicadas correctamente. ${errorCount} fotos tuvieron problemas.`, 'warning');
            }
        } else {
            hideLoadingSection();
            showAlert('No se pudo publicar ninguna foto. Inténtalo de nuevo.', 'error');
        }
        
        // Limpiar fotos seleccionadas después de un momento
        setTimeout(() => {
            clearSelectedImages();
        }, 5000);

    } catch (error) {
        console.error('Error general al publicar:', error);
        hideLoadingSection();
        showAlert(`Error: ${error.message}`, 'error');
    }
}

// Función para publicar una imagen individual
async function publishSingleImage(imageData, imageNumber) {
    try {
        updateLoadingText(`Subiendo imagen ${imageNumber} a servidor...`);
        
        // Paso 1: Subir la imagen a Cloudinary
        const imageUrl = await uploadImageToCloudinary(imageData);
        
        updateLoadingText(`Preparando imagen ${imageNumber} para Instagram...`);
        
        // Paso 2: Crear el contenedor de media en Instagram
        const mediaId = await createInstagramMedia(imageUrl);
        
        updateLoadingText(`Publicando imagen ${imageNumber} en Instagram...`);
        
        // Paso 3: Publicar el contenido
        await publishInstagramMedia(mediaId);
        
    } catch (error) {
        console.error(`Error al publicar imagen ${imageNumber}:`, error);
        throw new Error(`Error en imagen ${imageNumber}: ${error.message}`);
    }
}

// Función para subir imagen a Cloudinary
async function uploadImageToCloudinary(imageData) {
    try {
        // Convertir blob a archivo
        const file = await convertBlobToFile(imageData.url, `baby_shower_${Date.now()}.jpg`);
        
        // Crear FormData para Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
        formData.append('folder', 'baby_shower_photos');
        
        // Subir a Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error de Cloudinary: ${errorText}`);
        }
        
        const data = await response.json();
        return data.secure_url;
        
    } catch (error) {
        throw new Error(`Error al subir imagen: ${error.message}`);
    }
}

// Función auxiliar para convertir blob a archivo
async function convertBlobToFile(blobUrl, fileName) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    
    // Redimensionar imagen para Instagram
    const resizedBlob = await resizeImageForInstagram(blob);
    
    return new File([resizedBlob], fileName, { type: resizedBlob.type });
}

// Función para redimensionar imagen según requisitos de Instagram
async function resizeImageForInstagram(blob) {
    return new Promise((resolve) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        img.onload = function() {
            let { width, height } = img;
            const aspectRatio = width / height;
            
            // Definir tamaño objetivo según aspect ratio
            let targetWidth, targetHeight;
            
            if (aspectRatio > 1.91) {
                // Muy ancha -> hacer horizontal máximo (1.91:1)
                targetWidth = 1080;
                targetHeight = Math.round(1080 / 1.91);
            } else if (aspectRatio < 0.8) {
                // Muy alta -> hacer vertical máximo (4:5)
                targetWidth = Math.round(1080 * 0.8);
                targetHeight = 1080;
            } else if (aspectRatio >= 0.8 && aspectRatio <= 1.3) {
                // Casi cuadrada -> hacer cuadrada (1:1)
                targetWidth = 1080;
                targetHeight = 1080;
            } else {
                // Mantener proporción si está dentro de límites
                if (width > 1080) {
                    targetWidth = 1080;
                    targetHeight = Math.round(height * (1080 / width));
                } else {
                    targetWidth = width;
                    targetHeight = height;
                }
            }
            
            // Configurar canvas
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
            // Dibujar imagen redimensionada
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            
            // Convertir a blob
            canvas.toBlob(resolve, 'image/jpeg', 0.9);
        };
        
        img.src = URL.createObjectURL(blob);
    });
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
        throw new Error(`Error Instagram API: ${errorData.error?.message || response.statusText}`);
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
    
    // Esperar un poco antes de publicar para asegurar que el media esté listo
    await delay(2000);
    
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error publicando: ${errorData.error?.message || response.statusText}`);
    }
    
    return await response.json();
}

// Función auxiliar para crear delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Funciones de interfaz de carga
function showLoadingSection() {
    const loadingSection = document.querySelector('.seccion-carga');
    const photoPreview = document.querySelector('.vista-previa-fotos');
    
    if (photoPreview) photoPreview.style.display = 'none';
    if (loadingSection) {
        loadingSection.style.display = 'block';
        loadingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function hideLoadingSection() {
    const loadingSection = document.querySelector('.seccion-carga');
    const photoPreview = document.querySelector('.vista-previa-fotos');
    
    if (loadingSection) loadingSection.style.display = 'none';
    if (photoPreview) photoPreview.style.display = 'block';
}

function showSuccessSection() {
    const loadingSection = document.querySelector('.seccion-carga');
    const successSection = document.querySelector('.seccion-exito');
    
    if (loadingSection) loadingSection.style.display = 'none';
    if (successSection) {
        successSection.style.display = 'block';
        successSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function updateLoadingText(text) {
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
        loadingText.textContent = text;
    }
}

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
    const successSection = document.querySelector('.seccion-exito');
    if (successSection) successSection.style.display = 'none';
    if (mainUploadSection) mainUploadSection.style.display = 'block';
}

// Función para manejar selección de archivos
function handleFileSelection(event) {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    alert('📸 Archivos seleccionados: ' + files.length);
    
    files.forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const imageId = Date.now() + index;
            const imageUrl = URL.createObjectURL(file);
            
            selectedImages.push({
                id: imageId,
                file: file,
                url: imageUrl,
                name: file.name
            });
        }
    });
    
    updateGalleryDisplay();
    updateInterfaceState();
    
    if (selectedImages.length > 0) {
        showPhotoPreview();
    }
}

// Función para actualizar la galería
function updateGalleryDisplay() {
    if (!photosGallery || !photoCounter) return;
    
    photosGallery.innerHTML = '';
    photoCounter.textContent = selectedImages.length;
    
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
    
    if (publishBtn) {
        publishBtn.disabled = selectedImages.length === 0;
    }
}

// Función para actualizar estado de interfaz
function updateInterfaceState() {
    if (selectedImages.length > 0) {
        if (mainUploadSection) mainUploadSection.style.display = 'none';
        if (photoPreview) photoPreview.style.display = 'block';
    } else {
        if (mainUploadSection) mainUploadSection.style.display = 'block';
        if (photoPreview) photoPreview.style.display = 'none';
    }
}

// Función para mostrar preview
function showPhotoPreview() {
    if (photoPreview) {
        photoPreview.style.display = 'block';
        photoPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Función para eliminar imagen
function removeImage(imageId) {
    const imageIndex = selectedImages.findIndex(img => img.id == imageId);
    if (imageIndex > -1) {
        URL.revokeObjectURL(selectedImages[imageIndex].url);
        selectedImages.splice(imageIndex, 1);
        updateGalleryDisplay();
        updateInterfaceState();
        showAlert('Foto eliminada.', 'info');
    }
}

// Función para mostrar alertas
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas ${getAlertIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
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
        max-width: 90%;
        font-family: 'Quicksand', sans-serif;
    `;

    document.body.appendChild(alert);

    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 4000);
}

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

// Funciones de animaciones (básicas)
function showanimacionBienvenida() {
    const animacion = document.getElementById('animacionBienvenida');
    if (animacion) {
        animacion.style.display = 'flex';
        setTimeout(() => {
            animacion.style.display = 'none';
        }, 6000);
    }
}

function showmodalBienvenida() {
    if (modalBienvenida) {
        modalBienvenida.classList.add('show');
    }
}

function hidemodalBienvenida() {
    if (modalBienvenida) {
        modalBienvenida.classList.remove('show');
    }
}

// Botón celebrar del modal
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'botonCelebrar') {
        hidemodalBienvenida();
    }
});

console.log('📝 SCRIPT CARGADO COMPLETAMENTE');