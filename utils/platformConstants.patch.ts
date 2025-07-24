// Patch pour PlatformConstants - Expo SDK 53
// Ce patch doit être importé en premier pour éviter les erreurs

declare global {
    var PlatformConstants: {
        reactNativeVersion: { major: number; minor: number; patch: number };
        forceTouchAvailable: boolean;
        interfaceIdiom: string;
        osVersion: string;
        systemName: string;
    };
}

// Vérifier si PlatformConstants n'existe pas déjà
if (!global.PlatformConstants) {
    global.PlatformConstants = {
        reactNativeVersion: { major: 0, minor: 79, patch: 5 },
        forceTouchAvailable: false,
        interfaceIdiom: 'phone',
        osVersion: '13',
        systemName: 'android'
    };
}

export { }; 