/**
 * ========================================================================================
 * COMPONENTE: FlowerButton - Botón con Temática de Flores Solo para Recuadros
 * ========================================================================================
 * 
 * Este componente implementa botones decorados con flores para los recuadros de acciones
 * manteniendo un diseño delicado y elegante específicamente para las opciones de subir fotos.
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * INTERFAZ: Propiedades del Botón con Flores
 * ==========================================
 */
interface FlowerButtonProps {
  children: ReactNode;                                    
  onClick?: () => void;                                   
  disabled?: boolean;                                     
  className?: string;                                     
  delay?: number;                                         
}

/**
 * COMPONENTE PRINCIPAL: FlowerButton
 * =================================
 */
export const FlowerButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = "",
  delay = 0 
}: FlowerButtonProps) => {

  return (
    <motion.button
      className={`flower-button ${className}`}
      
      initial={{ 
        y: -20,
        opacity: 0,
        scale: 0.8
      }}
      
      animate={{
        y: 0,
        opacity: 1,
        scale: 1
      }}
      
      transition={{
        duration: 0.6,
        delay: delay,
        ease: "easeOut"
      }}
      
      // Interactividad suave
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      
      whileTap={{
        scale: 0.95
      }}
      
      onClick={onClick}
      disabled={disabled}
      
      style={{
        // Diseño base del botón
        background: `linear-gradient(145deg, 
          #ffffff 0%,
          #f8f9fa 30%, 
          #e9ecef 70%,
          #dee2e6 100%)`,
        
        border: '2px solid #f1c0e8',
        borderRadius: '20px',
        padding: '12px 20px',
        color: '#495057',
        fontWeight: '600',
        fontSize: '14px',
        fontFamily: 'Quicksand, sans-serif',
        cursor: disabled ? 'not-allowed' : 'pointer',
        
        // Efectos visuales
        boxShadow: `
          0 4px 12px rgba(241, 192, 232, 0.3),
          inset 0 1px 2px rgba(255,255,255,0.8)`,
        
        // Estado disabled
        opacity: disabled ? 0.6 : 1,
        
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        
        // Optimización de performance
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      
      {/* Decoración floral sutil */}
      <div
        style={{
          position: 'absolute',
          top: '3px',
          right: '3px',
          width: '12px',
          height: '12px',
          opacity: 0.6
        }}
      >
        <svg width="12" height="12" viewBox="0 0 20 20">
          <g>
            {/* Flor pequeña decorativa */}
            <circle cx="10" cy="6" r="2" fill="#f1c0e8" opacity="0.8"/>
            <circle cx="14" cy="10" r="2" fill="#f1c0e8" opacity="0.8"/>
            <circle cx="10" cy="14" r="2" fill="#f1c0e8" opacity="0.8"/>
            <circle cx="6" cy="10" r="2" fill="#f1c0e8" opacity="0.8"/>
            <circle cx="10" cy="10" r="1.5" fill="#ffd700"/>
          </g>
        </svg>
      </div>
      
      {children}
    </motion.button>
  );
};