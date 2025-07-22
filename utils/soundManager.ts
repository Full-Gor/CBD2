import { Audio } from 'expo-av';

export class SoundManager {
    private static sounds: { [key: string]: Audio.Sound | null } = {};

    // Sons par défaut utilisant des données base64 ou des URLs
    private static DEFAULT_SOUNDS = {
        keyPress: null, // Sera géré silencieusement
        save: null,
        run: null,
        error: null,
        pageChange: null,
        tabSwitch: null,
        delete: null,
    };

    static async loadSound(
        soundType: string,
        customUri?: string,
        volume: number = 0.3
    ): Promise<Audio.Sound | null> {
        try {
            // Essayer de charger le son personnalisé d'abord
            if (customUri) {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: customUri },
                    { volume }
                );
                return sound;
            }

            // Si pas de son personnalisé et pas de son par défaut, retourner null
            return null;
        } catch (error) {
            console.log(`Could not load sound for ${soundType}:`, error);
            return null;
        }
    }

    static async playSound(soundType: string): Promise<void> {
        const sound = this.sounds[soundType];
        if (sound) {
            try {
                await sound.replayAsync();
            } catch (error) {
                console.log(`Error playing ${soundType} sound:`, error);
            }
        }
    }

    static async loadAllSounds(
        soundSettings: any,
        soundTypes: string[] = ['keyPress', 'save', 'run', 'error', 'pageChange', 'tabSwitch', 'delete']
    ): Promise<void> {
        for (const soundType of soundTypes) {
            const settings = soundSettings[soundType];
            if (settings?.enabled) {
                this.sounds[soundType] = await this.loadSound(
                    soundType,
                    settings.uri
                );
            }
        }
    }

    static async unloadAllSounds(): Promise<void> {
        for (const sound of Object.values(this.sounds)) {
            if (sound) {
                try {
                    await sound.unloadAsync();
                } catch (error) {
                    console.log('Error unloading sound:', error);
                }
            }
        }
        this.sounds = {};
    }
}