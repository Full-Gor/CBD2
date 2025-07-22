const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ajouter les extensions de fichiers supportées
config.resolver.assetExts.push(
  'mp3',
  'wav',
  'mp4',
  'mov',
  'pdf'
);

// Configuration pour le support des modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Gérer les modules qui peuvent causer des problèmes
  if (moduleName === 'PlatformConstants') {
    return {
      type: 'empty'
    };
  }
  
  // Résolution par défaut
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;