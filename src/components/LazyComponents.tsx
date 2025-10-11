import { lazy, Suspense } from 'react';

// Lazy loading para componentes pesados
export const LazyHangingButton = lazy(() => 
  import('../components/HangingButton').then(module => ({ default: module.HangingButton }))
);
export const LazyBeeToHiveLoading = lazy(() => 
  import('../components/BeeToHiveLoading').then(module => ({ default: module.BeeToHiveLoading }))
);
export const LazyBeeSwarm = lazy(() => 
  import('../components/FlyingBees').then(module => ({ default: module.BeeSwarm }))
);

// Componente de fallback para suspense
export const ComponentFallback = ({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div 
        className={`${sizeClasses[size]} border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin`}
        style={{
          animation: 'spin 1s linear infinite'
        }}
      ></div>
    </div>
  );
};

// HOC para wrapper con suspense
export const withSuspense = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  return (props: P) => (
    <Suspense fallback={fallback || <ComponentFallback />}>
      <Component {...props} />
    </Suspense>
  );
};

// Componentes optimizados con lazy loading
export const OptimizedHangingButton = withSuspense(LazyHangingButton, <ComponentFallback size="small" />);
export const OptimizedBeeToHiveLoading = withSuspense(LazyBeeToHiveLoading, <ComponentFallback size="large" />);
export const OptimizedBeeSwarm = withSuspense(LazyBeeSwarm, null); // Sin fallback para las abejas

// Hook para precargar componentes
export const usePreloadComponents = () => {
  const preloadHangingButton = () => LazyHangingButton;
  const preloadBeeLoading = () => LazyBeeToHiveLoading;
  const preloadBeeSwarm = () => LazyBeeSwarm;

  return {
    preloadHangingButton,
    preloadBeeLoading,
    preloadBeeSwarm,
    preloadAll: () => {
      preloadHangingButton();
      preloadBeeLoading();
      preloadBeeSwarm();
    }
  };
};