import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import {
  Palette,
  Volume2,
  Keyboard,
  Monitor,
  Settings as SettingsIcon,
  Info,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Zap,
  Code,
  VolumeX,
  Music,
  Play,
  Save,
  FileText,
  AlertCircle
} from 'lucide-react-native';
import { useFileStore } from '@/store/fileStore';

export default function SettingsScreen() {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    lineNumbers,
    setLineNumbers,
    wordWrap,
    setWordWrap,
    voiceCommands,
    setVoiceCommands,
    syntaxHighlighting,
    setSyntaxHighlighting,
    autoComplete,
    setAutoComplete,
    bracketMatching,
    setBracketMatching,
    keyboardSize,
    setKeyboardSize,
    soundSettings,
    setSoundEnabled,
    setSoundUri,
    loadSettings,
    saveSettings,
  } = useFileStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Reset all settings to defaults
            setTheme('cyberpunk');
            setFontSize(14);
            setLineNumbers(true);
            setWordWrap(false);
            setVoiceCommands(false);
            setSyntaxHighlighting(true);
            setAutoComplete(true);
            setBracketMatching(true);
            setKeyboardSize(280);

            // Reset all sounds to enabled with no custom URI
            Object.keys(soundSettings).forEach((soundType) => {
              setSoundEnabled(soundType as keyof typeof soundSettings, true);
              setSoundUri(soundType as keyof typeof soundSettings, '');
            });

            Alert.alert('Success', 'Settings reset to defaults');
          }
        }
      ]
    );
  };

  const exportSettings = async () => {
    try {
      await saveSettings();
      Alert.alert('Export Settings', 'Settings exported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to export settings');
    }
  };

  const importSettings = () => {
    Alert.alert('Import Settings', 'Choose a settings file to import');
  };

  const pickSoundFile = async (soundType: keyof typeof soundSettings) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSoundUri(soundType, result.assets[0].uri);
        Alert.alert('Success', `Custom sound set for ${soundType}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick sound file');
    }
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    description: string,
    value: boolean,
    onToggle: () => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#333', true: '#00ff41' }}
        thumbColor={value ? '#fff' : '#666'}
      />
    </View>
  );

  const renderSoundItem = (
    soundType: keyof typeof soundSettings,
    title: string,
    icon: React.ReactNode
  ) => (
    <View style={styles.soundItem}>
      <View style={styles.soundItemLeft}>
        {icon}
        <View style={styles.soundContent}>
          <Text style={styles.soundTitle}>{title}</Text>
          {soundSettings[soundType].uri && (
            <Text style={styles.soundFile}>Custom sound loaded</Text>
          )}
        </View>
      </View>
      <View style={styles.soundControls}>
        <TouchableOpacity
          style={styles.soundButton}
          onPress={() => pickSoundFile(soundType)}
        >
          <Music size={16} color="#00ff41" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.soundButton,
            !soundSettings[soundType].enabled && styles.mutedButton
          ]}
          onPress={() => setSoundEnabled(soundType, !soundSettings[soundType].enabled)}
        >
          {soundSettings[soundType].enabled ? (
            <Volume2 size={16} color="#00ff41" />
          ) : (
            <VolumeX size={16} color="#ff0080" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderThemeOption = (themeName: string, colors: { primary: string, secondary?: string, tertiary?: string }) => (
    <TouchableOpacity
      key={themeName}
      style={[
        styles.themeOption,
        theme === themeName && styles.selectedTheme
      ]}
      onPress={() => setTheme(themeName)}
    >
      <View style={styles.themeColors}>
        <View style={[styles.themeColor, { backgroundColor: colors.primary, flex: 1 }]} />
        {colors.secondary && <View style={[styles.themeColor, { backgroundColor: colors.secondary, flex: 1 }]} />}
        {colors.tertiary && <View style={[styles.themeColor, { backgroundColor: colors.tertiary, flex: 1 }]} />}
      </View>
      <Text style={[
        styles.themeText,
        theme === themeName && styles.selectedThemeText
      ]}>
        {themeName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Matriss Editor</Text>
        <SettingsIcon size={24} color="#00ff41" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Palette size={20} color="#00ff41" /> Theme
          </Text>

          <View style={styles.themeContainer}>
            {renderThemeOption('cyberpunk', { primary: '#00ff41', secondary: '#ff0080' })}
            {renderThemeOption('neon', { primary: '#fffb00', secondary: '#ff00c8' })}
            {renderThemeOption('matrix', { primary: '#00ff41' })}
            {renderThemeOption('blade runner', { primary: '#ff6600', secondary: '#fffb00' })}
            {renderThemeOption('neon-orange', { primary: '#ffe066', secondary: '#4fd3ff' })}
            {renderThemeOption('cyan-red', { primary: '#00ffff', secondary: '#ff0040' })}
            {renderThemeOption('gold-red', { primary: '#ffd700', secondary: '#ff0040' })}
            {renderThemeOption('gold-red-cyan', { primary: '#ffd700', secondary: '#ff0040', tertiary: '#00ffff' })}
          </View>
        </View>

        {/* Sound Effects Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Volume2 size={20} color="#00ff41" /> Sound Effects
          </Text>

          <View style={styles.soundsList}>
            {renderSoundItem('keyPress', 'Key Press', <Keyboard size={16} color="#00ff41" />)}
            {renderSoundItem('tabSwitch', 'Tab Switch', <FileText size={16} color="#00ff41" />)}
            {renderSoundItem('pageChange', 'Page Change', <Monitor size={16} color="#00ff41" />)}
            {renderSoundItem('save', 'Save File', <Save size={16} color="#00ff41" />)}
            {renderSoundItem('run', 'Run Code', <Play size={16} color="#00ff41" />)}
            {renderSoundItem('delete', 'Delete', <Trash2 size={16} color="#00ff41" />)}
            {renderSoundItem('error', 'Error', <AlertCircle size={16} color="#00ff41" />)}
          </View>
        </View>

        {/* Editor Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Code size={20} color="#00ff41" /> Editor
          </Text>

          {renderSettingItem(
            <Eye size={20} color="#00ff41" />,
            'Line Numbers',
            'Show line numbers in the editor',
            lineNumbers,
            () => setLineNumbers(!lineNumbers)
          )}

          {renderSettingItem(
            <Monitor size={20} color="#00ff41" />,
            'Word Wrap',
            'Wrap long lines in the editor',
            wordWrap,
            () => setWordWrap(!wordWrap)
          )}

          {renderSettingItem(
            <Palette size={20} color="#00ff41" />,
            'Syntax Highlighting',
            'Enable syntax highlighting for code',
            syntaxHighlighting,
            () => setSyntaxHighlighting(!syntaxHighlighting)
          )}

          {renderSettingItem(
            <Code size={20} color="#00ff41" />,
            'Auto Complete',
            'Show code completion suggestions',
            autoComplete,
            () => setAutoComplete(!autoComplete)
          )}

          {renderSettingItem(
            <Monitor size={20} color="#00ff41" />,
            'Bracket Matching',
            'Highlight matching brackets',
            bracketMatching,
            () => setBracketMatching(!bracketMatching)
          )}
        </View>

        {/* Input Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Keyboard size={20} color="#00ff41" /> Input
          </Text>

          {renderSettingItem(
            <Volume2 size={20} color="#00ff41" />,
            'Voice Commands',
            'Enable voice input for coding',
            voiceCommands,
            () => setVoiceCommands(!voiceCommands)
          )}

          {/* Keyboard Size Slider */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Keyboard Size: {keyboardSize}px</Text>
            <View style={styles.sliderButtons}>
              {[200, 240, 280, 320, 360].map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    keyboardSize === size && styles.selectedSizeButton
                  ]}
                  onPress={() => setKeyboardSize(size)}
                >
                  <Text style={[
                    styles.sizeButtonText,
                    keyboardSize === size && styles.selectedSizeButtonText
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Font Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Font Size</Text>

          <View style={styles.fontSizeContainer}>
            {[10, 12, 14, 16, 18, 20].map(size => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontSizeOption,
                  fontSize === size && styles.selectedFontSize
                ]}
                onPress={() => setFontSize(size)}
              >
                <Text style={[
                  styles.fontSizeText,
                  { fontSize: size },
                  fontSize === size && styles.selectedFontSizeText
                ]}>
                  {size}px
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={exportSettings}>
              <Download size={20} color="#00ff41" />
              <Text style={styles.actionButtonText}>Export Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={importSettings}>
              <Upload size={20} color="#00ff41" />
              <Text style={styles.actionButtonText}>Import Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={resetToDefaults}
            >
              <Trash2 size={20} color="#ff0080" />
              <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
                Reset to Defaults
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Info size={20} color="#00ff41" /> About
          </Text>

          <View style={styles.aboutContainer}>
            <Text style={styles.aboutText}>Matriss Editor</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutDescription}>
              Click'n Build Designer - A cyberpunk-themed code editor for mobile devices with advanced features
              including syntax highlighting, voice commands, and multi-file support.
            </Text>
          </View>
        </View>
      </ScrollView>
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
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff41',
    fontFamily: 'monospace',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff41',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  settingDescription: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  soundsList: {
    gap: 8,
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  soundItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  soundContent: {
    marginLeft: 12,
    flex: 1,
  },
  soundTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  soundFile: {
    color: '#666',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  soundControls: {
    flexDirection: 'row',
    gap: 8,
  },
  soundButton: {
    padding: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  mutedButton: {
    backgroundColor: '#1a0010',
    borderColor: '#ff0080',
  },
  themeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeOption: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    flex: 1,
    minWidth: '45%',
  },
  selectedTheme: {
    borderColor: '#00ff41',
    backgroundColor: '#001a0a',
  },
  themeColors: {
    flexDirection: 'row',
    width: '100%',
    height: 20,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  themeColor: {
    height: '100%',
  },
  themeText: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  selectedThemeText: {
    color: '#00ff41',
  },
  sliderContainer: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  sliderLabel: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  sizeButton: {
    flex: 1,
    padding: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  selectedSizeButton: {
    backgroundColor: '#001a0a',
    borderColor: '#00ff41',
  },
  sizeButtonText: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  selectedSizeButtonText: {
    color: '#00ff41',
  },
  fontSizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fontSizeOption: {
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 60,
    alignItems: 'center',
  },
  selectedFontSize: {
    borderColor: '#00ff41',
    backgroundColor: '#001a0a',
  },
  fontSizeText: {
    color: '#ccc',
    fontFamily: 'monospace',
  },
  selectedFontSizeText: {
    color: '#00ff41',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  dangerButton: {
    borderColor: '#ff0080',
    backgroundColor: '#1a0010',
  },
  actionButtonText: {
    color: '#00ff41',
    fontSize: 16,
    fontFamily: 'monospace',
    marginLeft: 8,
  },
  dangerButtonText: {
    color: '#ff0080',
  },
  aboutContainer: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  aboutText: {
    color: '#00ff41',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  aboutVersion: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  aboutDescription: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});