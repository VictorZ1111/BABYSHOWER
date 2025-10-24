// ========================================
// IMPORTACIONES
// ========================================
// Importa hooks de React para manejo de estado y referencias
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
// Hook personalizado para manejar toda la lógica de Instagram y Cloudinary
import { useInstagramUpload } from './hooks/useInstagramUpload'
// Componentes de animaciones
import { FlowerSwarm } from './components/FlyingFlowers'    // Flores volando por pantalla
import { VineHangingButton } from './components/VineHangingButton'  // Nuevo botón con liana
// Importar imagen de la abeja
import abejaSaludando from './assets/IMAGES/ABEJASALUDANDO.png'
// Otras imágenes se cargan desde CSS:
// background1.png, mielesquina1.png, panal2.png, abejaflor.png
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
  // Controla si se muestra la abeja al completar
  const [showBeeSuccess, setShowBeeSuccess] = useState(false)
  // Estados temporales para debugging de recuadros
  const [forceShowCarga, setForceShowCarga] = useState(false)
  const [forceShowAbeja, setForceShowAbeja] = useState(false)
  
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
  
  // Maneja el botón "¡A FESTEJAR!" del modal de bienvenida (OPTIMIZADO)
  const handleCelebrate = useCallback(() => {
    setShowModal(false)          // Cierra el modal de bienvenida (la animación ya pasó)
  }, [])

  // Maneja el clic en una imagen para abrirla en modal (OPTIMIZADO)
  const handleImageClick = useCallback((imageUrl: string) => {
    setSelectedImageModal(imageUrl)
  }, [])

  // Maneja el cierre del modal de imagen (OPTIMIZADO)
  const handleCloseImageModal = useCallback(() => {
    setSelectedImageModal(null)
  }, [])

  // Maneja el botón principal "Subir Fotos" (OPTIMIZADO)
  const handleMainUpload = useCallback(() => {
    setShowMenu(true)  // Muestra el menú de opciones (cámara/galería)
  }, [])

  // Maneja el clic en "Tomar Foto" - activa el input de cámara (OPTIMIZADO)
  const handleCameraClick = useCallback(() => {
    cameraInputRef.current?.click()  // Simula clic en input oculto de cámara
    setShowMenu(false)               // Cierra el menú de opciones
  }, [])

  // Maneja el clic en "Galería" - activa el input de galería (OPTIMIZADO)
  const handleGalleryClick = useCallback(() => {
    galleryInputRef.current?.click()  // Simula clic en input oculto de galería
    setShowMenu(false)                // Cierra el menú de opciones
  }, [])

  // Maneja cuando el usuario selecciona archivos desde cámara o galería (OPTIMIZADO)
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFileSelection(event.target.files)  // Procesa los archivos seleccionados
    }
  }, [handleFileSelection])

  // Maneja el botón "Publicar fotos" - función principal de publicación (OPTIMIZADO)
  const handlePublish = useCallback(async () => {
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
        
        // Mostrar la abeja por 3 segundos
        setShowBeeSuccess(true)
        setTimeout(() => {
          setShowBeeSuccess(false)
          clearAllImages()
        }, 3000)
      }
    } catch (error: any) {
      // Maneja errores generales del proceso de publicación
      console.error('Error al publicar:', error.message)
      // También limpiar en caso de error después de 3 segundos
      setTimeout(() => {
        setShowBeeSuccess(false)
        clearAllImages()
      }, 3000)
    }
  }, [publishToInstagram, clearAllImages])

  // ========================================
  // VARIABLES CALCULADAS DE ESTADO (OPTIMIZADAS CON MEMO)
  // ========================================
  // Determina si mostrar la vista previa (cuando hay imágenes Y NO está subiendo Y NO está en éxito)
  const showPreview = useMemo(() => 
    selectedImages.length > 0 && !uploadProgress.isUploading && !uploadProgress.isCompleted,
    [selectedImages.length, uploadProgress.isUploading, uploadProgress.isCompleted]
  )
  
  // Determina si mostrar el loading (cuando está subiendo)
  const showLoading = useMemo(() => 
    uploadProgress.isUploading,
    [uploadProgress.isUploading]
  )
  
  // Determina si mostrar mensaje de éxito (cuando terminó de subir correctamente Y hay fotos)
  const showSuccess = useMemo(() => 
    uploadProgress.isCompleted && !uploadProgress.isUploading && selectedImages.length > 0,
    [uploadProgress.isCompleted, uploadProgress.isUploading, selectedImages.length]
  )
  
  // Determina si mostrar el botón principal (solo cuando NO hay menú, fotos, carga o éxito)
  const showMainButton = useMemo(() => 
    !showMenu && !showPreview && !showLoading && !showSuccess,
    [showMenu, showPreview, showLoading, showSuccess]
  )

  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================
  
  return (
    <>
      {/* ========================================
          ENCABEZADO FIJO - DECORACIÓN DE MIEL
          ======================================== */}
      <div className="honey-header-decoration"></div>

      {/* ========================================
          FLORES VOLANDO DE FONDO - ANIMACIÓN
          ======================================== */}
      {/* Componente que muestra flores cayendo como hojas naturales
          Solo se muestran cuando no hay procesos intensivos para optimizar rendimiento */}
      {!showModal && !showAnimation && !showLoading && (
        <FlowerSwarm count={11} />
      )}
      
      {/* ========================================
          CONTENEDOR PRINCIPAL DE LA APLICACIÓN
          ======================================== */}
      <div className="contenedor">
        {/* ========================================
            ENCABEZADO - TÍTULO Y SUBTÍTULO
            ======================================== */}
        <header className="encabezado">
          {/* Imagen abejavolando1 como encabezado */}
          <div className="abejavolando-encabezado"></div>
          {/* Subtítulo explicativo */}
          <br></br>
          <br></br>
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
              {/* Miel específica para tarjeta bienvenida */}
              <div className="miel-tarjeta-bienvenida"></div>
              {/* Panal2 en esquina inferior derecha - RECUADRO 1 */}
              <div className="panal-tarjeta-bienvenida"></div>
              
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
              {/* Botón colgante principal con animación de balanceo */}
              <VineHangingButton
                onClick={handleMainUpload}      // Al hacer clic muestra el menú
                hangingIntensity="medium"       // Intensidad media de balanceo
                delay={0.5}                     // Retraso de 0.5s en la animación
              >
                <i className="fas fa-cloud-upload-alt" style={{ marginRight: '8px' }}></i>
                Subir Fotos
              </VineHangingButton>
            </div>

            {/* ========================================
                MENÚ DE OPCIONES - CÁMARA O GALERÍA
                Se muestra/oculta según el estado showMenu
                ======================================== */}
            <div id="menuSubir" className="menu-subir" style={{display: showMenu ? 'block' : 'none'}}>
              <div className="opciones-subir" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                {/* Botón para tomar foto con cámara */}
                <VineHangingButton
                  onClick={handleCameraClick}      // Activa el input de cámara oculto
                  delay={0}                        // Sin retraso
                >
                  <i className="fas fa-camera" style={{ display: 'block', marginBottom: '5px' }}></i>
                  <span>Tomar Foto</span>
                </VineHangingButton>
                {/* Botón para seleccionar de galería */}
                <VineHangingButton
                  onClick={handleGalleryClick}     // Activa el input de galería oculto
                  delay={0.3}                      // Retraso de 0.3s para efecto escalonado
                >
                  <i className="fas fa-images" style={{ display: 'block', marginBottom: '5px' }}></i>
                  <span>Galería</span>
                </VineHangingButton>
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
            {/* Input para galería - optimizado para abrir galería nativa */}
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
                {/* Miel específica para vista previa */}
                <div className="miel-vista-previa"></div>
                {/* Panal2 en esquina inferior derecha - RECUADRO 4 */}
                <div className="panal-vista-previa"></div>
                
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
                <div className="acciones-vista-previa">
                  {/* Contenedor para botones de tomar foto y galería (lado a lado) */}
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '15px' }}>
                    {/* Botón para tomar otra foto */}
                    <VineHangingButton
                      onClick={handleCameraClick}      // Activa cámara para agregar más fotos
                      delay={0}                        // Sin retraso
                    >
                      <i className="fas fa-camera" style={{ marginRight: '5px' }}></i>
                      Tomar foto
                    </VineHangingButton>
                    {/* Botón para agregar más desde galería */}
                    <VineHangingButton
                      onClick={handleGalleryClick}     // Activa galería para agregar más fotos
                      delay={0.2}                      // Retraso pequeño para efecto escalonado
                    >
                      <i className="fas fa-images" style={{ marginRight: '5px' }}></i>
                      Galería
                    </VineHangingButton>
                  </div>
                  
                  {/* Botón de publicar abajo (centrado) */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <VineHangingButton
                      onClick={handlePublish}              // Inicia el proceso de publicación
                      disabled={selectedImages.length === 0}  // Deshabilitado si no hay fotos
                      delay={0.4}                          // Mayor retraso para destacar
                      className="bounce-top"               // Animación bounce-top especial
                    >
                      <i className="fas fa-share" style={{ marginRight: '5px' }}></i>
                      Publicar fotos
                    </VineHangingButton>
                  </div>
                  
                  {/* Botón temporal para debugging */}
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button 
                      onClick={() => setForceShowCarga(true)}
                      style={{ padding: '8px 15px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', fontSize: '12px' }}
                    >
                      🐛 Debug: Ver Carga
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================
                SECCIÓN DE CARGA - ANIMACIÓN HONEYCOMB SIMPLIFICADA
                Se muestra solo cuando está subiendo (showLoading = true)
                ======================================== */}
            <div className="seccion-carga" style={{display: showLoading || showBeeSuccess || forceShowCarga || forceShowAbeja ? 'block' : 'none'}}>
              {/* SOLO mielesquina1 en esquina superior izquierda */}
              <div className="miel-esquina-superior"></div>
              
              {/* Botones temporales para debugging */}
              {(forceShowCarga || forceShowAbeja) && (
                <div style={{position: 'absolute', top: '10px', right: '10px', zIndex: 999}}>
                  {forceShowCarga && (
                    <button 
                      onClick={() => {setForceShowCarga(false); setForceShowAbeja(true)}}
                      style={{marginRight: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px'}}
                    >
                      Ir a Abeja
                    </button>
                  )}
                  {forceShowAbeja && (
                    <button 
                      onClick={() => {setForceShowAbeja(false); setForceShowCarga(false)}}
                      style={{padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px'}}
                    >
                      Volver al inicio
                    </button>
                  )}
                </div>
              )}
              
              {/* Nuevo diseño simple con animación honeycomb */}
              <div className="carga-honeycomb-container">
                {/* Miel específica para modal LISTO */}
                <div className="miel-modal-listo"></div>
                {/* Panal2 en esquina inferior derecha - RECUADRO 5 MODAL LISTO */}
                <div className="panal-modal-listo"></div>
                
                {(showBeeSuccess || forceShowAbeja) ? (
                  // Estado final: Abeja saludando
                  <>
                    <div className="abeja-saludando">
                      <img 
                        src={abejaSaludando}
                        alt="Abeja saludando" 
                        className="abeja-volando"
                      />
                    </div>
                    <div className="mensaje-carga">¡LISTO!</div>
                  </>
                ) : (
                  // Estado de carga: Honeycomb
                  <>
                    <div className="honeycomb">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <div className="mensaje-carga">¡EN CAMINO!</div>
                  </>
                )}
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
            {/* Miel específica para modal festejar */}
            <div className="miel-modal-festejar"></div>
            {/* Panal2 en esquina inferior derecha - RECUADRO 2 */}
            <div className="panal-modal-festejar"></div>
            
            {/* Encabezado del modal con iconos animados */}
            <div className="encabezado-modal-bienvenida">
              
              <h2>¡Bienvenidos a mi baby shower!</h2>
             
            </div>
            {/* Cuerpo del modal con información */}
            <div className="cuerpo-modal-bienvenida">
              {/* Descripción de la funcionalidad */}
              <p>¡Captura momentos especiales de este día toma múltiples fotos y compártelas con todos!</p>
              {/* Lista de características/funciones disponibles */}
              <div className="caracteristicas-bienvenida">
                <div className="caracteristica">
                  
                  <span>Toma fotos con tu cámara</span>
                  <i className="fas fa-camera"></i>
                </div>
                <div className="caracteristica">
                  <i className="fas fa-images"></i>
                  <span>Sube desde tu galería</span>
                  {/* Abeja saludando a la derecha del texto */}
                  <div className="abeja-galeria"></div>
                </div>
                <div className="caracteristica">
                  
                  <span>Comparte momentos especiales</span>
                  <i className="fas fa-heart"></i>
                </div>
              </div>
              {/* Botón principal con nuevo diseño SVG animado */}
              <button className="new-animated-btn btn-separated" onClick={handleCelebrate}>
                ¡A FESTEJAR!
                <div className="icon-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    version="1.1"
                    style={{shapeRendering:"geometricPrecision", textRendering:"geometricPrecision", imageRendering:"optimizeQuality" as any, fillRule:"evenodd", clipRule:"evenodd"}}
                    viewBox="0 0 26.3 65.33"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <g id="Layer_x0020_1">
                      <path
                        className="leaf-path"
                        d="M13.98 52.87c0.37,-0.8 0.6,-1.74 0.67,-2.74 1.01,1.1 2.23,2.68 1.24,3.87 -0.22,0.26 -0.41,0.61 -0.59,0.97 -2.95,5.89 3.44,10.87 2.98,0.78 0.29,0.23 0.73,0.82 1.03,1.18 0.33,0.4 0.7,0.77 1,1.15 0.29,0.64 -0.09,2.68 1.77,4.91 5.42,6.5 5.67,-2.38 0.47,-4.62 -0.41,-0.18 -0.95,-0.26 -1.28,-0.54 -0.5,-0.41 -1.23,-1.37 -1.66,-1.9 0.03,-0.43 -0.17,-0.13 0.11,-0.33 4.98,1.72 8.4,-1.04 2.38,-3.16 -1.98,-0.7 -2.9,-0.36 -4.72,0.16 -0.63,-0.58 -2.38,-3.82 -2.82,-4.76 1.21,0.56 1.72,1.17 3.47,1.3 6.5,0.5 2.31,-4.21 -2.07,-4.04 -1.12,0.04 -1.62,0.37 -2.49,0.62l-1.25 -3.11c0.03,-0.26 0.01,-0.18 0.1,-0.28 1.35,0.86 1.43,1 3.25,1.45 2.35,0.15 3.91,-0.15 1.75,-2.4 -1.22,-1.27 -2.43,-2.04 -4.22,-2.23l-2.08 0.13c-0.35,-0.58 -0.99,-2.59 -1.12,-3.3l-0.01 -0.01 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0c-0.24,-0.36 1.88,1.31 2.58,1.57 1.32,0.49 2.6,0.33 3.82,0 -0.37,-1.08 -1.17,-2.31 -2.13,-3.11 -1.79,-1.51 -3.07,-1.41 -5.22,-1.38l-0.93 -4.07c0.41,-0.57 1.41,0.9 2.82,1.36 0.96,0.31 1.94,0.41 3,0.14 2,-0.52 -2.25,-4.4 -4.53,-4.71 -0.7,-0.1 -1.23,-0.04 -1.92,-0.03 -0.46,-0.82 -0.68,-3.61 -0.92,-4.74 0.8,0.88 1.15,1.54 2.25,2.23 0.8,0.5 1.58,0.78 2.57,0.85 2.54,0.18 -0.1,-3.47 -0.87,-4.24 -1.05,-1.05 -2.34,-1.59 -4.32,-1.78l-0.33 -3.49c0.83,0.67 1.15,1.48 2.3,2.16 1.07,0.63 2.02,0.89 3.58,0.79 0.15,-1.34 -1.07,-3.39 -2.03,-4.3 -1.05,-0.99 -2.08,-1.47 -3.91,-1.68l-0.07 -3.27 0.32 -0.65c0.44,0.88 1.4,1.74 2.24,2.22 0.69,0.39 2.4,1.1 3.44,0.67 0.31,-1.92 -1.84,-4.49 -3.5,-5.29 -0.81,-0.39 -1.61,-0.41 -2.18,-0.68 -0.12,-1.28 0.27,-3.23 0.37,-4.55l-0.89 0c-0.06,1.28 -0.35,3.12 -0.34,4.31 -0.44,0.45 -0.37,0.42 -0.96,0.64 -3.88,1.49 -4.86,6.38 -3.65,7.34 1.42,-0.31 3.69,-2.14 4.16,-3.66 0.23,0.5 0.1,2.36 0.05,3.05 -1.23,0.4 -2.19,1.05 -2.92,1.82 -1.17,1.24 -2.36,4.04 -1.42,5.69 1.52,0.09 4.07,-2.49 4.49,-4.07l0.29 3.18c-2.81,0.96 -5.01,3.68 -4.18,7.43 2.06,-0.09 3.78,-2.56 4.66,-4.15 0.23,1.45 0.67,3.06 0.74,4.52 -1.26,0.93 -2.37,1.8 -2.97,3.55 -0.48,1.4 -0.49,3.72 0.19,4.55 0.59,0.71 2.06,-1.17 2.42,-1.67 1,-1.35 0.81,-1.92 1.29,-2.46l0.7 3.44c-0.49,0.45 -0.94,0.55 -1.5,1.19 -1.93,2.23 -2.14,4.33 -1.01,6.92 0.72,0.09 2.04,-1.4 2.49,-2.06 0.65,-0.95 0.79,-1.68 1.14,-2.88l0.97 2.92c-0.2,0.55 -1.84,1.32 -2.6,3.62 -0.54,1.62 -0.37,3.86 0.67,4.93 0.58,-0.09 1.85,-1.61 2.2,-2.19 0.66,-1.09 0.66,-1.64 1,-2.93l1.32 3.18c-0.23,0.72 -1.63,1.72 -1.82,4.18 -0.17,2.16 1.11,6.88 3.13,2.46zm-4.09 -16.89l-0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 -0 0.01 0.01z"
                      />
                    </g>
                  </svg>
                </div>
                <div className="icon-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    version="1.1"
                    style={{shapeRendering:"geometricPrecision", textRendering:"geometricPrecision", imageRendering:"optimizeQuality" as any, fillRule:"evenodd", clipRule:"evenodd"}}
                    viewBox="0 0 11.67 37.63"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <g id="Layer_x0020_1">
                      <path
                        className="leaf-path"
                        d="M7.63 35.26c-0.02,0.13 0.01,0.05 -0.06,0.14 -0,0 -0.08,0.07 -0.11,0.1 -0.42,0.25 -0.55,0.94 -0.23,1.4 0.68,0.95 2.66,0.91 3.75,0.21 0.2,-0.13 0.47,-0.3 0.57,-0.49 0.09,-0.02 0.04,0.03 0.11,-0.07l-1.35 -1.24c-0.78,-0.78 -1.25,-1.9 -2.07,-0.62 -0.11,0.18 -0.06,0.16 -0.22,0.26 -0.4,-0.72 -0.95,-1.79 -1.26,-2.59 0.82,0.02 1.57,-0.12 2.16,-0.45 0.49,-0.27 1.15,-0.89 1.33,-1.4 0.1,-0.06 0.02,0.01 0.06,-0.1 -0.24,-0.16 -0.87,-0.37 -1.19,-0.52 -0.4,-0.19 -0.73,-0.39 -1.09,-0.62 -0.25,-0.16 -0.85,-0.6 -1.18,-0.3 -0.35,0.32 -0.32,0.83 -0.53,1.17 -0.71,-0.3 -0.55,-0.26 -0.84,-1.22 -0.15,-0.5 -0.31,-1.12 -0.41,-1.66l0.03 -0.13c0.56,0.23 1.28,0.37 1.99,0.28 0.56,-0.07 1.33,-0.42 1.62,-0.71l0.1 -0.1c-0.74,-0.68 -1.09,-1.2 -1.65,-1.99 -1.09,-1.52 -1.2,-0.28 -1.92,0.17 -0.26,-0.79 -0.73,0.2 -0.12,-2.76 0.06,-0.3 0.19,-0.7 0.2,-0.98 0.18,0.08 0.01,-0.01 0.11,0.08 0.05,0.05 0.07,0.07 0.1,0.12 0.94,1.17 3.63,0.82 4.21,0.01 0.13,-0.02 0.06,0.03 0.1,-0.1 -1.14,-0.81 -1.91,-2.89 -2.58,-2.67 -0.29,0.09 -0.78,0.63 -0.93,0.87 -0.54,-0.48 -0.36,-0.63 -0.38,-0.81 0.01,-0.01 0.03,-0.04 0.03,-0.03 0.01,0.02 0.36,-0.35 0.45,-0.6 0.13,-0.35 0.04,-0.65 -0.05,-0.95 0.06,-0.41 0.33,-1.33 0.28,-1.71 0.22,-0.05 0.19,0.05 0.45,0.17 0.47,0.23 1.17,0.33 1.7,0.32 0.62,-0 1.74,-0.39 1.94,-0.75 0.14,-0.02 0.05,0.06 0.13,-0.09 -1.05,-1.1 -0.7,-0.64 -1.62,-1.92 -0.58,-0.81 -0.9,-1.27 -1.9,0.12 -0.44,-0.5 -0.64,-0.69 -0.66,-1.24 0.02,-0.31 0.15,-0.36 0.08,-0.73 -0.04,-0.24 -0.14,-0.41 -0.29,-0.59l-0.47 -2.54c0.09,-0.14 -0.09,-0.1 0.2,-0.05 0.06,0.01 0.19,0.05 0.3,0.07 0.54,0.09 1.47,0.01 1.95,-0.15 0.57,-0.19 1.53,-0.8 1.68,-1.18 0.16,-0.07 0.05,0.02 0.15,-0.13 -0.12,-0.15 -0.95,-0.65 -1.15,-0.8 -1.43,-1.08 -2.21,-2.77 -3.16,-0.38 -0.2,-0.1 -0.75,-0.55 -0.83,-0.74 -0.15,-0.35 -0.21,-0.81 -0.37,-1.15l-0.1 -0.25c-0.03,-0.3 -0.44,-1.33 -0.57,-1.64 -0.2,-0.51 -0.47,-1.09 -0.64,-1.6l-0.55 0c0.14,0.42 0.36,0.84 0.53,1.28 0.12,0.3 0.19,0.35 0.06,0.66l-0.21 0.52c-0.01,0.01 -0.01,0.02 -0.02,0.03 -0.06,0.1 -0.03,0.05 -0.06,0.09 -1.44,-1.03 -1.66,-0.73 -2.07,0.46 -0.16,0.46 -0.3,0.93 -0.5,1.36l-0.64 1.28c0.06,0.07 -0,0.03 0.1,0.03 0.05,0.05 0.02,0.03 0.1,0.08l0.49 0.14c0.23,0.05 0.44,0.09 0.66,0.1 0.55,0.04 0.94,-0.06 1.35,-0.19 0.54,-0.18 1.09,-0.44 1.5,-0.82 0.15,-0.14 0.24,-0.3 0.4,-0.41l0.46 1.66c0.03,0.74 -0.09,0.6 0.27,1.21 0.01,0.01 0.01,0.02 0.02,0.03 0.01,0.01 0.01,0.02 0.02,0.04l0.07 0.11c-0.02,0.22 0.19,1.01 0.24,1.29 0.09,0.46 -0.21,0.79 -0.3,1.2 -0.55,-0.23 -1.25,-1.06 -1.66,-0.23 -0.12,0.25 -0.17,0.36 -0.26,0.62 -0.33,1.01 -0.63,1.61 -1.06,2.43l0.12 0.04 0.23 0.11c0.06,0.02 0.17,0.04 0.25,0.06 0.17,0.04 0.34,0.08 0.52,0.09 0.29,0.02 0.93,0.07 1.12,-0.13 0.42,0.01 1.24,-0.49 1.51,-0.71 0.01,0.01 0.03,0 0.04,0.02l0.09 0.06c-0.04,0.29 0.02,0.41 0.03,0.7l-0.05 1.41c-0.06,1.12 -0.29,1.06 -0.76,1.69 -0.08,-0.07 -0.03,-0.01 -0.11,-0.11 -0.03,-0.03 -0.06,-0.08 -0.09,-0.11 -0.2,-0.25 -0.38,-0.54 -0.7,-0.69 -0.7,-0.32 -1.52,1.73 -2.82,2.61 0.04,0.2 -0.01,0.06 0.1,0.11 0.25,0.3 1,0.67 1.5,0.78 0.35,0.08 0.71,0.08 1.09,0.05 0.25,-0.02 0.82,-0.16 0.92,-0.13 -0.16,0.69 -0.35,1.35 -0.52,2.03 -0.25,1 -0.03,0.77 -0.98,1.53 -0.3,-0.31 -0.33,-0.77 -0.77,-1.02 -0.42,-0.25 -0.91,0.35 -1.12,0.55 -0.33,0.32 -0.58,0.6 -0.97,0.89 -0.19,0.14 -0.34,0.26 -0.53,0.4 -0.14,0.11 -0.43,0.29 -0.53,0.4 0.1,0.15 -0.02,0.06 0.15,0.13 0.09,0.22 0.35,0.38 0.54,0.52 0.22,0.16 0.43,0.29 0.69,0.39 0.43,0.17 1.32,0.31 1.87,0.23l0.23 -0.05c0.01,-0 0.03,-0.02 0.04,-0.02 0.01,-0 0.02,-0.01 0.03,-0.02 0.32,0.05 0.52,-0.18 0.79,-0.24l-0.02 0.66c0,0.77 -0.24,0.75 0.16,1.51l0.04 0.07c0,0.01 0.01,0.03 0.02,0.04 -0.05,0.35 0.18,1.03 0.24,1.4 -0.23,0.18 -0.34,0.33 -0.51,0.41 -0.75,-1.17 -0.82,-1.52 -1.92,-0.43 -0.32,0.31 -0.59,0.57 -0.95,0.86 -0.23,0.19 -0.95,0.65 -1.05,0.81l0.13 0.1c0.88,1.15 3.14,1.5 4.1,0.82 0.47,-0.34 0.54,-0.56 0.52,-1.34l0.67 1.84c0.03,0.16 0.06,0.28 0.12,0.42 0.03,0.06 0.05,0.12 0.09,0.17 0.1,0.15 0.03,0.06 0.13,0.14 -0,0.29 0.14,0.22 0.06,0.56 -0.03,0.13 -0.14,0.43 -0.19,0.53 -1.94,-1.27 -1.57,-0.02 -2.28,1.76 -0.16,0.41 -0.37,0.77 -0.53,1.2 0.09,0.08 0.01,0.03 0.15,0.03 0.29,0.33 1.66,0.28 2.36,-0.01 0.48,-0.2 0.96,-0.46 1.3,-0.82 0.15,-0.16 0.16,-0.3 0.38,-0.33 0.14,0.08 0.17,0.19 0.27,0.36z"
                      />
                    </g>
                  </svg>
                </div>
                <div className="icon-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    version="1.1"
                    style={{shapeRendering:"geometricPrecision", textRendering:"geometricPrecision", imageRendering:"optimizeQuality" as any, fillRule:"evenodd", clipRule:"evenodd"}}
                    viewBox="0 0 25.29 76.92"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <g id="Layer_x0020_1">
                      <path
                        className="leaf-path"
                        d="M19.14 6.58c0.09,0.1 -0.02,0.03 0.17,0.15 0.04,0.03 0.19,0.09 0.27,0.13l0.16 0.02c0.12,0.14 0.02,0.06 0.22,0.18 0.63,0.37 1.81,0.52 2.51,0.53 0.42,-0.26 0.61,-1.58 0.55,-2.27 -0.11,-1.17 -1.02,-3.42 -2.17,-3.76 -0.84,-0.25 -1.19,0.02 -1.4,0.7 -0.03,0.1 -0.05,0.19 -0.09,0.28l-0.18 0.25c-0.18,-0.36 -0.77,-0.97 -1.2,-1.18 -0.64,-0.31 -0.36,-0.26 -0.84,-1.59l-0.75 0c0.2,0.63 0.44,1.27 0.61,1.92 0.17,0.64 0.47,1.46 0.58,2.05 -0.21,0.36 -0.43,0.5 -0.31,1.1 0.11,0.51 0.35,0.71 0.76,0.9 0.13,0.31 0.36,1.33 0.39,1.78 -0.68,0.24 -1.38,0.85 -1.62,1.43 -0.45,-0.47 -0.29,-1.59 -1.59,-1.22 -0.8,0.22 -1.09,0.8 -1.45,1.52 -0.58,1.18 -0.96,2.15 -0.6,3.58 0.04,0.17 0.13,0.4 0.19,0.55 0.11,0.29 0.09,0.34 0.35,0.44 1.74,-0.01 2.96,-0.82 4.13,-1.55 0.22,-0.13 0.65,-0.39 0.79,-0.62 0.74,-1.2 -0.74,-2.14 -1.7,-2.43 -0.01,-0.51 1.07,-0.87 1.7,-0.82 0.21,1.74 0.56,3.5 0.61,5.33 0.05,2.05 0.01,3.68 -0.08,5.71 -1.2,0.52 -0.99,0.65 -1.77,1.46 -0.39,-0.45 -0.22,-1.6 -1.59,-1.18 -0.79,0.24 -0.91,0.63 -1.42,1.55 -0.78,1.41 -0.95,2.66 -0.36,4.15 0.14,0.35 0.06,0.36 0.36,0.37 0.78,-0 1.47,-0.18 2.09,-0.43 0.51,-0.2 1.26,-0.76 1.69,-0.86 -0.18,0.3 -0.34,0.91 -0.48,1.25l-1.54 3.5c-1.75,0.08 -1.26,0.29 -2.27,0.59 0.1,-1.15 0.1,-1.69 -1.1,-1.78 -0.7,-0.05 -1.5,0.65 -1.91,0.96 -1.04,0.82 -1.93,1.81 -1.94,3.77 0.09,0.22 -0.03,0.09 0.18,0.11 0.24,0.36 1.4,0.49 1.94,0.58l0.19 -0.01 0.71 -0.01 0.08 -0.02 1.74 -0.17c0.25,0.04 0.03,-0.07 0.19,0.09l-2.62 4.74c-0.28,0.51 -0.56,1.2 -0.86,1.61 -0.44,-0.02 -0.69,-0.14 -1.18,-0.08 -0.38,0.04 -0.72,0.17 -1.08,0.22 0.1,-0.53 0.78,-1.5 -0.62,-1.96 -0.79,-0.26 -1.74,0.32 -2.33,0.6 -2.12,1.02 -2.81,3.28 -2.36,3.38 0.01,0.01 0.03,0.02 0.03,0.04l0.11 0.1c0.42,0.34 1.16,0.64 1.66,0.79 0.65,0.19 1.73,0.31 2.43,0.38 3,0.28 1.16,-2.8 1.09,-3.14 0.86,0.12 1.3,-0.05 1.81,0.56 -0.08,0.35 -0.53,1.2 -0.71,1.6 -0.74,1.61 -1.24,3.24 -1.73,4.96 -0.92,0.11 -1.11,0.44 -1.77,0.69 0.01,-1.08 0.1,-1.68 -1.14,-1.71 -0.55,-0.01 -0.8,0.17 -1.11,0.41 -1.43,1.08 -2.52,2.24 -2.53,4.15 -0,0.62 0.11,0.48 0.22,0.54 0.63,0.38 1.79,0.44 2.67,0.35 0.47,-0.05 0.97,-0.11 1.43,-0.2l0.98 -0.22c0.38,-0.08 0.14,-0.15 0.26,0.06 -0.08,0.78 -0.66,2.6 -0.56,3.29 -0.13,0.14 -0.07,0.08 -0.17,0.29 -0.06,0.13 -0.08,0.18 -0.12,0.33 -0.07,0.3 -0.02,0.6 -0.03,0.92 -0.09,0.94 -0.17,0.52 -0.78,0.94 -0.32,0.22 -0.57,0.55 -0.86,0.82 -0.29,-0.69 -0.22,-1.44 -1.39,-1.13 -0.93,0.25 -1.93,2.19 -2.03,3.16 -0.06,0.56 0.02,1.84 0.39,2.08 2,0.02 2.64,-0.6 4.08,-1.25l-0.01 0.28c-0.06,0.58 -0.22,2.09 -0.14,2.62 -0.44,0.37 -0.46,1.03 -0.12,1.49 -0.08,3.97 0.16,2.73 -0.77,3.57 -0.24,0.21 -0.37,0.4 -0.62,0.62 -0.36,-0.53 -0.09,-1.43 -1.37,-1.13 -0.98,0.23 -1.92,2.22 -2.06,3.14 -0.07,0.47 -0.07,1.79 0.41,2.09 0.86,0.04 1.94,-0.12 2.51,-0.52l0.16 -0.08c0.6,-0.17 1.39,-0.67 1.84,-0.94 0.12,0.18 0.04,0.07 0.14,0.1 -0.18,0.38 -0.31,0.07 -0.71,0.58 -0.67,0.86 0.33,1.72 0.89,2.31 0.6,0.64 1.71,1.63 2.94,1.88 0.38,-0.11 0.92,-1.2 1.04,-1.69 0.21,-0.86 0.15,-1.53 -0.05,-2.41 -0.22,-0.94 -0.24,-1.38 -1.01,-1.81 -0.93,-0.52 -1.19,0.28 -1.59,0.76 -0.21,-0.33 -0.33,-0.79 -0.58,-1.12 -0.48,-0.62 -0.48,-0.13 -0.5,-1.22 -0.02,-1.09 0.05,-2.25 0.01,-3.32 0.37,0.22 0.89,0.86 1.37,1.21 0.51,0.37 1.05,0.65 1.76,0.82 0.32,-0.02 0.92,-1.21 1.04,-1.68 0.22,-0.87 0.15,-1.53 -0.04,-2.41 -0.19,-0.86 -0.3,-1.41 -0.96,-1.79 -1.06,-0.6 -1.26,0.38 -1.71,0.74 -0.22,-0.8 -0.65,-1.34 -1.19,-1.71l0.5 -4.35 0.38 0.28c0.23,0.25 0.6,0.67 0.87,0.82 0.07,0.1 0.05,0.1 0.19,0.21 0.18,0.23 0.66,0.57 0.92,0.6 0.1,0.13 -0.01,0.03 0.16,0.16 0.08,0.06 0.1,0.07 0.18,0.11 0.14,0.07 0.26,0.1 0.44,0.15l0.45 0.17c0.35,0.08 0.75,-0.74 0.91,-1.05 0.21,-0.4 0.41,-1.07 0.43,-1.57 -0,-0.28 0.04,-0.67 -0.1,-0.85l0.03 -0.17c-0,-0.04 -0.01,-0.13 -0.01,-0.15 -0.05,-0.13 -0.03,-0.1 -0.09,-0.17 0.06,-0.51 -0.25,-1.75 -0.94,-2.22 -1.11,-0.74 -1.37,0.09 -1.86,0.69l-0.12 -0.2c-0.28,-0.56 -0.41,-1.06 -1,-1.45 0.04,-1.21 1.29,-5.03 1.31,-5.65 0.07,0.06 0.05,0.04 0.12,0.13 0.63,0.83 0.41,0.6 1.22,1.38 0.76,0.74 1.67,1.73 2.95,1.92 0.28,0.13 0.55,-0.41 0.69,-0.64 0.21,-0.34 0.36,-0.64 0.47,-1.02 0.36,-1.24 0.14,-3.92 -1.03,-4.6 -1.23,-0.72 -1.67,0.89 -1.75,0.72 -0.01,-0.01 -0.03,0.02 -0.04,0.03 -0.19,-0.33 -0.3,-0.68 -0.49,-1 -0.22,-0.38 -0.47,-0.51 -0.68,-0.79 0.39,-1.04 1.05,-2.29 1.59,-3.3 0.57,-1.06 1.2,-2.15 1.7,-3.17 1.43,-0.02 1.51,0.55 1.8,0.6 -0.1,0.19 -0.02,0.07 -0.16,0.2 -0.01,0.01 -0.21,0.13 -0.23,0.15 -0.8,0.47 -1.8,0.96 -1.37,2.09 0.14,0.37 0.42,0.53 0.75,0.73 1.23,0.73 2.46,1.53 4.32,1.53 0.28,-0.08 0.25,-0.15 0.35,-0.44 0.22,-0.63 0.33,-1.22 0.26,-1.93 -0.11,-1.05 -1.06,-3.33 -2.21,-3.65 -1.31,-0.37 -1.17,0.6 -1.56,1.21l-0.2 -0.19c-0.84,-0.96 -0.61,-0.56 -1.27,-1.09 0.16,-0.47 0.7,-1.32 0.98,-1.82 1.05,-1.91 1.94,-3.59 2.84,-5.61 0.73,0.01 1.23,0.31 1.57,0.68 -0.26,0.25 -1.37,0.7 -1.67,1.19 -0.51,0.8 -0.07,1.45 0.63,1.87 1.15,0.7 2.56,1.58 4.34,1.55 0.33,-0.09 0.46,-0.67 0.52,-0.98 0.28,-1.4 -0.01,-2.34 -0.66,-3.5 -0.49,-0.87 -0.67,-1.3 -1.44,-1.54 -1.15,-0.36 -1.27,0.44 -1.56,1.23 -0.65,-0.55 0.03,-0.23 -1.38,-1.25 0.22,-0.6 1.08,-2.59 1.06,-3.14 0.38,-0.35 0.52,-0.78 0.43,-1.4 0.22,-0.75 0.67,-4.16 0.53,-5 0.32,0.09 0.75,0.4 1.06,0.57 0.35,0.2 0.71,0.39 1.06,0.57 0.73,0.38 1.61,0.62 2.65,0.61 0.58,-0.21 0.64,-1.82 0.61,-2.32 -0.04,-0.79 -0.45,-1.64 -0.77,-2.19 -0.39,-0.68 -0.64,-1.3 -1.45,-1.52 -1.33,-0.36 -1.16,0.63 -1.55,1.24 -0.67,-0.66 -0.61,-0.87 -1.64,-1.37 -0.06,-2.55 -0.87,-5.97 -0.9,-6.74l0.15 -0.03 0.01 -0.03z"
                      />
                    </g>
                  </svg>
                </div>
              </button>
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
          {/* Miel específica para animación bienvenida */}
          <div className="miel-animacion-bienvenida"></div>
          
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
            <div className="abejacanasta-grande"></div>   {/* Abejacanasta grande en el centro */}
          </div>
        </div>
      )}

      {/* ========================================
          MODAL DE IMAGEN AMPLIADA
          Se muestra cuando el usuario hace clic en una imagen
          ======================================== */}
      {selectedImageModal && (
        <div className="modal-imagen" onClick={handleCloseImageModal}>
          <div className="miel-modal-imagen"></div>
          <div className="modal-imagen-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={handleCloseImageModal}>
              <i className="fas fa-times"></i>
            </button>
            <img src={selectedImageModal} alt="Imagen ampliada" />
          </div>
        </div>
      )}

      {/* Abeja flor en esquina inferior izquierda principal */}
      <div className="abeja-flor-principal"></div>
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

3. ANIMACIONES NATURALES: Implementa componentes animados con temática natural:
   - FlowerSwarm: Flores blancas volando delicadamente por toda la pantalla
   - VineVineHangingButton: Botones que cuelgan de lianas verdes con balanceo natural
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


