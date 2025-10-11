/**
 * ========================================================================================
 * COMPONENTE: HangingButton - Botón Colgante con Temática Natural de Lianas
 * ========================================================================================
 * 
 * Este componente implementa un botón que cuelga de una liana verde con hojas,
 * con animación de caída inicial y balanceo natural. Incluye interactividad
 * para que responda al movimiento del usuario.
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * INTERFAZ: Propiedades del Botón Colgante con Liana
 * =================================================
 */
interface HangingButtonProps {
  children: ReactNode;                                    // Contenido interno del botón
  onClick?: () => void;                                   // Función a ejecutar al hacer clic
  disabled?: boolean;                                     // Estado de deshabilitación
  className?: string;                                     // Clases CSS adicionales
  hangingIntensity?: 'light' | 'medium' | 'strong';     // Intensidad del balanceo
  delay?: number;                                         // Retraso antes de iniciar animación
}

/**
 * COMPONENTE PRINCIPAL: HangingButton con Liana
 * ===========================================
 */
export const HangingButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = "",
  hangingIntensity = 'medium',
  delay = 0 
}: HangingButtonProps) => {
  
  // Estado para controlar si está siendo arrastrado por el usuario (comentado - no usado actualmente)
  // const [isDragging, setIsDragging] = useState(false);
  
  /**
   * CONFIGURACIÓN: Nueva Animación de Liana
   * ======================================
   */
  const swingAmplitudes = {
    light: { rotate: [-2, 2, -2], y: [0, 1, 0] },        
    medium: { rotate: [-4, 4, -4], y: [0, 2, 0] },       
    strong: { rotate: [-6, 6, -6], y: [0, 3, 0] }        
  };

  const amplitude = swingAmplitudes[hangingIntensity];

  // Variantes de animación para el nuevo comportamiento (comentado - no usado actualmente)
  /*
  const variants = {
    // Estado inicial: Fuera de pantalla (arriba)
    initial: {
      y: -150,
      rotate: 0,
      opacity: 0
    },
    
    // Animación de caída: Como si fuera una cuerda cayendo
    falling: {
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94], // Easing natural de caída
        delay: delay
      }
    },
    
    // Balanceo natural después de caer
    swinging: {
      rotate: amplitude.rotate,
      y: amplitude.y,
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
        delay: delay + 1.3 // Después de la caída
      }
    },
    
    // Cuando el usuario interactúa
    interactive: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };
  */  return (
    /**
     * CONTENEDOR PRINCIPAL: Sistema de Balanceo
     * ========================================
     * 
     * Contenedor que maneja toda la lógica de animación de balanceo
     * y proporciona el punto de transformación desde la parte superior
     * para simular el comportamiento físico real de un objeto colgante.
     */
    <motion.div 
      className="hanging-button-container"
      
      /**
       * ESTILOS BASE: Configuración de Layout y Transformación
       * ====================================================
       * 
       * - position: relative para contener elementos posicionados absolutamente
       * - display: inline-block para mantener dimensiones naturales del contenido
       * - transformOrigin: 'top center' crítico para balanceo realista desde arriba
       */
      style={{ 
        position: 'relative',
        display: 'inline-block',
        transformOrigin: 'top center'  // Punto de pivote para balanceo realista
      }}
      
      /**
       * ESTADO INICIAL: Animación de Entrada
       * ==================================
       * 
       * Define el estado inicial del botón antes de aparecer:
       * - Posición elevada (y: -20) para efecto de caída
       * - Opacidad 0 para entrada con fade
       * - Rotación inicial para entrada más dinámica
       */
      initial={{ y: -20, opacity: 0, rotate: -2 }}
      
      /**
       * ANIMACIÓN PRINCIPAL: Balanceo Continuo
       * ====================================
       * 
       * Define el comportamiento de balanceo continuo utilizando
       * los valores de amplitud configurados según la intensidad.
       */
      animate={{ 
        y: amplitude.y,        // Movimiento vertical oscilante
        opacity: 1,            // Opacidad completa tras entrada
        rotate: amplitude.rotate // Rotación de balanceo lateral
      }}
      
      /**
       * CONFIGURACIÓN DE TRANSICIÓN: Timing Natural
       * ==========================================
       * 
       * Configura el timing para crear un balanceo orgánico y realista:
       * - Duración base + variación aleatoria para naturalidad
       * - Repetición infinita con reversión para oscilación continua
       * - Easing suave para movimiento físicamente creíble
       */
      transition={{
        duration: 3 + Math.random(),  // 3-4 segundos con variación aleatoria
        delay: delay,                 // Retraso inicial configurable
        repeat: Infinity,             // Repetición infinita
        repeatType: "reverse",        // Reversión para oscilación natural
        ease: "easeInOut"            // Curva suave para realismo físico
      }}
      
      /**
       * INTERACCIÓN: Efecto Hover Intensificado
       * ======================================
       * 
       * Al pasar el mouse, intensifica la animación de balanceo
       * y añade un efecto de escala para feedback visual.
       */
      whileHover={{
        scale: 1.05,                                    // Ligero aumento de tamaño
        rotate: amplitude.rotate.map(r => r * 2),       // Duplica intensidad de rotación
        y: amplitude.y.map(y => y * 1.5),              // Aumenta movimiento vertical
        transition: { duration: 0.3 }                  // Transición rápida para responsividad
      }}
      
      /**
       * INTERACCIÓN: Efecto de Presión (Tap)
       * ===================================
       * 
       * Al hacer clic, estabiliza temporalmente el botón simulando
       * que el usuario lo está sujetando.
       */
      whileTap={{
        scale: 0.95,  // Reduce tamaño para simular presión
        rotate: 0,    // Elimina rotación (estabilización)
        y: 0          // Centrar verticalmente
      }}
    >
      {/* 
        ELEMENTO VISUAL: Cuerda de Suspensión
        ====================================
        
        Simula la cuerda o cordel del que cuelga el botón.
        Incluye gradiente de colores naturales y animación sutil
        para simular tensión y relajación de la cuerda.
      */}
      <motion.div
        className="honey-rope"
        
        /**
         * ESTILOS: Apariencia de Cuerda Realista
         * =====================================
         * 
         * - Posicionamiento absoluto centrado horizontalmente
         * - Dimensiones delgadas para simular cordel
         * - Gradiente marrón para textura natural de cuerda
         * - Sombra sutil para profundidad visual
         * - Z-index negativo para estar detrás del botón
         */
        style={{
          position: 'absolute',
          top: '-40px',                                            // Posición encima del botón
          left: '50%',                                             // Centrado horizontalmente
          transform: 'translateX(-50%)',                           // Ajuste fino de centrado
          width: '3px',                                            // Grosor de cordel
          height: '40px',                                          // Longitud de la cuerda
          background: 'linear-gradient(to bottom, #D2691E, #8B4513)', // Gradiente marrón natural
          borderRadius: '2px',                                     // Bordes redondeados sutiles
          boxShadow: '1px 0 2px rgba(0,0,0,0.2)',                // Sombra lateral para profundidad
          zIndex: -1                                               // Detrás del contenido principal
        }}
        
        /**
         * ANIMACIÓN: Simulación de Tensión de Cuerda
         * =========================================
         * 
         * Escala vertical sutil para simular la tensión y relajación
         * natural de una cuerda bajo el peso del objeto colgante.
         */
        animate={{
          scaleY: [1, 1.1, 1],  // Estiramiento sutil de la cuerda
        }}
        transition={{
          duration: 3,          // Sincronizada con balanceo principal
          repeat: Infinity,     // Repetición continua
          ease: "easeInOut"     // Transición suave
        }}
      />

      {/* 
        ELEMENTO VISUAL: Punto de Anclaje
        ===============================
        
        Representa el punto fijo del cual cuelga la cuerda.
        Simula un clavo, gancho o punto de sujeción en la superficie superior.
      */}
      <motion.div
        className="anchor-point"
        
        /**
         * ESTILOS: Punto de Anclaje Realista
         * =================================
         * 
         * - Forma circular para simular cabeza de clavo o gancho
         * - Color marrón oscuro para material metálico/madera
         * - Posicionamiento en la parte superior de la cuerda
         * - Sombra pronunciada para efecto de profundidad
         */
        style={{
          position: 'absolute',
          top: '-45px',                      // Encima de la cuerda
          left: '50%',                       // Centrado horizontalmente
          transform: 'translateX(-50%)',     // Ajuste fino de centrado
          width: '8px',                      // Tamaño compacto
          height: '8px',                     // Forma cuadrada base
          backgroundColor: '#654321',        // Marrón oscuro metálico
          borderRadius: '50%',               // Convertir a círculo
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)', // Sombra para profundidad
          zIndex: -1                         // Detrás del contenido principal
        }}
      />

      {/* 
        ELEMENTO PRINCIPAL: Botón Interactivo con Temática de Miel
        ========================================================
        
        El botón principal con diseño de panal de miel dorado,
        efectos visuales avanzados y interactividad completa.
      */}
      <motion.button
        className={`hanging-button ${className}`}
        onClick={onClick}
        disabled={disabled}
        
        /**
         * ESTILOS: Diseño de Panal de Miel Premium
         * =======================================
         * 
         * Combina múltiples técnicas de CSS para crear una apariencia
         * de miel dorada con profundidad y textura realistas.
         */
        style={{
          // GRADIENTE BASE: Colores dorados de miel natural
          background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
          
          // LAYOUT Y FORMA
          border: 'none',                    // Sin borde para diseño limpio
          borderRadius: '20px',              // Esquinas redondeadas suaves
          padding: '15px 25px',              // Espaciado cómodo para contenido
          
          // TIPOGRAFÍA
          color: '#8B4513',                  // Texto marrón cálido
          fontWeight: 'bold',                // Peso fuerte para legibilidad
          fontSize: '1rem',                  // Tamaño base responsivo
          fontFamily: 'Quicksand, sans-serif', // Fuente amigable y redondeada
          
          // INTERACTIVIDAD
          cursor: disabled ? 'not-allowed' : 'pointer', // Cursor contextual
          
          // EFECTOS DE PROFUNDIDAD: Sistema de sombras múltiples
          boxShadow: `
            0 4px 15px rgba(255, 215, 0, 0.4),      /* Sombra exterior dorada */
            inset 0 2px 4px rgba(255, 255, 255, 0.3), /* Highlight superior interior */
            inset 0 -2px 4px rgba(0, 0, 0, 0.1)     /* Sombra inferior interior */
          `,
          
          // CONFIGURACIÓN PARA ELEMENTOS HIJOS
          position: 'relative',              // Para positioning de elementos internos
          overflow: 'hidden',                // Contiene patrones internos
          
          // ESTADO VISUAL CONDICIONAL
          opacity: disabled ? 0.6 : 1        // Opacidad reducida cuando deshabilitado
        }}
        
        /**
         * INTERACCIÓN: Efectos Hover Avanzados
         * ===================================
         * 
         * Intensifica los efectos visuales cuando el usuario pasa el mouse,
         * creando feedback visual inmediato y atractivo.
         */
        whileHover={{
          // INTENSIFICACIÓN DE SOMBRAS
          boxShadow: `
            0 6px 20px rgba(255, 215, 0, 0.6),      /* Sombra exterior más intensa */
            inset 0 2px 4px rgba(255, 255, 255, 0.4), /* Highlight más brillante */
            inset 0 -2px 4px rgba(0, 0, 0, 0.15)    /* Sombra interior más profunda */
          `,
          
          // EFECTO DE BRILLO
          filter: 'brightness(1.1)'           // Aumento sutil del brillo general
        }}
      >
        {/* 
          PATRÓN DECORATIVO: Textura Hexagonal de Panal
          ============================================
          
          Añade una textura sutil que evoca la estructura hexagonal
          natural de los panales de miel para reforzar la temática.
        */}
        <div 
          className="hexagon-pattern"
          
          /**
           * ESTILOS: Patrón Hexagonal CSS Avanzado
           * =====================================
           * 
           * Utiliza CSS conic-gradient para crear un patrón hexagonal
           * que simula la estructura natural de los panales de abejas.
           */
          style={{
            position: 'absolute',    // Posicionamiento sobre el botón
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,               // Cubre toda la superficie del botón
            
            // PATRÓN HEXAGONAL: Gradiente cónico repetitivo
            backgroundImage: `
              repeating-conic-gradient(
                from 0deg at 50% 50%,                    /* Origen central */
                transparent 0deg,                        /* Inicio transparente */
                rgba(255, 255, 255, 0.1) 60deg,        /* Blanco sutil a 60° */
                transparent 120deg                       /* Vuelta a transparente a 120° */
              )
            `,
            backgroundSize: '20px 20px',  // Tamaño de repetición del patrón
            opacity: 0.3,                 // Transparencia para efecto sutil
            pointerEvents: 'none'         // No interfiere con clics del botón
          }}
        />
        
        {/* 
          CONTENIDO: Texto/Elementos del Botón
          ===================================
          
          Wrapper para el contenido del botón con z-index elevado
          para asegurar que aparezca sobre el patrón de fondo.
        */}
        <span style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </span>
      </motion.button>
    </motion.div>
  );
};

/**
 * ========================================================================================
 * RESUMEN DEL ARCHIVO: HangingButton.tsx  
 * ========================================================================================
 * 
 * PROPÓSITO PRINCIPAL:
 * Este archivo implementa un componente de botón interactivo avanzado con animación
 * de balanceo que simula estar colgando de una cuerda. Combina física realista con
 * diseño temático de panal de miel para crear una experiencia visual única.
 * 
 * ARQUITECTURA DEL COMPONENTE:
 * - Contenedor principal con sistema de balanceo basado en transformOrigin
 * - Elementos visuales decorativos: cuerda de suspensión y punto de anclaje
 * - Botón principal con diseño de panal de miel y efectos visuales avanzados
 * - Patrón hexagonal superpuesto para textura temática sutil
 * 
 * SISTEMA DE ANIMACIONES:
 * - Balanceo continuo con tres niveles de intensidad (light, medium, strong)
 * - Animación de entrada con efecto de caída y fade-in
 * - Efectos interactivos: hover intensifica balanceo, tap estabiliza movimiento
 * - Animación sutil de tensión en la cuerda sincronizada con balanceo
 * - Transiciones suaves con easing natural para realismo físico
 * 
 * DISEÑO VISUAL TEMÁTICO:
 * - Gradientes dorados múltiples para simular miel natural
 * - Sistema de sombras tricapa: exterior, highlight interior, sombra interior  
 * - Patrón hexagonal con gradiente cónico para textura de panal
 * - Cuerda realista con gradiente marrón y efectos de profundidad
 * - Punto de anclaje circular simulando hardware de sujeción
 * 
 * CARACTERÍSTICAS DE INTERACTIVIDAD:
 * - Estados hover con intensificación de efectos visuales
 * - Estados tap con estabilización temporal del balanceo
 * - Soporte completo para estado disabled con feedback visual
 * - Cursor contextual según estado de habilitación
 * - Manejo de eventos onClick con propagación adecuada
 * 
 * CONFIGURABILIDAD:
 * - Tres niveles de intensidad de balanceo con valores predefinidos
 * - Delay configurable para secuenciar múltiples botones
 * - Soporte para clases CSS adicionales para personalización
 * - Props estándar de botón (disabled, onClick, children)
 * 
 * OPTIMIZACIÓN TÉCNICA:
 * - Transform-origin optimizado para balanceo desde punto superior
 * - Z-index cuidadosamente gestionado para layering correcto
 * - Overflow hidden para contener patrones internos
 * - Pointer-events: none en elementos decorativos para no interferir
 * - Transiciones con duración + variación aleatoria para naturalidad
 * 
 * CASOS DE USO:
 * - Botones principales en interfaces temáticas (baby shower, miel, naturaleza)
 * - CTAs (Call-to-Action) que requieren atención visual especial
 * - Elementos interactivos en aplicaciones con diseño orgánico/natural
 * - Botones de acción en experiencias gamificadas o lúdicas
 * - Componentes decorativos que mantienen funcionalidad completa
 * 
 * DEPENDENCIAS:
 * - Framer Motion para animaciones fluidas y gestos avanzados
 * - React para componente funcional y tipado TypeScript
 * - CSS gradients y transforms para efectos visuales avanzados
 * ========================================================================================
 */