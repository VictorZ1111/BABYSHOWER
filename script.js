// Variables globales
let selectedImages = [];
let lastUsedInput = 'camera'; // 'camera' o 'gallery'

// Elementos del DOM
const mainUploadBtn = document.getElementById('mainUploadBtn');
const uploadMenu = document.getElementById('uploadMenu');
const cameraOption = document.getElementById('cameraOption');
const galleryOption = document.getElementById('galleryOption');
const photoPreview = document.querySelector('.photo-preview');
const photosGallery = document.querySelector('.photos-gallery');
const photoCounter = document.querySelector('.photo-counter');
const takeAnotherBtn = document.querySelector('.take-another-btn');
const uploadGalleryBtn = document.querySelector('.upload-gallery-btn');
const publishBtn = document.querySelector('.publish-btn');
const welcomeModal = document.getElementById('welcomeModal');
const mainUploadSection = document.querySelector('.main-upload-section');

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
    setTimeout(showWelcomeAnimation, 300);
    
    // Mostrar modal de bienvenida después de la animación (8 segundos)
    setTimeout(showWelcomeModal, 8000);
    
    // Botón principal de subir fotos
    mainUploadBtn.addEventListener('click', function() {
        uploadMenu.style.display = uploadMenu.style.display === 'none' ? 'block' : 'none';
    });
    
    // Opción de cámara
    cameraOption.addEventListener('click', function() {
        lastUsedInput = 'camera';
        cameraInput.click();
        uploadMenu.style.display = 'none';
    });

    // Opción de galería
    galleryOption.addEventListener('click', function() {
        lastUsedInput = 'gallery';
        galleryInput.click();
        uploadMenu.style.display = 'none';
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
    const celebrateBtn = document.getElementById('celebrateBtn');
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', function() {
            hideWelcomeModal();
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

    // Botón de publicar (por ahora solo muestra mensaje)
    publishBtn.addEventListener('click', function() {
        if (selectedImages.length > 0) {
            showAlert(`¡${selectedImages.length} foto${selectedImages.length > 1 ? 's' : ''} guardada${selectedImages.length > 1 ? 's' : ''}! La funcionalidad de Instagram se agregará pronto.`, 'success');
        } else {
            showAlert('No hay fotos seleccionadas para publicar.', 'error');
        }
    });

    // Cerrar modal al hacer clic fuera de él
    welcomeModal.addEventListener('click', function(e) {
        if (e.target === welcomeModal) {
            hideWelcomeModal();
        }
    });
});

// Función para mostrar modal de bienvenida
function showWelcomeModal() {
    if (isMobileDevice()) {
        welcomeModal.classList.add('show');
    }
}

// Función para ocultar modal de bienvenida
function hideWelcomeModal() {
    welcomeModal.classList.remove('show');
}

// Función para mostrar animación de bienvenida especial
function showWelcomeAnimation() {
    const welcomeAnimation = document.getElementById('welcomeAnimation');
    welcomeAnimation.classList.add('show');
    
    // Ocultar automáticamente después de 7 segundos
    setTimeout(() => {
        hideWelcomeAnimation();
    }, 7000);
}

// Función para ocultar animación de bienvenida
function hideWelcomeAnimation() {
    const welcomeAnimation = document.getElementById('welcomeAnimation');
    welcomeAnimation.classList.remove('show');
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