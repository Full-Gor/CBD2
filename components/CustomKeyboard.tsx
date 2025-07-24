import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Vibration, Platform, NativeModules } from 'react-native';
import { Mic, MicOff, Copy, Clipboard, RotateCcw, Undo, Redo } from 'lucide-react-native';
import { useFileStore } from '@/store/fileStore';
import { SoundManager } from '@/utils/soundManager';
import * as Haptics from 'expo-haptics';

// Accès au module Android pour le son du clavier
const { UIManager } = NativeModules;

interface CustomKeyboardProps {
  onKeyPress: (key: string) => void;
  onClose: () => void;
  height: number;
}

const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const LETTERS = [
  ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
  ['w', 'x', 'c', 'v', 'b', 'n']
];

const SYMBOLS = [
  [',', ';', '?', '.', '/', '\\', ':', '"', "'"],
  ['(', ')', '[', ']', '{', '}', '=', '+', '-'],
  ['*', '&', '<', '>', '!', '%', '-', '_', '`']
];

export function CustomKeyboard({ onKeyPress, onClose, height }: CustomKeyboardProps) {
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  const backspaceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const backspaceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Lire les paramètres depuis le store
  const { keyboardSize, soundSettings } = useFileStore();
  
  // Charger les sons
  useEffect(() => {
    if (soundSettings.keyPress.enabled) {
      SoundManager.loadAllSounds(soundSettings, ['keyPress']);
    }
    
    return () => {
      SoundManager.unloadAllSounds();
    };
  }, [soundSettings]);
  
  const playKeySound = async () => {
    if (soundSettings.keyPress.enabled) {
      await SoundManager.playSound('keyPress');
    }
  };

  const triggerHaptic = async () => {
    try {
      // Utiliser une vibration plus forte et plus courte
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      // Fallback to Vibration API if Haptics is not available
      // Vibration très courte (5ms) mais perceptible
      Vibration.vibrate(5);
    }
  };

  const playSystemKeyboardSound = async () => {
    // Essayer d'abord le son système
    const systemSoundPlayed = await SoundManager.playSystemKeyboardSound();
    
    // Si le son système n'a pas pu être joué, utiliser notre son personnalisé
    if (!systemSoundPlayed && soundSettings.keyPress.enabled) {
      await SoundManager.playSound('keyPress');
    }
  };

  const handleKeyPress = (key: string) => {
    // Jouer le son système au lieu du son personnalisé
    playSystemKeyboardSound();
    triggerHaptic();
    const processedKey = isUpperCase ? key.toUpperCase() : key;
    onKeyPress(processedKey);
  };

  const handleSpecialKey = (action: string) => {
    playSystemKeyboardSound();
    triggerHaptic();
    
    switch (action) {
      case 'backspace':
        onKeyPress('BACKSPACE');
        break;
      case 'space':
        onKeyPress(' ');
        break;
      case 'enter':
        onKeyPress('\n');
        break;
      case 'tab':
        onKeyPress('\t');
        break;
      case 'copy':
        onKeyPress('COPY');
        break;
      case 'paste':
        onKeyPress('PASTE');
        break;
      case 'selectAll':
        onKeyPress('SELECT_ALL');
        break;
      case 'undo':
        onKeyPress('UNDO');
        break;
      case 'redo':
        onKeyPress('REDO');
        break;
      case 'mic':
        setIsRecording(!isRecording);
        break;
    }
  };

  const handleBackspacePressIn = () => {
    playSystemKeyboardSound();
    triggerHaptic();
    onKeyPress('BACKSPACE');
    
    // Démarrer la répétition après 400ms (plus court)
    backspaceTimerRef.current = setTimeout(() => {
      backspaceIntervalRef.current = setInterval(() => {
        triggerHaptic();
        onKeyPress('BACKSPACE');
      }, 40); // Répéter plus rapidement (40ms au lieu de 50ms)
    }, 400);
  };

  const handleBackspacePressOut = () => {
    // Arrêter la répétition
    if (backspaceTimerRef.current) {
      clearTimeout(backspaceTimerRef.current);
      backspaceTimerRef.current = null;
    }
    if (backspaceIntervalRef.current) {
      clearInterval(backspaceIntervalRef.current);
      backspaceIntervalRef.current = null;
    }
  };

  // Nettoyer les timers au démontage
  useEffect(() => {
    return () => {
      if (backspaceTimerRef.current) {
        clearTimeout(backspaceTimerRef.current);
      }
      if (backspaceIntervalRef.current) {
        clearInterval(backspaceIntervalRef.current);
      }
    };
  }, []);

  const actualHeight = keyboardSize || height;

  return (
    <View style={[styles.container, { height: actualHeight }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Matrix Keyboard</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.keyboardContainer} showsVerticalScrollIndicator={false}>
        {/* Numbers Row */}
        <View style={styles.row}>
          {NUMBERS.map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.numberKey}
              onPress={() => handleKeyPress(num)}
              activeOpacity={0.7}
            >
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Letters or Symbols */}
        {showSymbols ? (
          SYMBOLS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((symbol) => (
                <TouchableOpacity
                  key={symbol}
                  style={styles.key}
                  onPress={() => handleKeyPress(symbol)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.keyText}>{symbol}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))
        ) : (
          LETTERS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((letter) => (
                <TouchableOpacity
                  key={letter}
                  style={styles.key}
                  onPress={() => handleKeyPress(letter)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.keyText}>
                    {isUpperCase ? letter.toUpperCase() : letter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}

        {/* Function Keys Row */}
        <View style={styles.functionRow}>
          <TouchableOpacity
            style={[styles.functionKey, isUpperCase && styles.activeKey]}
            onPress={() => {
              playSystemKeyboardSound();
              triggerHaptic();
              setIsUpperCase(!isUpperCase);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.functionText}>⇧</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.functionKey, showSymbols && styles.activeKey]}
            onPress={() => {
              playSystemKeyboardSound();
              triggerHaptic();
              setShowSymbols(!showSymbols);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.functionText}>{showSymbols ? 'ABC' : '!@#'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.spaceKey}
            onPress={() => handleSpecialKey('space')}
            activeOpacity={0.7}
          >
            <Text style={styles.functionText}>SPACE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.functionKey}
            onPressIn={handleBackspacePressIn}
            onPressOut={handleBackspacePressOut}
            activeOpacity={0.7}
          >
            <Text style={styles.functionText}>⌫</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.functionKey}
            onPress={() => handleSpecialKey('enter')}
            activeOpacity={0.7}
          >
            <Text style={styles.functionText}>↵</Text>
          </TouchableOpacity>
        </View>

        {/* Undo/Redo Row */}
        <View style={styles.undoRedoRow}>
          <TouchableOpacity
            style={styles.undoRedoButton}
            onPress={() => handleSpecialKey('undo')}
            activeOpacity={0.7}
          >
            <Undo size={16} color="#00ff41" />
            <Text style={styles.actionText}>Undo (Ctrl+Z)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.undoRedoButton}
            onPress={() => handleSpecialKey('redo')}
            activeOpacity={0.7}
          >
            <Redo size={16} color="#00ff41" />
            <Text style={styles.actionText}>Redo (Ctrl+Y)</Text>
          </TouchableOpacity>
        </View>

        {/* Special Actions Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionKey}
            onPress={() => handleSpecialKey('copy')}
            activeOpacity={0.7}
          >
            <Copy size={16} color="#00ff41" />
            <Text style={styles.actionText}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionKey}
            onPress={() => handleSpecialKey('paste')}
            activeOpacity={0.7}
          >
            <Clipboard size={16} color="#00ff41" />
            <Text style={styles.actionText}>Paste</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionKey}
            onPress={() => handleSpecialKey('selectAll')}
            activeOpacity={0.7}
          >
            <RotateCcw size={16} color="#00ff41" />
            <Text style={styles.actionText}>Select All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionKey, isRecording && styles.recordingKey]}
            onPress={() => handleSpecialKey('mic')}
            activeOpacity={0.7}
          >
            {isRecording ? <MicOff size={16} color="#ff0080" /> : <Mic size={16} color="#00ff41" />}
            <Text style={styles.actionText}>Voice</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#00ff41',
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#00ff41',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#666',
    fontSize: 20,
  },
  keyboardContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 2,
  },
  key: {
    backgroundColor: '#2a2a2a',
    margin: 1,
    padding: 12,
    borderRadius: 4,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  numberKey: {
    backgroundColor: '#2a2a2a',
    margin: 1,
    padding: 12,
    borderRadius: 4,
    minWidth: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  keyText: {
    color: '#00ff41',
    fontSize: 18,
    fontFamily: 'monospace',
  },
  functionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  functionKey: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  activeKey: {
    backgroundColor: '#00ff41',
    borderColor: '#00ff41',
  },
  spaceKey: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  functionText: {
    color: '#00ff41',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
    paddingBottom: 8,
  },
  undoRedoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  undoRedoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001a0a',
    borderWidth: 1,
    borderColor: '#00ff41',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    flex: 1,
    justifyContent: 'center',
  },
  actionKey: {
    backgroundColor: '#001a0a',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00ff41',
    minWidth: 90,
  },
  recordingKey: {
    backgroundColor: '#1a0010',
    borderColor: '#ff0080',
  },
  actionText: {
    color: '#00ff41',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2,
    marginLeft: 4,
  },
});