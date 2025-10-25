import type { ReactNode } from 'react';

interface HangingButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  hangingIntensity?: 'light' | 'medium' | 'strong';
  delay?: number;
}

export const VineHangingButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = ""
}: HangingButtonProps) => {
  
  // Agregar estilos CSS para las animaciones
  const addAnimationStyles = () => {
    const styleId = 'vine-button-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes wind {
          0% { background-position: 0% 50%; }
          50% { background-position: 50% 100%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slay-1 {
          0% { transform: rotate(10deg); }
          50% { transform: rotate(-5deg); }
          100% { transform: rotate(10deg); }
        }
        @keyframes slay-2 {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes slay-3 {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }

      `;
      document.head.appendChild(style);
    }
  };

  // Agregar estilos cuando el componente se monta
  if (typeof window !== 'undefined') {
    addAnimationStyles();
  }

  return (
    <div className={`vine-hanging-container ${className}`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className="vine-hanging-button-simple"
        style={{
          // Diseño EXACTO del CSS que me pasaste
          position: 'relative',
          padding: '15px 45px',
          background: '#fded70ff',
          fontSize: '17px',
          fontWeight: '500',
          color: '#181818',
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: '1px solid #fded70ff',
          borderRadius: '50px',
          filter: 'drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.2))',
          transition: 'all 0.3s ease',
          outline: 'none',
          textDecoration: 'none',
          opacity: disabled ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.border = '1px solid #fff080';
            e.currentTarget.style.background = 'linear-gradient(85deg, #fff080)';
            e.currentTarget.style.animation = 'wind 2s ease-in-out infinite';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.border = '1px solid #fff080';
            e.currentTarget.style.background = '#fff080';
            e.currentTarget.style.animation = 'none';
          }
        }}
      >


        {children}
        {/* Elemento necesario para la decoración de esquina inferior derecha */}
        <div className="corner-decoration"></div>
      </button>
    </div>
  );
};
