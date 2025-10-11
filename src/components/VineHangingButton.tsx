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
import './VineHangingButton.css';

/**
 * INTERFAZ: Propiedades del Botón Colgante con Liana
 * =================================================
 */
interface HangingButtonProps {
  children: ReactNode;                                    
  onClick?: () => void;                                   
  disabled?: boolean;                                     
  className?: string;                                     
  hangingIntensity?: 'light' | 'medium' | 'strong';     
  delay?: number;                                         
}

/**
 * COMPONENTE PRINCIPAL: HangingButton con Liana
 * ===========================================
 */
export const VineHangingButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = "",
  hangingIntensity = 'medium',
  delay = 0 
}: HangingButtonProps) => {
  
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

  // Verificar si tiene la clase bounce-top para desactivar animaciones propias
  const hasCustomAnimation = className.includes('bounce-top');

  // Variantes de animación para el comportamiento de liana (solo si no tiene animación custom)
  const containerVariants = hasCustomAnimation ? {
    // Sin animaciones si tiene bounce-top
    initial: { y: 0, rotate: 0, opacity: 1 },
    dropped: { y: 0, rotate: 0, opacity: 1 },
    swinging: { y: 0, rotate: 0, opacity: 1 }
  } : {
    // Estado inicial: Arriba, fuera de vista
    initial: {
      y: -200,
      rotate: 0,
      opacity: 0
    },
    
    // Caída: Como una cuerda/liana cayendo
    dropped: {
      y: 0,
      opacity: 1,
      rotate: [0, -2, 1, 0], // Pequeño balanceo al caer
      transition: {
        duration: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94], // Curva natural de caída
        delay: delay,
        times: [0, 0.3, 0.7, 1]
      }
    },
    
    // Balanceo continuo después de caer
    swinging: {
      rotate: amplitude.rotate,
      y: amplitude.y,
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
        delay: delay + 1.8 // Después de la caída
      }
    }
  };

  return (
    <div className="vine-hanging-container" style={{ position: 'relative', display: 'inline-block' }}>
      
      {/* ========================================
          LIANA VISUAL - Cuerda Verde con Hojas
          ======================================== */}
      <motion.div
        className="vine-rope"
        initial={{ height: hasCustomAnimation ? 60 : 0, opacity: hasCustomAnimation ? 1 : 0 }}
        animate={{ 
          height: 60, 
          opacity: 1,
          transition: hasCustomAnimation ? { duration: 0 } : { duration: 1.2, delay: delay }
        }}
        style={{
          position: 'absolute',
          top: -60,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '8px',
          background: `linear-gradient(180deg, 
            #2d5016 0%, 
            #4a7c2a 30%, 
            #5a8f2f 70%, 
            #6ba534 100%)`,
          borderRadius: '4px',
          zIndex: 1,
          boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.3), inset -1px 0 2px rgba(255,255,255,0.2)'
        }}
      >
        {/* Hojas en la liana */}
        <div 
          style={{
            position: 'absolute',
            top: '15px',
            left: '-8px',
            width: '12px',
            height: '8px',
            background: '#5a8f2f',
            borderRadius: '50% 10px 50% 10px',
            transform: 'rotate(-25deg)',
            boxShadow: '1px 1px 2px rgba(0,0,0,0.2)'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: '35px',
            right: '-8px',
            width: '10px',
            height: '7px',
            background: '#4a7c2a',
            borderRadius: '50% 10px 50% 10px',
            transform: 'rotate(25deg)',
            boxShadow: '1px 1px 2px rgba(0,0,0,0.2)'
          }}
        />
      </motion.div>

      {/* ========================================
          BOTÓN COLGANTE - Nuevo Diseño Natural
          ======================================== */}
      <motion.button
        className={`vine-hanging-button ${className}`}
        variants={containerVariants}
        initial="initial"
        animate={["dropped", "swinging"]}
        
        // Interactividad mejorada
        whileHover={{
          scale: 1.05,
          rotate: amplitude.rotate.map(r => r * 1.5),
          transition: { duration: 0.3 }
        }}
        
        whileTap={{
          scale: 0.95,
          rotate: 0,
          y: 2
        }}
        
        // Drag para interacción móvil/desktop
        drag="x"
        dragConstraints={{ left: -30, right: 30 }}
        dragElastic={0.7}
        
        onClick={onClick}
        disabled={disabled}
        
        style={{
          // Nuevo diseño natural (no más madera)
          background: `linear-gradient(145deg, 
            #f0c674 0%,
            #e6b65c 25%, 
            #d4a048 50%,
            #c19238 75%,
            #b8872f 100%)`,
          
          border: '3px solid transparent',
          borderImage: `linear-gradient(45deg, 
            #8b6914, 
            #a67c14, 
            #8b6914) 1`,
          
          borderRadius: '25px',
          padding: '12px 24px',
          color: '#2d1810',
          fontWeight: '600',
          fontSize: '16px',
          fontFamily: 'Quicksand, sans-serif',
          cursor: disabled ? 'not-allowed' : 'pointer',
          
          // Efectos de profundidad y naturalidad
          boxShadow: `
            0 8px 16px rgba(0,0,0,0.15),
            inset 0 2px 4px rgba(255,255,255,0.3),
            inset 0 -2px 4px rgba(0,0,0,0.1)`,
          
          // Hardware acceleration
          transform: 'translateZ(0)',
          transformOrigin: 'center top',
          
          // Estado disabled
          opacity: disabled ? 0.6 : 1,
          
          // Textura sutil
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '15px 15px, 10px 10px',
          
          position: 'relative',
          zIndex: 2
        }}
      >
        
        {/* Indicador de conexión con la liana */}
        <div
          style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '12px',
            height: '12px',
            background: '#8b6914',
            borderRadius: '50%',
            border: '2px solid #2d1810',
            boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3)'
          }}
        />
        
        {children}
      </motion.button>
    </div>
  );
};