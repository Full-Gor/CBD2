import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { X, FileText, FileCode, FileJson, Image, Music, Video } from 'lucide-react-native';
import { useFileStore } from '@/store/fileStore';
import { SoundManager } from '@/utils/soundManager';

export function FileTabsBar() {
  const {
    openFiles,
    activeFileId,
    setActiveFile,
    closeFile,
    theme,
    soundSettings
  } = useFileStore();

  // Charger les sons
  useEffect(() => {
    if (soundSettings) {
      SoundManager.loadAllSounds(soundSettings, ['tabSwitch', 'delete']);
    }

    return () => {
      SoundManager.unloadAllSounds();
    };
  }, [soundSettings]);

  const playTabSwitchSound = async () => {
    if (soundSettings.tabSwitch.enabled) {
      await SoundManager.playSound('tabSwitch');
    }
  };

  const playDeleteSound = async () => {
    if (soundSettings.delete.enabled) {
      await SoundManager.playSound('delete');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'html':
      case 'css':
      case 'php':
        return <FileCode size={14} color={colors.icon} />;
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileCode size={14} color={colors.icon} />;
      case 'json':
        return <FileJson size={14} color={colors.icon} />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <Image size={14} color={colors.icon} />;
      case 'mp3':
        return <Music size={14} color={colors.icon} />;
      case 'mp4':
        return <Video size={14} color={colors.icon} />;
      default:
        return <FileText size={14} color={colors.icon} />;
    }
  };

  const handleTabPress = (fileId: string) => {
    if (fileId !== activeFileId) {
      playTabSwitchSound();
      setActiveFile(fileId);
    }
  };

  const handleCloseTab = (e: any, fileId: string) => {
    e.stopPropagation();
    playDeleteSound();
    closeFile(fileId);
  };

  // Définir les couleurs par thème
  const THEME_COLORS = {
    cyberpunk: {
      activeTab: '#001a0a',
      activeBorder: '#00ff41',
      activeText: '#00ff41',
      inactiveTab: '#1a1a1a',
      inactiveText: '#666',
      icon: '#00ff41',
      closeIcon: '#ff0080',
    },
    neon: {
      activeTab: '#1a001a',
      activeBorder: '#fffb00',
      activeText: '#fffb00',
      inactiveTab: '#1a1a1a',
      inactiveText: '#666',
      icon: '#ff00c8',
      closeIcon: '#ff00c8',
    },
    matrix: {
      activeTab: '#001a00',
      activeBorder: '#00ff41',
      activeText: '#00ff41',
      inactiveTab: '#0a1a0a',
      inactiveText: '#003300',
      icon: '#00ff41',
      closeIcon: '#00ff41',
    },
    'blade runner': {
      activeTab: '#1a0600',
      activeBorder: '#ff6600',
      activeText: '#ff6600',
      inactiveTab: '#1a0a0a',
      inactiveText: '#666',
      icon: '#fffb00',
      closeIcon: '#ff0080',
    },
    'neon-orange': {
      activeTab: '#1a0f00',
      activeBorder: '#ffe066',
      activeText: '#ffe066',
      inactiveTab: '#1a1a1a',
      inactiveText: '#666',
      icon: '#4fd3ff',
      closeIcon: '#ff9500',
    },
    'cyan-red': {
      activeTab: '#001a1a',
      activeBorder: '#00ffff',
      activeText: '#00ffff',
      inactiveTab: '#1a1a1a',
      inactiveText: '#666',
      icon: '#00ffff',
      closeIcon: '#ff0040',
    },
    'gold-red': {
      activeTab: '#1a1300',
      activeBorder: '#ffd700',
      activeText: '#ffd700',
      inactiveTab: '#1a1a1a',
      inactiveText: '#666',
      icon: '#ffd700',
      closeIcon: '#ff0040',
    },
    'gold-red-cyan': {
      activeTab: '#1a1300',
      activeBorder: '#ffd700',
      activeText: '#ffd700',
      inactiveTab: '#1a1a1a',
      inactiveText: '#666',
      icon: '#00ffff',
      closeIcon: '#ff0040',
    },
    'neon-genesis': {
      activeTab: '#1a0a2e',
      activeBorder: '#a020f0',
      activeText: '#a020f0',
      inactiveTab: '#1a1a1a',
      inactiveText: '#4b0082',
      icon: '#00ff00',
      closeIcon: '#ff1493',
    },
  };

  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.cyberpunk;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {openFiles.map((file) => (
          <TouchableOpacity
            key={file.id}
            style={[
              styles.tab,
              activeFileId === file.id ? {
                backgroundColor: colors.activeTab,
                borderBottomColor: colors.activeBorder,
              } : {
                backgroundColor: colors.inactiveTab,
              }
            ]}
            onPress={() => handleTabPress(file.id)}
          >
            <View style={styles.tabContent}>
              {getFileIcon(file.type)}
              <Text
                style={[
                  styles.tabText,
                  { color: activeFileId === file.id ? colors.activeText : colors.inactiveText }
                ]}
                numberOfLines={1}
              >
                {file.name}
              </Text>
              {file.isModified && (
                <View style={[styles.modifiedDot, { backgroundColor: colors.activeText }]} />
              )}
              <TouchableOpacity
                onPress={(e) => handleCloseTab(e, file.id)}
                style={styles.closeButton}
              >
                <X size={14} color={colors.closeIcon} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#333',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    minWidth: 100,
    maxWidth: 200,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'monospace',
    flex: 1,
  },
  modifiedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  closeButton: {
    padding: 4,
    marginLeft: 4,
  },
});