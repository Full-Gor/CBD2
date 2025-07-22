import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CodeEditor } from '@/components/CodeEditor';
import { MediaViewer } from '@/components/MediaViewer';
import { FileTabsBar } from '@/components/FileTabsBar';
import { CustomKeyboard } from '@/components/CustomKeyboard';
import { useFileStore } from '@/store/fileStore';
import { VoiceCommands } from '@/components/VoiceCommands';
import { Save, Play, Mic, MicOff, Terminal, Maximize2 } from 'lucide-react-native';
import { SoundManager } from '@/utils/soundManager';

const { height } = Dimensions.get('window');

export default function EditorScreen() {
  const { 
    openFiles, 
    activeFileId, 
    setActiveFile, 
    closeFile, 
    saveFile, 
    updateFileContent, 
    runFile, 
    undo, 
    redo,
    theme,
    soundSettings 
  } = useFileStore();
  
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(280);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeFile = openFiles.find(file => file.id === activeFileId);

  // Charger les sons
  useEffect(() => {
    if (soundSettings) {
      SoundManager.loadAllSounds(soundSettings, ['save', 'run', 'error', 'pageChange']);
    }
    
    return () => {
      SoundManager.unloadAllSounds();
    };
  }, [soundSettings]);
  
  const playSound = async (soundType: string) => {
    if (soundSettings[soundType as keyof typeof soundSettings]?.enabled) {
      await SoundManager.playSound(soundType);
    }
  };

  // Définir les couleurs par thème (doit correspondre à THEME_COLORS)
  const THEME_COLORS = {
    cyberpunk: {
      title: '#00ff41',
      subtitle: '#666',
      matrix: '#ff0080',
      code: '#00ff41',
      background: '#0a0a0a',
      headerBorder: '#ff0080',
      headerText: '#00ff41',
      tabText: '#00ff41',
    },
    neon: {
      title: '#fffb00',
      subtitle: '#ff00c8',
      matrix: '#fffb00',
      code: '#39ff14',
      background: '#0a0a0a',
      headerBorder: '#ff00c8',
      headerText: '#fffb00',
      tabText: '#00fff7',
    },
    matrix: {
      title: '#00ff41',
      subtitle: '#003300',
      matrix: '#00ff41',
      code: '#00ff41',
      background: '#0a0a0a',
      headerBorder: '#003300',
      headerText: '#00ff41',
      tabText: '#00ff41',
    },
    'blade runner': {
      title: '#ff6600',
      subtitle: '#fffb00',
      matrix: '#ff0080',
      code: '#ff6600',
      background: '#0a0a0a',
      headerBorder: '#fffb00',
      headerText: '#ff6600',
      tabText: '#ff6600',
    },
    'neon-orange': {
      title: '#ffe066',
      subtitle: '#ff9500',
      matrix: '#ffe066',
      code: '#4fd3ff',
      background: '#0a0a0a',
      headerBorder: '#ff9500',
      headerText: '#ffe066',
      tabText: '#4fd3ff',
    },
    'cyan-red': {
      title: '#00ffff',
      subtitle: '#ff0040',
      matrix: '#00ffff',
      code: '#00ffff',
      background: '#0a0a0a',
      headerBorder: '#ff0040',
      headerText: '#00ffff',
      tabText: '#00ffff',
    },
    'gold-red': {
      title: '#ffd700',
      subtitle: '#ff0040',
      matrix: '#ffd700',
      code: '#ffd700',
      background: '#0a0a0a',
      headerBorder: '#ff0040',
      headerText: '#ffd700',
      tabText: '#ffd700',
    },
    'gold-red-cyan': {
      title: '#ffd700',
      subtitle: '#ff0040',
      matrix: '#00ffff',
      code: '#ffd700',
      background: '#0a0a0a',
      headerBorder: '#00ffff',
      headerText: '#ffd700',
      tabText: '#00ffff',
    },
  };
  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.cyberpunk;

  const handleSave = async () => {
    if (activeFile) {
      try {
        await saveFile(activeFile.id);
        await playSound('save');
        Alert.alert('Success', 'File saved successfully');
      } catch (error) {
        await playSound('error');
        Alert.alert('Error', 'Failed to save file');
      }
    }
  };

  const handleRun = async () => {
    if (activeFile) {
      try {
        await runFile(activeFile.id);
        await playSound('run');
        Alert.alert('Success', `Running ${activeFile.name}...`);
      } catch (error) {
        await playSound('error');
        Alert.alert('Error', 'Failed to run file');
      }
    }
  };

  const handleKeyPress = (key: string) => {
    if (!activeFile || activeFile.isMediaFile) return;

    switch (key) {
      case 'BACKSPACE':
        const beforeCursor = activeFile.content.slice(0, -1);
        updateFileContent(activeFile.id, beforeCursor);
        break;
      case 'COPY':
        // Handle copy
        break;
      case 'PASTE':
        // Handle paste
        break;
      case 'SELECT_ALL':
        // Handle select all
        break;
      case 'UNDO':
        undo();
        break;
      case 'REDO':
        redo();
        break;
      default:
        updateFileContent(activeFile.id, activeFile.content + key);
    }
  };

  const handleVoiceCommand = (command: string) => {
    if (!activeFile || activeFile.isMediaFile) return;

    switch (command) {
      case 'BACKSPACE':
        const beforeCursor = activeFile.content.slice(0, -1);
        updateFileContent(activeFile.id, beforeCursor);
        break;
      case 'SAVE':
        handleSave();
        break;
      case 'UNDO':
        undo();
        break;
      case 'REDO':
        redo();
        break;
      case 'COPY':
      case 'PASTE':
      case 'SELECT_ALL':
        // Handle these commands
        break;
      default:
        updateFileContent(activeFile.id, activeFile.content + command);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    playSound('pageChange');
  };

  const handleShowVoiceCommands = () => {
    setShowVoiceCommands(true);
    playSound('pageChange');
  };

  if (!activeFile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.headerBorder }]}>
          <Text style={[styles.title, { color: colors.headerText }]}>{'CBD Editor'}</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={handleShowVoiceCommands} style={styles.headerButton}>
              <Mic size={20} color={colors.headerText} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.title }]}>// Matrix Editor v1.0</Text>
          <Text style={[styles.emptySubtext, { color: colors.subtitle }]}>Open a file from the Files tab to start coding</Text>
          <Text style={[styles.matrixText, { color: colors.matrix }]}>{'The Matrix has you...'}</Text>
          <View style={styles.matrixCode}>
            <Text style={[styles.codeText, { color: colors.code }]}>01001000 01100101 01101100 01101100 01101111</Text>
            <Text style={[styles.codeText, { color: colors.code }]}>01010111 01101111 01110010 01101100 01100100</Text>
          </View>
        </View>

        {showVoiceCommands && (
          <VoiceCommands
            onClose={() => setShowVoiceCommands(false)}
            onCommand={handleVoiceCommand}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.headerBorder }]}>
        <Text style={[styles.title, { color: colors.headerText }]}>{'CBD Editor'}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Save size={20} color={colors.headerText} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRun} style={styles.headerButton}>
            <Play size={20} color={colors.headerText} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShowVoiceCommands}
            style={[styles.headerButton, showVoiceCommands && styles.activeButton]}
          >
            <Mic size={20} color={showVoiceCommands ? colors.headerBorder : colors.headerText} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleFullscreen}
            style={styles.headerButton}
          >
            <Maximize2 size={20} color={colors.headerText} />
          </TouchableOpacity>
        </View>
      </View>

      {!isFullscreen && <FileTabsBar />}

      <View style={[
        styles.editorContainer,
        { height: height - (showKeyboard ? keyboardHeight + (isFullscreen ? 100 : 200) : (isFullscreen ? 100 : 200)) }
      ]}>
        {activeFile.isMediaFile ? (
          <MediaViewer file={activeFile} />
        ) : (
          <CodeEditor
            file={activeFile}
            onFocus={() => setShowKeyboard(true)}
            onBlur={() => setShowKeyboard(false)}
          />
        )}
      </View>

      {showKeyboard && !activeFile.isMediaFile && (
        <CustomKeyboard
          onKeyPress={handleKeyPress}
          onClose={() => setShowKeyboard(false)}
          height={keyboardHeight}
        />
      )}

      {showVoiceCommands && (
        <VoiceCommands
          onClose={() => setShowVoiceCommands(false)}
          onCommand={handleVoiceCommand}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#00ff41',
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ff41',
    fontFamily: 'monospace',
    textShadowColor: '#00ff41',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    backgroundColor: '#001a0a',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#00ff41',
  },
  activeButton: {
    backgroundColor: '#1a0010',
    borderColor: '#ff0080',
  },
  editorContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 24,
    color: '#00ff41',
    marginBottom: 8,
    fontFamily: 'monospace',
    textShadowColor: '#00ff41',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'monospace',
    marginBottom: 20,
  },
  matrixText: {
    fontSize: 18,
    color: '#ff0080',
    fontFamily: 'monospace',
    textShadowColor: '#ff0080',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
    marginBottom: 20,
  },
  matrixCode: {
    alignItems: 'center',
    gap: 4,
  },
  codeText: {
    fontSize: 10,
    color: '#00ff41',
    fontFamily: 'monospace',
    opacity: 0.5,
  },
});