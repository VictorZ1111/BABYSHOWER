// ========================================
// IMPORTACIONES
// ========================================
// Importa hooks de React para manejo de estado y referencias
import { useState, useRef, useEffect } from 'react'
// Hook personalizado para manejar toda la lógica de Instagram y Cloudinary
import { useInstagramUpload } from './hooks/useInstagramUpload'
// Componentes de animaciones bee-themed
import { BeeSwarm } from './components/FlyingBees'        // Abejas volando por pantalla
import { HangingButton } from './components/HangingButton'  // Botones colgantes como panales
import { BeeToHiveLoading } from './components/BeeToHiveLoading' // Loading con abejas
// Estilos CSS del componente
import './App.css'

// ========================================
// COMPONENTE PRINCIPAL - APP
// ========================================
function App() {
  // ========================================
  // ESTADOS DE LA INTERFAZ
  // ========================================
  // Controla si se muestra la animación de bienvenida con letras (PRIMERO)
  const [showAnimation, setShowAnimation] = useState(true)
  // Controla si se muestra el modal de bienvenida inicial (DESPUÉS)
  const [showModal, setShowModal] = useState(false)
  // Controla si se muestra el menú de opciones (cámara/galería)
  const [showMenu, setShowMenu] = useState(false)
  // Controla el modal de imagen ampliada
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null)
  
  // ========================================
  // EFECTO DE SECUENCIA DE ANIMACIONES
  // ========================================
  // Maneja la secuencia automática: animación → modal
  useEffect(() => {
    // Después de 5 segundos, oculta la animación y muestra el modal
    const timer = setTimeout(() => {
      setShowAnimation(false)
      setShowModal(true)
    }, 5000)
    
    // Cleanup del timer
    return () => clearTimeout(timer)
  }, [])

  // ========================================
  // REFERENCIAS A ELEMENTOS DOM
  // ========================================
  // Referencias a los inputs de archivo ocultos para cámara y galería
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // ========================================
  // HOOK PERSONALIZADO DE INSTAGRAM
  // ========================================
  // Extrae todas las funciones y estados del hook de Instagram
  const {
    selectedImages,      // Array de imágenes seleccionadas por el usuario
    uploadProgress,      // Estado del progreso de subida (mensaje, paso actual, etc.)
    handleFileSelection, // Función para manejar archivos seleccionados
    removeImage,         // Función para eliminar una imagen específica
    clearAllImages,      // Función para limpiar todas las imágenes
    publishToInstagram   // Función principal para publicar en Instagram
  } = useInstagramUpload()

  // ========================================
  // MANEJADORES DE EVENTOS
  // ========================================
  
  // Maneja el botón "¡A FESTEJAR!" del modal de bienvenida
  const handleCelebrate = () => {
    setShowModal(false)          // Cierra el modal de bienvenida (la animación ya pasó)
  }

  // Maneja el clic en una imagen para abrirla en modal
  const handleImageClick = (imageUrl: string) => {
    setSelectedImageModal(imageUrl)
  }

  // Maneja el cierre del modal de imagen
  const handleCloseImageModal = () => {
    setSelectedImageModal(null)
  }

  // Maneja el botón principal "Subir Fotos"
  const handleMainUpload = () => {
    setShowMenu(true)  // Muestra el menú de opciones (cámara/galería)
  }

  // Maneja el clic en "Tomar Foto" - activa el input de cámara
  const handleCameraClick = () => {
    cameraInputRef.current?.click()  // Simula clic en input oculto de cámara
    setShowMenu(false)               // Cierra el menú de opciones
  }

  // Maneja el clic en "Galería" - activa el input de galería
  const handleGalleryClick = () => {
    galleryInputRef.current?.click()  // Simula clic en input oculto de galería
    setShowMenu(false)                // Cierra el menú de opciones
  }

  // Maneja cuando el usuario selecciona archivos desde cámara o galería
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFileSelection(event.target.files)  // Procesa los archivos seleccionados
    }
  }

  // Maneja el botón "Publicar fotos" - función principal de publicación
  const handlePublish = async () => {
    try {
      // Llama a la función de publicación que maneja todo el proceso
      const result = await publishToInstagram()
      
      // Si se publicaron fotos exitosamente
      if (result.successCount > 0) {
        // Registra el éxito en consola (se puede cambiar por alertas visuales)
        console.log(`${result.successCount} fotos publicadas exitosamente`)
        // Si hubo errores en algunas fotos, también los registra
        if (result.errorCount > 0) {
          console.log(`${result.errorCount} fotos tuvieron problemas`)
        }
        
        // Auto-limpiar después de 3 segundos para volver al estado inicial
        setTimeout(() => {
          clearAllImages()
        }, 3000)
      }
    } catch (error: any) {
      // Maneja errores generales del proceso de publicación
      console.error('Error al publicar:', error.message)
    }
  }

  // ========================================
  // VARIABLES CALCULADAS DE ESTADO
  // ========================================
  // Determina si mostrar la vista previa (cuando hay imágenes Y NO está subiendo Y NO está en éxito)
  const showPreview = selectedImages.length > 0 && !uploadProgress.isUploading && !uploadProgress.isCompleted
  // Determina si mostrar el loading (cuando está subiendo)
  const showLoading = uploadProgress.isUploading
  // Determina si mostrar mensaje de éxito (cuando terminó de subir correctamente Y hay fotos)
  const showSuccess = uploadProgress.isCompleted && !uploadProgress.isUploading && selectedImages.length > 0
  // Determina si mostrar el botón principal (solo cuando NO hay menú, fotos, carga o éxito)
  const showMainButton = !showMenu && !showPreview && !showLoading && !showSuccess

  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================
  return (
    <>
      {/* ========================================
          ABEJAS VOLANDO DE FONDO - ANIMACIÓN
          ======================================== */}
      {/* Componente que muestra 4 abejas volando por la pantalla
          Solo se activa cuando no está el modal ni la animación de bienvenida */}
      <BeeSwarm count={4} isActive={!showModal && !showAnimation} />
      
      {/* ========================================
          CONTENEDOR PRINCIPAL DE LA APLICACIÓN
          ======================================== */}
      <div className="contenedor">
        {/* ========================================
            ENCABEZADO - TÍTULO Y SUBTÍTULO
            ======================================== */}
        <header className="encabezado">
          {/* Título principal con iconos de bebé y corazón */}
          <h1 className="titulo">
            <i className="fas fa-baby"></i>
            ¡Bienvenida Aitana!
            <i className="fas fa-heart"></i>
          </h1>
          {/* Subtítulo explicativo */}
          <p className="subtitulo">¡Comparte los momentos especiales de este día!</p>
        </header>

        {/* ========================================
            CONTENIDO PRINCIPAL DE LA APLICACIÓN
            ======================================== */}
        <main className="contenido-principal">
          {/* ========================================
              SECCIÓN DE BIENVENIDA - TARJETA INFORMATIVA
              ======================================== */}
          <div className="seccion-bienvenida">
            <div className="tarjeta-bienvenida">
              {/* Icono de cámara animado */}
              <i className="fas fa-camera icono-camara"></i>
              {/* Título de la tarjeta */}
              <h2>¡Captura un momento especial!</h2>
              {/* Descripción de funcionalidad */}
              <p>Toma una foto del evento y comparte momentos inolvidables ¡tu foto aparecerá en nuestro perfil de Instagram!</p>
            </div>
          </div>

          {/* ========================================
              SECCIÓN DE FOTOS - FUNCIONALIDAD PRINCIPAL
              ======================================== */}
          <div className="seccion-fotos">
            {/* ========================================
                BOTÓN PRINCIPAL DE SUBIR FOTOS
                Se oculta cuando hay menú, fotos, carga o éxito activos
                ======================================== */}
            <div className="seccion-subir-principal" style={{display: showMainButton ? 'block' : 'none'}}>
              {/* Botón colgante estilo panal con animación de balanceo */}
              <HangingButton
                onClick={handleMainUpload}      // Al hacer clic muestra el menú
                hangingIntensity="medium"       // Intensidad media de balanceo
                delay={0.5}                     // Retraso de 0.5s en la animación
              >
                <i className="fas fa-cloud-upload-alt" style={{ marginRight: '8px' }}></i>
                Subir Fotos
              </HangingButton>
            </div>

            {/* ========================================
                MENÚ DE OPCIONES - CÁMARA O GALERÍA
                Se muestra/oculta según el estado showMenu
                ======================================== */}
            <div id="menuSubir" className="menu-subir" style={{display: showMenu ? 'block' : 'none'}}>
              <div className="opciones-subir" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                {/* Botón para tomar foto con cámara */}
                <HangingButton
                  onClick={handleCameraClick}      // Activa el input de cámara oculto
                  hangingIntensity="light"         // Balanceo suave
                  delay={0}                        // Sin retraso
                >
                  <i className="fas fa-camera" style={{ display: 'block', marginBottom: '5px' }}></i>
                  <span>Tomar Foto</span>
                </HangingButton>
                {/* Botón para seleccionar de galería */}
                <HangingButton
                  onClick={handleGalleryClick}     // Activa el input de galería oculto
                  hangingIntensity="light"         // Balanceo suave
                  delay={0.3}                      // Retraso de 0.3s para efecto escalonado
                >
                  <i className="fas fa-images" style={{ display: 'block', marginBottom: '5px' }}></i>
                  <span>Galería</span>
                </HangingButton>
              </div>
            </div>

            {/* ========================================
                INPUTS OCULTOS PARA SELECCIÓN DE ARCHIVOS
                Elementos no visibles que manejan la selección de archivos
                ======================================== */}
            {/* Input para cámara - capture="environment" usa cámara trasera */}
            <input
              ref={cameraInputRef}           // Referencia para activarlo programáticamente
              type="file"                    // Tipo archivo
              accept="image/*"               // Solo acepta imágenes
              capture="environment"          // Usa cámara trasera en móviles
              multiple                       // Permite seleccionar múltiples archivos
              style={{ display: 'none' }}   // Completamente oculto
              onChange={handleFileChange}    // Función que se ejecuta al seleccionar archivos
            />
            {/* Input para galería - sin capture para acceder a galería */}
            <input
              ref={galleryInputRef}          // Referencia para activarlo programáticamente
              type="file"                    // Tipo archivo
              accept="image/*"               // Solo acepta imágenes
              multiple                       // Permite seleccionar múltiples archivos
              style={{ display: 'none' }}   // Completamente oculto
              onChange={handleFileChange}    // Función que se ejecuta al seleccionar archivos
            />

            {/* ========================================
                VISTA PREVIA DE FOTOS SELECCIONADAS
                Se muestra solo cuando hay imágenes (showPreview = true)
                ======================================== */}
            <div className="vista-previa-fotos" style={{display: showPreview ? 'block' : 'none'}}>
              <div className="contenedor-vista-previa">
                {/* Título de la sección con contador de fotos */}
                <h3 className="titulo-galeria">
                  <i className="fas fa-images"></i>
                  Fotos seleccionadas
                  {/* Muestra el número de fotos seleccionadas */}
                  <span className="contador-fotos">{selectedImages.length}</span>
                </h3>
                {/* Grid que muestra todas las fotos seleccionadas */}
                <div className="galeria-fotos">
                  {/* Mapea cada imagen para mostrarla */}
                  {selectedImages.map((image) => (
                    <div key={image.id} className="photo-item">
                      {/* Imagen preview usando la URL temporal del archivo */}
                      <img 
                        src={image.url} 
                        alt="Foto seleccionada"
                        onClick={() => handleImageClick(image.url)}  // Abre modal al hacer clic
                      />
                      {/* Botón X para eliminar la foto individual */}
                      <button 
                        className="photo-remove" 
                        onClick={(e) => {
                          e.stopPropagation();  // Evita que se active el modal
                          removeImage(image.id);  // Elimina esta foto específica
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
                {/* ========================================
                    ACCIONES DE VISTA PREVIA
                    Botones para agregar más fotos o publicar las seleccionadas
                    ======================================== */}
                <div className="acciones-vista-previa" style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {/* Botón para tomar otra foto */}
                  <HangingButton
                    onClick={handleCameraClick}      // Activa cámara para agregar más fotos
                    hangingIntensity="light"         // Balanceo suave
                    delay={0}                        // Sin retraso
                  >
                    <i className="fas fa-camera" style={{ marginRight: '5px' }}></i>
                    Tomar foto
                  </HangingButton>
                  {/* Botón para agregar más desde galería */}
                  <HangingButton
                    onClick={handleGalleryClick}     // Activa galería para agregar más fotos
                    hangingIntensity="light"         // Balanceo suave
                    delay={0.2}                      // Retraso pequeño para efecto escalonado
                  >
                    <i className="fas fa-images" style={{ marginRight: '5px' }}></i>
                    Galería
                  </HangingButton>
                  {/* Botón principal de publicar - se deshabilita si no hay fotos */}
                  <HangingButton
                    onClick={handlePublish}              // Inicia el proceso de publicación
                    disabled={selectedImages.length === 0}  // Deshabilitado si no hay fotos
                    hangingIntensity="medium"            // Balanceo más pronunciado (botón principal)
                    delay={0.4}                          // Mayor retraso para destacar
                  >
                    <i className="fas fa-share" style={{ marginRight: '5px' }}></i>
                    Publicar fotos
                  </HangingButton>
                </div>
              </div>
            </div>

            {/* ========================================
                SECCIÓN DE CARGA - ANIMACIÓN MIENTRAS SUBE A INSTAGRAM
                Se muestra solo cuando está subiendo (showLoading = true)
                ======================================== */}
            <div className="seccion-carga" style={{display: showLoading ? 'block' : 'none'}}>
              {/* Componente animado con abejas volando hacia la colmena */}
              <BeeToHiveLoading
                message={uploadProgress.message}        // Mensaje actual del proceso
                currentStep={uploadProgress.currentImage}  // Foto actual que se está procesando
                totalSteps={uploadProgress.totalImages}      // Total de fotos a procesar
                progress={uploadProgress.totalImages > 0 ? (uploadProgress.currentImage / uploadProgress.totalImages) * 100 : 0}  // Porcentaje de progreso
              />
            </div>

            {/* ========================================
                SECCIÓN DE ÉXITO - CONFIRMACIÓN DE PUBLICACIÓN
                Se muestra cuando la subida se completó exitosamente
                ======================================== */}
            <div className="seccion-exito" style={{display: showSuccess ? 'block' : 'none'}}>
              <div className="tarjeta-exito">
                {/* Icono de check verde animado */}
                <i className="fas fa-check-circle"></i>
                {/* Título de éxito */}
                <h3>¡Fotos publicadas en Instagram!</h3>
                {/* Mensaje de confirmación con enlace al perfil */}
                <p>Tus fotos han sido publicadas automáticamente en nuestro perfil de Instagram. ¡Gracias por compartir este momento especial!</p>
                {/* Botones de acción post-publicación */}
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
                  {/* Enlace directo al perfil de Instagram */}
                  <a href="https://instagram.com/baby_shower_daella" target="_blank" className="boton-instagram">
                    <i className="fab fa-instagram"></i>
                    Ver en Instagram
                  </a>
                  {/* Botón para limpiar todo y subir más fotos */}
                  <HangingButton
                    onClick={clearAllImages}        // Limpia todas las fotos y reinicia el proceso
                    hangingIntensity="medium"       // Balanceo medio
                    delay={0.5}                     // Retraso para secuencia
                  >
                    <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                    Subir más fotos
                  </HangingButton>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ========================================
            PIE DE PÁGINA - ENLACES Y CRÉDITOS
            ======================================== */}
        <footer className="pie-pagina">
          {/* Enlace al perfil de Instagram */}
          <div className="enlace-instagram">
            <a href="https://instagram.com/baby_shower_daella" target="_blank" className="boton-instagram-pie">
              <i className="fab fa-instagram"></i>
              ¡Visita nuestro perfil!
            </a>
          </div>
          {/* Texto de agradecimiento con iconos de corazón */}
          <p className="texto-pie">
            <i className="fas fa-heart"></i>
            Gracias por acompañarnos en este día especial
            <i className="fas fa-heart"></i>
          </p>
        </footer>
      </div>

      {/* ========================================
          MODAL DE BIENVENIDA INICIAL
          Se muestra al cargar la página (showModal = true por defecto)
          ======================================== */}
      {showModal && (
        <div id="modalBienvenida" className="modal-bienvenida">
          <div className="contenido-modal-bienvenida">
            {/* Encabezado del modal con iconos animados */}
            <div className="encabezado-modal-bienvenida">
              <i className="fas fa-heart"></i>  {/* Corazón animado */}
              <h2>¡Bienvenidos a mi baby shower!</h2>
              <i className="fas fa-baby"></i>   {/* Bebé animado */}
            </div>
            {/* Cuerpo del modal con información */}
            <div className="cuerpo-modal-bienvenida">
              {/* Descripción de la funcionalidad */}
              <p>¡Captura momentos especiales de este día toma múltiples fotos y compártelas con todos!</p>
              {/* Lista de características/funciones disponibles */}
              <div className="caracteristicas-bienvenida">
                <div className="caracteristica">
                  <i className="fas fa-camera"></i>
                  <span>Toma fotos con tu cámara</span>
                </div>
                <div className="caracteristica">
                  <i className="fas fa-images"></i>
                  <span>Sube desde tu galería</span>
                </div>
                <div className="caracteristica">
                  <i className="fas fa-heart"></i>
                  <span>Comparte momentos especiales</span>
                </div>
              </div>
              {/* Botón principal para cerrar modal e iniciar experiencia */}
              <HangingButton
                onClick={handleCelebrate}        // Cierra modal y activa animación
                hangingIntensity="strong"        // Balanceo fuerte para llamar atención
                delay={1}                        // Retraso de 1 segundo
              >
                ¡A FESTEJAR!
              </HangingButton>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          ANIMACIÓN DE BIENVENIDA ESPECIAL
          Texto curvo animado que aparece tras cerrar el modal
          ======================================== */}
      {showAnimation && (
        <div id="animacionBienvenida" className="animacion-bienvenida">
          {/* Contenedor para las líneas de texto curvadas */}
          <div className="contenedor-arco">
            {/* ========================================
                PRIMERA LÍNEA: "¡BIENVENIDA!" 
                Arco superior con cada letra posicionada individualmente
                ======================================== */}
            <div className="linea-arco arco-superior">
              <span className="letra">¡</span>
              <span className="letra">B</span>
              <span className="letra">I</span>
              <span className="letra">E</span>
              <span className="letra">N</span>
              <span className="letra">V</span>
              <span className="letra">E</span>
              <span className="letra">N</span>
              <span className="letra">I</span>
              <span className="letra">D</span>
              <span className="letra">A</span>
              <span className="letra">!</span>
            </div>

            {/* ========================================
                SEGUNDA LÍNEA: "¡AITANA!"
                Arco inferior con cada letra posicionada individualmente
                ======================================== */}
            <div className="linea-arco arco-inferior">
              <span className="letra">¡</span>
              <span className="letra">A</span>
              <span className="letra">I</span>
              <span className="letra">T</span>
              <span className="letra">A</span>
              <span className="letra">N</span>
              <span className="letra">A</span>
              <span className="letra">!</span>
            </div>
          </div>
          {/* Iconos flotantes animados */}
          <div className="iconos-bebe">
            <i className="fas fa-baby"></i>   {/* Bebé */}
            <i className="fas fa-heart"></i>  {/* Corazón */}
            <i className="fas fa-star"></i>   {/* Estrella */}
          </div>
        </div>
      )}

      {/* ========================================
          MODAL DE IMAGEN AMPLIADA
          Se muestra cuando el usuario hace clic en una imagen
          ======================================== */}
      {selectedImageModal && (
        <div className="modal-imagen" onClick={handleCloseImageModal}>
          <div className="modal-imagen-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={handleCloseImageModal}>
              <i className="fas fa-times"></i>
            </button>
            <img src={selectedImageModal} alt="Imagen ampliada" />
          </div>
        </div>
      )}
    </>
  )
}

// ========================================
// EXPORTACIÓN DEL COMPONENTE
// ========================================
export default App

// ========================================
// RESUMEN DEL ARCHIVO App.tsx
// ========================================
/*
Este archivo contiene el componente principal de la aplicación React del baby shower.

FUNCIONALIDADES PRINCIPALES:
1. INTERFAZ DE USUARIO: Maneja toda la UI de la aplicación incluyendo modal de bienvenida, 
   animaciones de texto, botones, vista previa de fotos y estados de carga.

2. INTEGRACIÓN INSTAGRAM: Utiliza el hook personalizado useInstagramUpload para manejar 
   la selección, procesamiento y publicación automática de fotos en Instagram.

3. ANIMACIONES BEE-THEMED: Implementa componentes animados con temática de abejas:
   - BeeSwarm: Abejas volando por la pantalla
   - HangingButton: Botones que cuelgan y se balancean como panales
   - BeeToHiveLoading: Loading animado con abejas volando hacia colmena

4. MANEJO DE ARCHIVOS: Controla inputs ocultos para cámara y galería, permite 
   selección múltiple de imágenes y vista previa antes de publicar.

5. ESTADOS DE LA APLICACIÓN: Maneja diferentes estados (bienvenida, selección, 
   subida, éxito) con transiciones suaves entre cada uno.

FLUJO PRINCIPAL:
Modal bienvenida → Animación de texto → Selección de fotos → Vista previa → 
Publicación con loading → Confirmación de éxito → Opción de repetir proceso

El archivo está completamente comentado para explicar cada sección de código.
*/
