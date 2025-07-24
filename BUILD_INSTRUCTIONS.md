# Instructions de Build APK - CBD Editor

## 🚀 Génération de l'APK avec EAS

### Prérequis
1. **Compte Expo** configuré
2. **EAS CLI** installé : `npm install -g eas-cli`
3. **expo-dev-client** installé : `npm install expo-dev-client`

### Configuration actuelle
- ✅ **eas.json** configuré avec profil "development"
- ✅ **app.json** configuré avec expo-audio
- ✅ **expo-dev-client** installé
- ✅ **Git repository** initialisé

### Commandes de build

#### Build de développement (APK)
```bash
eas build --profile development --platform android
```

#### Build de prévisualisation (APK)
```bash
eas build --profile preview --platform android
```

#### Build de production (AAB)
```bash
eas build --profile production --platform android
```

### Problèmes rencontrés

#### Limite du plan gratuit EAS
- **Erreur** : "This account has used its builds from the Free plan this month"
- **Solution** : 
  - Attendre la réinitialisation (7 jours)
  - Ou passer à un plan payant
  - Ou utiliser un autre compte Expo

#### Alternative temporaire
En attendant, vous pouvez :
1. **Tester l'app** avec Expo Go
2. **Utiliser le développement local** : `npx expo start`
3. **Scanner le QR code** avec votre téléphone

### Configuration des profils

#### Profil Development
```json
{
  "development": {
    "android": {
      "buildType": "apk"
    }
  }
}
```

#### Profil Preview
```json
{
  "preview": {
    "android": {
      "buildType": "apk"
    }
  }
}
```

#### Profil Production
```json
{
  "production": {
    "android": {
      "buildType": "app-bundle"
    }
  }
}
```

### Fonctionnalités incluses dans le build
- ✅ **Animation Matrix** avec caractères japonais
- ✅ **Clavier personnalisé** optimisé
- ✅ **Thèmes multiples** (cyberpunk, neon, matrix, etc.)
- ✅ **Commandes vocales**
- ✅ **Éditeur de code** avec coloration syntaxique
- ✅ **Gestionnaire de fichiers**
- ✅ **Sons et vibrations** haptiques

### Prochaines étapes
1. **Attendre la réinitialisation** du plan gratuit EAS
2. **Relancer le build** : `eas build --profile development --platform android`
3. **Télécharger l'APK** depuis le dashboard Expo
4. **Installer sur votre appareil** Android

### Support
- **Documentation EAS** : https://docs.expo.dev/build/introduction/
- **Dashboard Expo** : https://expo.dev/accounts/arnaud93500/projects/cbd-editor
- **Limites des plans** : https://expo.dev/accounts/arnaud93500/settings/billing 