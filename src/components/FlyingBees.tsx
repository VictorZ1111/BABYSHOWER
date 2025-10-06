/**
 * ========================================================================================
 * COMPONENTE: FlyingBees - Sistema de Animación de Abejas Voladoras
 * ========================================================================================
 * 
 * Este archivo implementa un sistema completo de animaciones de abejas volando
 * utilizando Framer Motion para crear efectos visuales dinámicos y orgánicos
 * que complementan la temática del baby shower.
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * INTERFAZ: Propiedades del Componente de Abeja Individual
 * =======================================================
 * 
 * Define las propiedades configurables para cada abeja voladora individual.
 * Permite personalizar timing, duración y estilos CSS adicionales.
 */
interface BeeProps {
  delay?: number;      // Retraso antes de iniciar la animación (segundos)
  duration?: number;   // Duración total del ciclo de vuelo (segundos)
  className?: string;  // Clases CSS adicionales para personalización
}

/**
 * COMPONENTE PRINCIPAL: FlyingBee - Abeja Individual Voladora
 * ==========================================================
 * 
 * Renderiza una abeja individual con animación de vuelo orgánica que se adapta
 * dinámicamente al tamaño de la ventana del navegador.
 * 
 * Características técnicas:
 * - Trayectorias de vuelo curvilíneas y naturales
 * - Adaptación responsive al redimensionamiento de ventana  
 * - Rotación y escalado para simular movimiento 3D
 * - Timing personalizable y animaciones infinitas con delays aleatorios
 * 
 * @param delay - Retraso inicial antes de comenzar animación
 * @param duration - Duración completa del ciclo de vuelo
 * @param className - Clases CSS adicionales para personalización
 */
export const FlyingBee = ({ delay = 0, duration = 8, className = "" }: BeeProps) => {
  /**
   * ESTADO: Dimensiones Dinámicas de Ventana
   * =======================================
   * 
   * Mantiene las dimensiones actuales de la ventana para calcular
   * trayectorias de vuelo que se adapten al viewport disponible.
   */
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  /**
   * EFECTO: Manejo de Redimensionamiento Responsive
   * ==============================================
   * 
   * Escucha cambios en el tamaño de ventana y actualiza el estado
   * para recalcular las trayectorias de vuelo dinámicamente.
   * Incluye cleanup para evitar memory leaks.
   */
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Registra listener para cambios de tamaño
    window.addEventListener('resize', handleResize);
    
    // Cleanup: remueve listener al desmontar componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * FUNCIÓN: Generador de Trayectorias de Vuelo Aleatorias
   * =====================================================
   * 
   * Crea rutas de vuelo orgánicas y naturales que varían entre diferentes patrones.
   * Utiliza las dimensiones actuales de ventana para calcular coordenadas relativas
   * que garantizan que las abejas vuelen dentro del viewport visible.
   * 
   * Patrones de vuelo disponibles:
   * 1. Curvilíneo: Ondulación suave de izquierda a derecha
   * 2. Diagonal: Movimiento ondulado con cambios de elevación 
   * 3. Superior: Vuelo en zona alta de la pantalla
   * 
   * Cada patrón utiliza 5 puntos de control para crear curvas Bezier suaves
   * que simulan el vuelo errático natural de las abejas.
   * 
   * @returns Objeto con arrays de coordenadas X e Y para animación
   */
  const generateFlightPath = () => {
    const paths = [
      // PATRÓN 1: Path curvilíneo de izquierda a derecha
      // Crea una ondulación suave en la zona media-alta de la pantalla
      {
        x: [-50, windowSize.width / 4, windowSize.width / 2, windowSize.width * 0.75, windowSize.width + 50],
        y: [windowSize.height * 0.3, windowSize.height * 0.2, windowSize.height * 0.4, windowSize.height * 0.25, windowSize.height * 0.35]
      },
      
      // PATRÓN 2: Path diagonal ondulado  
      // Movimiento con más variación vertical, simula vuelo más errático
      {
        x: [-50, windowSize.width / 3, windowSize.width / 2, windowSize.width * 0.8, windowSize.width + 50],
        y: [windowSize.height * 0.6, windowSize.height * 0.3, windowSize.height * 0.5, windowSize.height * 0.2, windowSize.height * 0.4]
      },
      
      // PATRÓN 3: Path superior
      // Vuelo en zona alta con variaciones menores, más directo
      {
        x: [-50, windowSize.width / 5, windowSize.width / 2, windowSize.width * 0.7, windowSize.width + 50],
        y: [windowSize.height * 0.15, windowSize.height * 0.1, windowSize.height * 0.2, windowSize.height * 0.15, windowSize.height * 0.1]
      }
    ];
    
    // Selección aleatoria de uno de los patrones disponibles
    return paths[Math.floor(Math.random() * paths.length)];
  };

  // Genera la trayectoria específica para esta instancia de abeja
  const flightPath = generateFlightPath();

  return (
    /**
     * RENDERIZADO: Elemento Animado de Abeja
     * =====================================
     * 
     * Utiliza motion.div de Framer Motion para crear animaciones fluidas
     * con múltiples propiedades animadas simultáneamente (posición, rotación, escala).
     */
    <motion.div
      className={`flying-bee ${className}`}
      
      /**
       * ESTADO INICIAL: Configuración de Punto de Partida
       * ================================================
       * 
       * Define la posición inicial y propiedades de transformación
       * desde donde comenzará la animación de vuelo.
       */
      initial={{ 
        x: flightPath.x[0],   // Posición X inicial (fuera del borde izquierdo)
        y: flightPath.y[0],   // Posición Y inicial (según patrón seleccionado)
        rotate: 0,            // Sin rotación inicial
        scale: 0.8            // Escala ligeramente reducida para entrada suave
      }}
      
      /**
       * ANIMACIÓN: Secuencia de Movimientos
       * ==================================
       * 
       * Define los valores objetivo para cada propiedad animada.
       * Framer Motion interpola suavemente entre estos valores.
       */
      animate={{
        x: flightPath.x,                          // Secuencia de posiciones X
        y: flightPath.y,                          // Secuencia de posiciones Y  
        rotate: [0, 5, -5, 5, 0, -3, 3, 0],      // Rotación orgánica para simular aleteo
        scale: [0.8, 1, 0.9, 1, 0.8]             // Cambios de escala para profundidad
      }}
      
      /**
       * CONFIGURACIÓN DE TRANSICIÓN: Timing y Easing
       * ===========================================
       * 
       * Controla cómo se ejecutan las animaciones, incluyendo duración,
       * repetición y curvas de easing para movimiento natural.
       */
      transition={{
        duration: duration,                        // Duración total del ciclo (prop)
        delay: delay,                             // Retraso inicial (prop)
        repeat: Infinity,                         // Repetición infinita
        repeatDelay: Math.random() * 3 + 2,       // Pausa aleatoria entre ciclos (2-5 seg)
        ease: "easeInOut",                        // Curva de easing suave
        times: [0, 0.2, 0.4, 0.6, 0.8, 0.85, 0.9, 1]  // Control de timing para rotación
      }}
      
      /**
       * ESTILOS: Presentación Visual
       * ===========================
       * 
       * Configura la apariencia visual del elemento y su comportamiento
       * en el layout de la página.
       */
      style={{
        position: 'fixed',                        // Posición fija para overlay
        zIndex: 1,                               // Z-index bajo para estar detrás del contenido
        fontSize: '24px',                        // Tamaño del emoji de abeja
        color: '#FFD700',                        // Color dorado para consistencia temática
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',  // Sombra sutil para profundidad
        pointerEvents: 'none'                    // No interfiere con interacciones del usuario
      }}
    >
      🐝 {/* Emoji de abeja como contenido visual */}
    </motion.div>
  );
};

/**
 * INTERFAZ: Propiedades del Enjambre de Abejas
 * ===========================================
 * 
 * Define las configuraciones para el componente que maneja
 * múltiples abejas volando simultáneamente.
 */
interface BeeSwarmProps {
  count?: number;      // Número de abejas a renderizar (default: 3)
  isActive?: boolean;  // Control de activación/desactivación (default: true)
}

/**
 * COMPONENTE: BeeSwarm - Controlador de Enjambre de Abejas
 * ========================================================
 * 
 * Componente de nivel superior que maneja múltiples instancias de FlyingBee
 * para crear un efecto de enjambre orgánico y natural.
 * 
 * Características principales:
 * - Genera múltiples abejas con timing randomizado
 * - Cada abeja tiene duración y delay únicos para variedad natural
 * - Control de activación/desactivación para optimización de rendimiento
 * - Asignación de clases CSS únicas para personalización individual
 * 
 * @param count - Número total de abejas en el enjambre
 * @param isActive - Flag para activar/desactivar todo el sistema de animación
 */
export const BeeSwarm = ({ count = 3, isActive = true }: BeeSwarmProps) => {
  /**
   * VALIDACIÓN: Control de Renderizado Condicional
   * =============================================
   * 
   * Permite desactivar completamente las animaciones cuando isActive es false,
   * útil para optimización de rendimiento o preferencias del usuario.
   */
  if (!isActive) return null;

  return (
    /**
     * RENDERIZADO: Generación Dinámica de Enjambre
     * ===========================================
     * 
     * Crea un array dinámico de componentes FlyingBee basado en el count especificado.
     * Cada abeja recibe configuraciones únicas para crear variedad natural.
     */
    <>
      {Array.from({ length: count }).map((_, index) => (
        <FlyingBee
          key={index}
          
          /**
           * TIMING ALEATORIO: Delay Escalonado con Variación
           * ==============================================
           * 
           * Combina delay base escalonado (index * 2) con variación aleatoria
           * para evitar que todas las abejas inicien sincronizadamente.
           * Resultado: inicio natural y orgánico del enjambre.
           */
          delay={index * 2 + Math.random() * 2}
          
          /**
           * DURACIÓN VARIABLE: Velocidad Natural Diversa  
           * ==========================================
           * 
           * Asigna duraciones entre 6-10 segundos aleatoriamente
           * para simular diferentes velocidades de vuelo entre abejas.
           */
          duration={6 + Math.random() * 4}
          
          /**
           * IDENTIFICACIÓN: Clase CSS Única por Abeja
           * ========================================
           * 
           * Permite targeting CSS específico para cada abeja individual
           * si se requiere personalización adicional.
           */
          className={`bee-${index}`}
        />
      ))}
    </>
  );
};

/**
 * ========================================================================================
 * RESUMEN DEL ARCHIVO: FlyingBees.tsx
 * ========================================================================================
 * 
 * PROPÓSITO PRINCIPAL:
 * Este archivo implementa un sistema completo de animación de abejas voladoras que
 * crea efectos visuales orgánicos y dinámicos para complementar la temática de baby
 * shower. Utiliza Framer Motion para animaciones fluidas y naturales.
 * 
 * ARQUITECTURA DE COMPONENTES:
 * - FlyingBee: Componente individual que renderiza una abeja con animación compleja
 * - BeeSwarm: Componente controlador que maneja múltiples abejas simultáneamente
 * - Sistema responsive que se adapta automáticamente al tamaño de ventana
 * 
 * CARACTERÍSTICAS TÉCNICAS DESTACADAS:
 * - Trayectorias de vuelo algorítmicamente generadas con 3 patrones diferentes
 * - Animaciones multidimensionales: posición XY, rotación y escala simultáneas
 * - Timing randomizado para crear movimientos naturales y orgánicos
 * - Sistema responsive con recalculo dinámico de rutas según viewport
 * - Optimización de rendimiento con controles de activación/desactivación
 * 
 * IMPLEMENTACIÓN DE ANIMACIONES:
 * - Utiliza 5 puntos de control por trayectoria para curvas Bezier suaves
 * - Rotación orgánica sincronizada con movimiento para simular aleteo
 * - Escalado dinámico para crear sensación de profundidad 3D
 * - Delays aleatorios entre ciclos para evitar sincronización artificial
 * - Easing "easeInOut" para movimientos suaves y naturales
 * 
 * PATRONES DE VUELO:
 * 1. Curvilíneo: Ondulación suave en zona media-alta de pantalla
 * 2. Diagonal: Movimiento errático con mayor variación vertical
 * 3. Superior: Vuelo directo en zona alta con variaciones menores
 * 
 * RESPONSIVE DESIGN:
 * - Listener de resize para adaptación dinámica a cambios de ventana
 * - Coordenadas calculadas como porcentajes del viewport
 * - Cleanup automático de event listeners para prevenir memory leaks
 * 
 * CASOS DE USO:
 * - Efectos ambientales de fondo para aplicaciones temáticas
 * - Elementos decorativos que no interfieren con la interacción del usuario
 * - Animaciones de loading o estados de espera con elementos orgánicos
 * - Complemento visual para interfaces de baby shower o eventos similares
 * 
 * OPTIMIZACIÓN:
 * - Posicionamiento fixed con z-index bajo para no interferir con contenido
 * - pointerEvents: 'none' para mantener interactividad del contenido principal
 * - Control granular de activación para optimizar rendimiento cuando es necesario
 * ========================================================================================
 */