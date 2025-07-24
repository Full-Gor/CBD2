import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';

export interface SoundSettings {
  keyPress: { enabled: boolean; uri?: string };
  save: { enabled: boolean; uri?: string };
  run: { enabled: boolean; uri?: string };
  error: { enabled: boolean; uri?: string };
  delete: { enabled: boolean; uri?: string };
  tabSwitch: { enabled: boolean; uri?: string };
  pageChange: { enabled: boolean; uri?: string };
}

export class SoundManager {
  static audioPlayers: Record<string, AudioPlayer> = {};

  static async loadAllSounds(settings: SoundSettings, requiredSounds?: string[]) {
    const soundFiles = {
      keyPress: require('../assets/sounds/key-press.mp3'),
      save: require('../assets/sounds/save.mp3'),
      run: require('../assets/sounds/run.mp3'),
      error: require('../assets/sounds/error.mp3'),
      delete: require('../assets/sounds/delete.mp3'),
      tabSwitch: require('../assets/sounds/tab-switch.mp3'),
      pageChange: require('../assets/sounds/page-change.mp3'),
    };

    for (const [key, file] of Object.entries(soundFiles)) {
      if (requiredSounds && !requiredSounds.includes(key)) continue;
      
      const setting = settings[key as keyof SoundSettings];
      if (setting?.enabled) {
        try {
          const player = createAudioPlayer(file);
          player.volume = 0.3;
          this.audioPlayers[key] = player;
        } catch (error) {
          console.error(`Failed to load sound ${key}:`, error);
        }
      }
    }
  }

  static async playSound(soundKey: string) {
    const player = this.audioPlayers[soundKey];
    if (player) {
      try {
        // Revenir au début et jouer
        await player.seekTo(0);
        player.play();
      } catch (error) {
        console.error(`Failed to play sound ${soundKey}:`, error);
      }
    }
  }

  static async playSystemKeyboardSound() {
    // Sur Android, essayer de jouer le son système du clavier
    if (Platform.OS === 'android') {
      try {
        // Créer un player temporaire pour un son très court (clic)
        const clickPlayer = createAudioPlayer(require('../assets/sounds/key-press.mp3'));
        clickPlayer.volume = 0.1;
        clickPlayer.play();
        
        // Nettoyer après un court délai
        setTimeout(() => {
          clickPlayer.remove();
        }, 100);
        
        return true;
      } catch (error) {
        // Si le son système n'est pas disponible, retourner false
        return false;
      }
    }
    return false;
  }

  static async unloadAllSounds() {
    for (const player of Object.values(this.audioPlayers)) {
      try {
        player.remove();
      } catch (error) {
        console.error('Failed to unload sound:', error);
      }
    }
    this.audioPlayers = {};
  }
}