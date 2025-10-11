/**
 * ========================================================================================
 * COMPONENTE: FlyingFlowers - Sistema de Animación de Flores Voladoras
 * ========================================================================================
 * 
 * Este archivo implementa un sistema completo de animaciones de flores volando
 * utilizando Framer Motion para crear efectos visuales suaves y delicados
 * que complementan la temática del baby shower.
 */

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * INTERFAZ: Propiedades del Componente de Flor Individual
 * ======================================================
 * 
 * Define las propiedades configurables para cada flor voladora individual.
 */
interface FlowerProps {
  delay?: number;      // Retraso antes de iniciar la animación (segundos)
  duration?: number;   // Duración total del ciclo de vuelo (segundos)
  className?: string;  // Clases CSS adicionales para personalización
  size?: 'small' | 'medium' | 'large'; // Tamaño de la flor
  zIndex?: number;     // Z-index para controlar si aparece delante o detrás
}

/**
 * COMPONENTE PRINCIPAL: FlyingFlower - Flor Individual Voladora
 * ============================================================
 * 
 * Renderiza una flor individual con animación de vuelo suave que flota
 * delicadamente por toda la pantalla sin interferir con el contenido.
 */
export const FlyingFlower = ({ 
  delay = 0, 
  duration = 12, 
  className = "",
  size = 'medium',
  zIndex = 1
}: FlowerProps) => {
  
  // Estado para dimensiones de ventana
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Efecto para manejo responsive
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * GENERADOR: Trayectorias de Caída Natural como Hojas
   * ==================================================
   * 
   * Crea rutas de caída realistas distribuidas equitativamente por toda la pantalla,
   * con movimiento zigzag y balanceo desde arriba hacia abajo.
   */
  const generateFlowerPath = () => {
    // Dividir la pantalla en 5 zonas para mejor distribución: muy izquierda, izquierda, centro, derecha, muy derecha
    const zones = [
      { start: -30, end: windowSize.width * 0.2 },          // Zona muy izquierda (incluye fuera de pantalla)
      { start: windowSize.width * 0.2, end: windowSize.width * 0.4 },   // Zona izquierda
      { start: windowSize.width * 0.4, end: windowSize.width * 0.6 },   // Zona centro
      { start: windowSize.width * 0.6, end: windowSize.width * 0.8 },   // Zona derecha
      { start: windowSize.width * 0.8, end: windowSize.width + 30 }     // Zona muy derecha (incluye fuera de pantalla)
    ];
    
    // Seleccionar zona aleatoriamente para distribución equitativa
    const selectedZone = zones[Math.floor(Math.random() * zones.length)];
    
    // Posición inicial dentro de la zona seleccionada
    const startX = selectedZone.start + Math.random() * (selectedZone.end - selectedZone.start);
    
    // Crear zigzag natural de caída como hoja real
    const paths = [
      // Caída zigzag izquierda
      {
        x: [startX, startX - 40, startX + 20, startX - 30, startX + 10, startX - 20],
        y: [-80, windowSize.height * 0.2, windowSize.height * 0.4, windowSize.height * 0.6, windowSize.height * 0.8, windowSize.height + 80]
      },
      
      // Caída zigzag derecha
      {
        x: [startX, startX + 40, startX - 20, startX + 30, startX - 10, startX + 20],
        y: [-80, windowSize.height * 0.2, windowSize.height * 0.4, windowSize.height * 0.6, windowSize.height * 0.8, windowSize.height + 80]
      },
      
      // Caída más recta con poco balanceo
      {
        x: [startX, startX + 15, startX - 15, startX + 10, startX - 5, startX],
        y: [-80, windowSize.height * 0.25, windowSize.height * 0.45, windowSize.height * 0.65, windowSize.height * 0.85, windowSize.height + 80]
      },
      
      // Caída con curva amplia izquierda
      {
        x: [startX, startX - 60, startX - 30, startX - 50, startX - 10, startX - 30],
        y: [-80, windowSize.height * 0.15, windowSize.height * 0.35, windowSize.height * 0.55, windowSize.height * 0.75, windowSize.height + 80]
      },
      
      // Caída con curva amplia derecha
      {
        x: [startX, startX + 60, startX + 30, startX + 50, startX + 10, startX + 30],
        y: [-80, windowSize.height * 0.15, windowSize.height * 0.35, windowSize.height * 0.55, windowSize.height * 0.75, windowSize.height + 80]
      }
    ];
    
    return paths[Math.floor(Math.random() * paths.length)];
  };

  const flowerPath = generateFlowerPath();

  // Configuración de tamaños
  const sizeConfig = {
    small: { width: 25, height: 25, opacity: 0.7 },
    medium: { width: 35, height: 35, opacity: 0.8 },
    large: { width: 45, height: 45, opacity: 0.9 }
  };

  const currentSize = sizeConfig[size];

  return (
    <motion.div
      className={`flying-flower ${className}`}
      
      initial={{ 
        x: flowerPath.x[0],
        y: flowerPath.y[0],
        rotate: 0,
        scale: 1,
        opacity: 1  // Comienzan completamente visibles
      }}
      
      animate={{
        x: flowerPath.x,
        y: flowerPath.y,
        rotate: [0, 30, -25, 35, -20, 15, -10, 0],  // Rotación como hoja cayendo
        scale: [1, 0.9, 1.1, 0.95, 1.05, 0.9, 1],  // Variación sutil de tamaño
        opacity: [1, 1, 1, 1, 1, 0.8, 0]  // Visible hasta casi el final, solo desaparece al llegar abajo
      }}
      
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "linear",  // Movimiento más natural de caída
        times: [0, 0.15, 0.3, 0.45, 0.6, 0.85, 1]  // Opacidad completa hasta 85% del recorrido
      }}
      
      style={{
        position: 'fixed',
        width: currentSize.width,
        height: currentSize.height,
        zIndex: zIndex,  // Controlado por prop (1 = detrás, 1000 = delante)
        pointerEvents: 'none',  // No interfiere con interacciones
        transformOrigin: 'center center'
      }}
    >
      {/* SVG de la flor blanca */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        style={{ 
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          transform: 'translateZ(0)'  // Hardware acceleration
        }}
      >
        {/* Pétalos de la flor */}
        <g>
          {/* Pétalo superior */}
          <ellipse cx="50" cy="25" rx="8" ry="20" fill="#ffffff" stroke="#f0f0f0" strokeWidth="1" opacity="0.95"/>
          
          {/* Pétalo superior derecho */}
          <ellipse cx="65" cy="35" rx="8" ry="20" fill="#ffffff" stroke="#f0f0f0" strokeWidth="1" opacity="0.95" transform="rotate(45 65 35)"/>
          
          {/* Pétalo derecho */}
          <ellipse cx="75" cy="50" rx="8" ry="20" fill="#ffffff" stroke="#f0f0f0" strokeWidth="1" opacity="0.95" transform="rotate(90 75 50)"/>
          
          {/* Pétalo inferior derecho */}
          <ellipse cx="65" cy="65" rx="8" ry="20" fill="#ffffff" stroke="#f0f0f0" strokeWidth="1" opacity="0.95" transform="rotate(135 65 65)"/>
          
          {/* Pétalo inferior */}
          <ellipse cx="50" cy="75" rx="8" ry="20" fill="#ffffff" stroke="#f0f0f0" strokeWidth="1" opacity="0.95" transform="rotate(180 50 75)"/>
          
          {/* Pétalo inferior izquierdo */}
          <ellipse cx="35" cy="65" rx="8" ry="20" fill="#ffffff" stroke="#f0f0f0" strokeWidth="1" opacity="0.95" transform="rotate(225 35 65)"/>
          
          {/* Pétalo izquierdo */}
          <ellipse cx="25" cy="50" rx="8" ry="20" fill="#ffffff" stroke="#f0f0f0" strokeWidth="1" opacity="0.95" transform="rotate(270 25 50)"/>
          
          {/* Pétalo superior izquierdo */}
          <ellipse cx="35" cy="35" rx="8" ry="20" fill="#ffffff" stroke="#f0f0f0" strokeWidth="1" opacity="0.95" transform="rotate(315 35 35)"/>
          
          {/* Centro de la flor */}
          <circle cx="50" cy="50" r="8" fill="#ffd700" stroke="#f0c674" strokeWidth="1"/>
          
          {/* Detalles del centro */}
          <circle cx="50" cy="50" r="6" fill="#ffed4e" opacity="0.8"/>
          <circle cx="50" cy="50" r="3" fill="#ffd700"/>
        </g>
      </svg>
    </motion.div>
  );
};

/**
 * COMPONENTE CONTENEDOR: FlowerSwarm - Enjambre de Flores
 * =======================================================
 * 
 * Crea múltiples flores voladoras con diferentes configuraciones
 * para poblar toda la pantalla con un efecto visual sutil y hermoso.
 */
interface FlowerSwarmProps {
  count?: number;        // Número de flores simultáneas
  className?: string;    // Clases CSS adicionales
}

export const FlowerSwarm = ({ count = 15, className = "" }: FlowerSwarmProps) => {
  // Generar configuraciones aleatorias para cada flor
  const flowers = Array.from({ length: count }, (_, index) => ({
    id: `flower-${index}`,
    delay: Math.random() * 5,  // Retraso aleatorio más corto
    duration: 8 + Math.random() * 6,  // Duración más corta para caída natural
    size: (['small', 'medium', 'large'] as const)[Math.floor(Math.random() * 3)],
    // Todas las flores por delante para que se vean claramente
    zIndex: 1000
  }));

  return (
    <div className={`flower-swarm ${className}`}>
      {flowers.map((flower) => (
        <FlyingFlower
          key={flower.id}
          delay={flower.delay}
          duration={flower.duration}
          size={flower.size}
          zIndex={flower.zIndex}
        />
      ))}
    </div>
  );
};