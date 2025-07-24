import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Mic, MicOff, X, Volume2 } from 'lucide-react-native';
import * as Speech from 'expo-speech';

interface VoiceCommandsProps {
  onClose: () => void;
  onCommand: (command: string) => void;
}

const VOICE_COMMANDS = {
  // Punctuation
  'comma': ',',
  'semicolon': ';',
  'question mark': '?',
  'dot': '.',
  'period': '.',
  'forward slash': '/',
  'backslash': '\\',
  'colon': ':',
  'double quote': '"',
  'single quote': "'",
  'apostrophe': "'",
  
  // Brackets
  'open parenthesis': '(',
  'close parenthesis': ')',
  'open bracket': '[',
  'close bracket': ']',
  'open brace': '{',
  'close brace': '}',
  
  // Operators
  'equals': '=',
  'plus': '+',
  'minus': '-',
  'multiply': '*',
  'asterisk': '*',
  'ampersand': '&',
  'less than': '<',
  'greater than': '>',
  'exclamation': '!',
  'percent': '%',
  'underscore': '_',
  'backtick': '`',
  'grave accent': '`',
  
  // Common programming words
  'function': 'function',
  'const': 'const',
  'let': 'let',
  'var': 'var',
  'if': 'if',
  'else': 'else',
  'for': 'for',
  'while': 'while',
  'return': 'return',
  'class': 'class',
  'import': 'import',
  'export': 'export',
  'from': 'from',
  'default': 'default',
  
  // Actions
  'new line': '\n',
  'tab': '\t',
  'space': ' ',
  'backspace': 'BACKSPACE',
  'delete': 'DELETE',
  'copy': 'COPY',
  'paste': 'PASTE',
  'select all': 'SELECT_ALL',
  'save': 'SAVE',
};

export function VoiceCommands({ onClose, onCommand }: VoiceCommandsProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [lastCommand, setLastCommand] = useState('');

  const handleVoiceCommand = (text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    if (VOICE_COMMANDS[lowerText]) {
      const command = VOICE_COMMANDS[lowerText];
      setLastCommand(`"${text}" → ${command}`);
      onCommand(command);
    } else {
      // If not a special command, treat as regular text
      setLastCommand(`"${text}" → ${text}`);
      onCommand(text);
    }
  };

  const startListening = () => {
    setIsListening(true);
    setRecognizedText('Listening...');
    
    // Simulate voice recognition (in a real app, use expo-speech or similar)
    setTimeout(() => {
      setIsListening(false);
      setRecognizedText('');
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    setRecognizedText('');
  };

  const speakCommand = (command: string) => {
    Speech.speak(command, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.8,
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Voice Commands</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.micContainer}>
            <TouchableOpacity
              style={[styles.micButton, isListening && styles.micButtonActive]}
              onPress={isListening ? stopListening : startListening}
            >
              {isListening ? <MicOff size={32} color="#ff0080" /> : <Mic size={32} color="#00ff41" />}
            </TouchableOpacity>
            <Text style={styles.micText}>
              {isListening ? 'Listening...' : 'Tap to speak'}
            </Text>
          </View>

          {recognizedText && (
            <View style={styles.recognizedContainer}>
              <Text style={styles.recognizedText}>{recognizedText}</Text>
            </View>
          )}

          {lastCommand && (
            <View style={styles.lastCommandContainer}>
              <Text style={styles.lastCommandText}>{lastCommand}</Text>
            </View>
          )}

          <ScrollView style={styles.commandsList} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Available Commands:</Text>
            
            <View style={styles.commandSection}>
              <Text style={styles.commandSectionTitle}>Punctuation:</Text>
              {Object.entries(VOICE_COMMANDS)
                .filter(([_, value]) => [',', ';', '?', '.', '/', '\\', ':', '"', "'"].includes(value))
                .map(([command, symbol]) => (
                  <TouchableOpacity
                    key={command}
                    style={styles.commandItem}
                    onPress={() => {
                      handleVoiceCommand(command);
                      speakCommand(command);
                    }}
                  >
                    <Text style={styles.commandText}>"{command}" → {symbol}</Text>
                    <TouchableOpacity onPress={() => speakCommand(command)}>
                      <Volume2 size={16} color="#666" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
            </View>

            <View style={styles.commandSection}>
              <Text style={styles.commandSectionTitle}>Brackets:</Text>
              {Object.entries(VOICE_COMMANDS)
                .filter(([_, value]) => ['(', ')', '[', ']', '{', '}'].includes(value))
                .map(([command, symbol]) => (
                  <TouchableOpacity
                    key={command}
                    style={styles.commandItem}
                    onPress={() => {
                      handleVoiceCommand(command);
                      speakCommand(command);
                    }}
                  >
                    <Text style={styles.commandText}>"{command}" → {symbol}</Text>
                    <TouchableOpacity onPress={() => speakCommand(command)}>
                      <Volume2 size={16} color="#666" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
            </View>

            <View style={styles.commandSection}>
              <Text style={styles.commandSectionTitle}>Operators:</Text>
              {Object.entries(VOICE_COMMANDS)
                .filter(([_, value]) => ['=', '+', '-', '*', '&', '<', '>', '!', '%', '_', '`'].includes(value))
                .map(([command, symbol]) => (
                  <TouchableOpacity
                    key={command}
                    style={styles.commandItem}
                    onPress={() => {
                      handleVoiceCommand(command);
                      speakCommand(command);
                    }}
                  >
                    <Text style={styles.commandText}>"{command}" → {symbol}</Text>
                    <TouchableOpacity onPress={() => speakCommand(command)}>
                      <Volume2 size={16} color="#666" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#00ff41',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#00ff41',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  closeButton: {
    padding: 4,
  },
  micContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#001a0a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00ff41',
    marginBottom: 10,
  },
  micButtonActive: {
    backgroundColor: '#1a0010',
    borderColor: '#ff0080',
  },
  micText: {
    color: '#00ff41',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  recognizedContainer: {
    backgroundColor: '#001a0a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00ff41',
  },
  recognizedText: {
    color: '#00ff41',
    fontSize: 16,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  lastCommandContainer: {
    backgroundColor: '#1a0010',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ff0080',
  },
  lastCommandText: {
    color: '#ff0080',
    fontSize: 14,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  commandsList: {
    flex: 1,
  },
  sectionTitle: {
    color: '#00ff41',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  commandSection: {
    marginBottom: 20,
  },
  commandSectionTitle: {
    color: '#ffff00',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  commandItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  commandText: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'monospace',
    flex: 1,
  },
});