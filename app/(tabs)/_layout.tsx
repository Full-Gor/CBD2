import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { FileCode, FolderOpen, Play, Settings } from 'lucide-react-native';
import { useFileStore } from '@/store/fileStore';

export default function TabLayout() {
  const theme = useFileStore(state => state.theme);

  // Couleurs des tabs selon le thème
  const getTabColors = () => {
    const themes = {
      cyberpunk: { active: '#00ff41', inactive: '#666' },
      neon: { active: '#fffb00', inactive: '#666' },
      matrix: { active: '#00ff41', inactive: '#003300' },
      'blade runner': { active: '#ff6600', inactive: '#666' },
      'neon-orange': { active: '#ffe066', inactive: '#666' },
      'cyan-red': { active: '#00ffff', inactive: '#666' },
      'gold-red': { active: '#ffd700', inactive: '#666' },
      'gold-red-cyan': { active: '#ffd700', inactive: '#666' },
      'neon-genesis': { active: '#a020f0', inactive: '#4b0082' },
    };

    return themes[theme as keyof typeof themes] || themes.cyberpunk;
  };

  const colors = getTabColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#333',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Editor',
          tabBarIcon: ({ color }) => <FileCode size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: 'Files',
          tabBarIcon: ({ color }) => <FolderOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="run"
        options={{
          title: 'Run',
          tabBarIcon: ({ color }) => <Play size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}