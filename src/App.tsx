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
// Las imágenes se cargan desde CSS
// Otras imágenes se cargan desde CSS:
// background1.png, mielesquina1.png, panal2.png, abejaflor.png
// Estilos CSS del componente
import './App.css'

// ========================================
// COMPONENTE PRINCIPAL - APP
// ========================================
function App() {
  // ...existing code...
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
  // Estado para el modal de confirmación de publicación
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  // Estado para el comentario personalizado del usuario
  const [userComment, setUserComment] = useState('')
  
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

  // Maneja el botón "Publicar fotos" - abre modal de confirmación (OPTIMIZADO)
  const handlePublish = useCallback(() => {
    setShowConfirmModal(true)  // Muestra el modal de confirmación
  }, [])

  // Confirma la publicación después del modal (NUEVA FUNCIÓN)
  const handleConfirmPublish = useCallback(async () => {
    setShowConfirmModal(false)  // Cierra el modal de confirmación
    try {
      // Llama a la función de publicación pasando el comentario personalizado
      const result = await publishToInstagram(userComment)
      
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
  }, [publishToInstagram, clearAllImages, userComment])

  // Maneja el botón "Seguir eligiendo" del modal de confirmación (NUEVA FUNCIÓN)
  const handleCancelPublish = useCallback(() => {
    setShowConfirmModal(false)  // Solo cierra el modal sin publicar
  }, [])

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
        <FlowerSwarm count={7} />
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
                    >
                      <i className="fas fa-share" style={{ marginRight: '5px' }}></i>
                      Publicar fotos
                    </VineHangingButton>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================
                SECCIÓN DE CARGA - ANIMACIÓN HONEYCOMB SIMPLIFICADA
                Se muestra solo cuando está subiendo (showLoading = true)
                ======================================== */}
            <div className="seccion-carga" style={{display: showLoading || showBeeSuccess ? 'block' : 'none'}}>
              {/* SOLO mielesquina1 en esquina superior izquierda */}
              <div className="miel-esquina-superior"></div>
              
              {/* Nuevo diseño simple con animación honeycomb */}
              <div className="carga-honeycomb-container">
                {/* Miel específica para modal LISTO */}
                <div className="miel-modal-listo"></div>
                {/* Panal2 en esquina inferior derecha - RECUADRO 5 MODAL LISTO */}
                <div className="panal-modal-listo"></div>
                
                {showBeeSuccess ? (
                  // Estado final: Abeja con canasta
                  <>
                    <div className="abeja-saludando">
                      <div className="abejacanasta-carga"></div>
                    </div>
                    <div className="mensaje-carga">¡AITANA!</div>
                  </>
                ) : (
                  // Estado de carga: Abeja con canasta animada
                  <>
                    <div className="abeja-saludando">
                      <div className="abejacanasta-carga-animada"></div>
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
              
              ¡Visita nuestro perfil!
            </a>
            {/* Elemento necesario para la decoración de esquina inferior derecha */}
            <div className="corner-decoration-instagram"></div>
          </div>
          {/* Texto de agradecimiento con iconos de corazón */}
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
                  <div className="abeja-camara"></div>
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
                  <div className="honey-compartir"></div>
                  <span>Visita nuestro perfil para observar tus fotos</span>
                  <i className="fas fa-heart"></i>
                </div>
              </div>
              {/* Botón principal con nuevo diseño SVG animado */}
              <button className="new-animated-btn btn-separated" onClick={handleCelebrate}>
                ¡A FESTEJAR!
                {/* Elemento necesario para la decoración de esquina inferior derecha */}
                <div className="corner-decoration"></div>
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

      {/* ========================================
          MODAL DE CONFIRMACIÓN DE PUBLICACIÓN
          Se muestra cuando el usuario quiere publicar fotos
          ======================================== */}
      {showConfirmModal && (
        <div className="modal-bienvenida">
          <div className="contenido-modal-confirmacion">
            {/* Miel específica para modal confirmación */}
            <div className="miel-modal-confirmacion"></div>
            {/* Panal en esquina inferior derecha */}
            <div className="panal-modal-confirmacion"></div>
            
            {/* Encabezado del modal */}
            <div className="encabezado-modal-confirmacion">
            </div>
            
            {/* Cuerpo del modal con información */}
            <div className="cuerpo-modal-confirmacion">
              <p>¿Estás seguro de publicar las siguientes imágenes?</p>
              <p>Después de publicarlas podrás observarlas en nuestro perfil de Instagram.</p>
              
              {/* Vista previa pequeña de las imágenes */}
              <div className="preview-imagenes-confirmacion">
                {selectedImages.slice(0, 3).map((image) => (
                  <img key={image.id} src={image.url} alt="Vista previa" className="imagen-preview-confirmacion" />
                ))}
                {selectedImages.length > 3 && (
                  <div className="mas-imagenes">+{selectedImages.length - 3}</div>
                )}
              </div>
              
              {/* Campo de comentario personalizado */}
              <div className="comentario-usuario">
                <label htmlFor="comentario" className="label-comentario">
                  <i className="fas fa-comment" style={{ marginRight: '8px' }}></i>
                  Agrega un mensaje personalizado:
                </label>
                <textarea
                  id="comentario"
                  className="input-comentario"
                  placeholder="Escribe aquí tu mensaje para acompañar las fotos... (ej: ¡Qué lindo momento! 💕)"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  maxLength={200}
                  rows={3}
                />
                <div className="contador-caracteres">
                  {userComment.length}/200 caracteres
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="acciones-modal-confirmacion">
                <VineHangingButton
                  onClick={handleConfirmPublish}
                  delay={0}
                >
                  <i className="fas fa-share" style={{ marginRight: '5px' }}></i>
                  Publicar
                </VineHangingButton>
                
                <VineHangingButton
                  onClick={handleCancelPublish}
                  delay={0.2}
                >
                  <i className="fas fa-edit" style={{ marginRight: '5px' }}></i>
                  Seguir eligiendo
                </VineHangingButton>
              </div>
            </div>
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


