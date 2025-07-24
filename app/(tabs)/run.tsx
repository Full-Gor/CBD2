import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, RefreshCw, Maximize2, Terminal, Globe, Smartphone } from 'lucide-react-native';
import { useFileStore } from '@/store/fileStore';
import { SoundManager } from '@/utils/soundManager';

export default function RunScreen() {
  const {
    openFiles,
    activeFileId,
    theme,
    soundSettings,
    runFile
  } = useFileStore();

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [viewMode, setViewMode] = useState<'console' | 'web' | 'mobile'>('console');

  const activeFile = openFiles.find(file => file.id === activeFileId);

  // Définir les couleurs par thème
  const THEME_COLORS = {
    cyberpunk: {
      primary: '#00ff41',
      secondary: '#ff0080',
      background: '#0a0a0a',
      card: '#1a1a1a',
      border: '#333',
      text: '#fff',
      muted: '#666',
      success: '#00ff41',
      error: '#ff0080',
    },
    // ... autres thèmes
  };

  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.cyberpunk;

  const handleRun = async () => {
    if (!activeFile) {
      setOutput('No file selected. Open a file from the Files tab.');
      return;
    }

    setIsRunning(true);
    setOutput(`Running ${activeFile.name}...\n`);

    if (soundSettings.run.enabled) {
      await SoundManager.playSound('run');
    }

    try {
      // Simuler l'exécution selon le type de fichier
      switch (activeFile.type) {
        case 'js':
          // Pour JavaScript, on pourrait utiliser eval (dangereux) ou un sandbox
          setOutput(prev => prev + '\n// JavaScript execution is not supported in preview mode.\n// Use the export feature to run in a browser.');
          break;

        case 'html':
          setOutput(prev => prev + '\n// HTML preview available in Web view mode.');
          setViewMode('web');
          break;

        case 'css':
          setOutput(prev => prev + '\n// CSS files cannot be run directly.\n// Include them in an HTML file.');
          break;

        case 'py':
          setOutput(prev => prev + '\n// Python execution requires a Python runtime.\n// Export and run on a system with Python installed.');
          break;

        default:
          setOutput(prev => prev + `\n// Cannot execute ${activeFile.type.toUpperCase()} files.`);
      }

      // Utiliser la fonction runFile du store pour partager
      await runFile(activeFile.id);

    } catch (error) {
      setOutput(prev => prev + `\nError: ${error}`);
      if (soundSettings.error.enabled) {
        await SoundManager.playSound('error');
      }
    }

    setIsRunning(false);
  };

  const clearOutput = () => {
    setOutput('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Run & Preview</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
            onPress={handleRun}
            disabled={isRunning || !activeFile}
          >
            <Play size={20} color={isRunning || !activeFile ? colors.muted : colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
            onPress={clearOutput}
          >
            <RefreshCw size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* View Mode Selector */}
      <View style={[styles.viewModeSelector, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'console' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setViewMode('console')}
        >
          <Terminal size={16} color={viewMode === 'console' ? colors.background : colors.primary} />
          <Text style={[
            styles.viewModeText,
            { color: viewMode === 'console' ? colors.background : colors.primary }
          ]}>Console</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'web' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setViewMode('web')}
        >
          <Globe size={16} color={viewMode === 'web' ? colors.background : colors.primary} />
          <Text style={[
            styles.viewModeText,
            { color: viewMode === 'web' ? colors.background : colors.primary }
          ]}>Web</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'mobile' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setViewMode('mobile')}
        >
          <Smartphone size={16} color={viewMode === 'mobile' ? colors.background : colors.primary} />
          <Text style={[
            styles.viewModeText,
            { color: viewMode === 'mobile' ? colors.background : colors.primary }
          ]}>Mobile</Text>
        </TouchableOpacity>
      </View>

      {/* Output Area */}
      <View style={styles.outputContainer}>
        {viewMode === 'console' ? (
          <ScrollView style={[styles.console, { backgroundColor: colors.card }]}>
            <Text style={[styles.consoleText, { color: colors.success }]}>
              {output || '// Console output will appear here\n// Select a file and press Run'}
            </Text>
          </ScrollView>
        ) : (
          <View style={[styles.previewContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.previewText, { color: colors.muted }]}>
              {viewMode === 'web' ? 'Web preview not available in app.\nExport HTML files to view in browser.' : 'Mobile preview coming soon...'}
            </Text>
          </View>
        )}
      </View>

      {/* File Info */}
      {activeFile && (
        <View style={[styles.fileInfo, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <Text style={[styles.fileInfoText, { color: colors.muted }]}>
            Current file: <Text style={{ color: colors.primary }}>{activeFile.name}</Text>
          </Text>
          <Text style={[styles.fileInfoText, { color: colors.muted }]}>
            Type: <Text style={{ color: colors.primary }}>{activeFile.type.toUpperCase()}</Text>
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  viewModeSelector: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
    gap: 4,
  },
  viewModeText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  outputContainer: {
    flex: 1,
  },
  console: {
    flex: 1,
    padding: 16,
  },
  consoleText: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  previewText: {
    fontFamily: 'monospace',
    fontSize: 14,
    textAlign: 'center',
  },
  fileInfo: {
    padding: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fileInfoText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});