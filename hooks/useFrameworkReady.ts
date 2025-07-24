import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useFrameworkReady() {
  useEffect(() => {
    // Hook pour React Native - pas besoin de window
    // On peut faire des initialisations spécifiques à la plateforme si nécessaire
    if (Platform.OS === 'web') {
      // Seulement sur web, on peut utiliser window
      if (typeof window !== 'undefined' && window.frameworkReady) {
        window.frameworkReady();
      }
    }

    // Pour React Native (iOS/Android), on peut faire d'autres initialisations
    // Par exemple : configuration de polyfills, initialisation de stores, etc.

  }, []);
}
