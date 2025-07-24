import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFileStore } from '@/store/fileStore';

interface AutoCompleteProps {
  currentWord: string;
  onSelect: (suggestion: string) => void;
  onClose: () => void;
  fileType: string;
}

const SUGGESTIONS = {
  js: {
    console: ['console.log()', 'console.error()', 'console.warn()', 'console.info()', 'console.table()'],
    document: ['document.getElementById()', 'document.querySelector()', 'document.querySelectorAll()', 'document.createElement()'],
    array: ['array.map()', 'array.filter()', 'array.reduce()', 'array.forEach()', 'array.find()', 'array.findIndex()'],
    string: ['string.length', 'string.charAt()', 'string.indexOf()', 'string.slice()', 'string.split()', 'string.replace()'],
    math: ['Math.floor()', 'Math.ceil()', 'Math.round()', 'Math.random()', 'Math.max()', 'Math.min()'],
  },
  jsx: {
    react: ['React.useState()', 'React.useEffect()', 'React.useContext()', 'React.useReducer()', 'React.useCallback()', 'React.useMemo()'],
    use: ['useState()', 'useEffect()', 'useContext()', 'useReducer()', 'useCallback()', 'useMemo()', 'useRef()'],
  },
  ts: {
    interface: ['interface Name {\n\t\n}', 'interface Props {\n\t\n}'],
    type: ['type Name = ', 'type Props = {\n\t\n}'],
    enum: ['enum Name {\n\t\n}'],
  },
  html: {
    div: ['<div></div>', '<div class="">', '<div id="">'],
    input: ['<input type="text" />', '<input type="email" />', '<input type="password" />', '<input type="number" />'],
    button: ['<button></button>', '<button type="submit">', '<button onclick="">'],
  },
  css: {
    display: ['display: flex;', 'display: grid;', 'display: block;', 'display: inline-block;', 'display: none;'],
    position: ['position: relative;', 'position: absolute;', 'position: fixed;', 'position: sticky;'],
    flex: ['flex-direction: row;', 'flex-direction: column;', 'justify-content: center;', 'align-items: center;'],
  },
  py: {
    def: ['def function_name():\n\t', 'def __init__(self):\n\t'],
    class: ['class ClassName:\n\t', 'class ClassName(object):\n\t'],
    import: ['import ', 'from module import ', 'import numpy as np', 'import pandas as pd'],
  },
  php: {
    function: ['function functionName() {\n\t\n}', 'public function ', 'private function ', 'protected function '],
    class: ['class ClassName {\n\t\n}', 'class ClassName extends '],
    echo: ['echo "";', 'echo $variable;'],
  },
};

export function AutoComplete({ currentWord, onSelect, onClose, fileType }: AutoCompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { theme } = useFileStore();

  useEffect(() => {
    if (currentWord.length < 2) {
      setSuggestions([]);
      return;
    }

    const fileSuggestions = SUGGESTIONS[fileType as keyof typeof SUGGESTIONS] || {};
    const matchingSuggestions: string[] = [];

    Object.keys(fileSuggestions).forEach(key => {
      if (key.toLowerCase().startsWith(currentWord.toLowerCase())) {
        matchingSuggestions.push(...fileSuggestions[key as keyof typeof fileSuggestions]);
      }
    });

    // Also check individual suggestions
    Object.values(fileSuggestions).forEach(suggestionArray => {
      suggestionArray.forEach(suggestion => {
        if (suggestion.toLowerCase().includes(currentWord.toLowerCase()) &&
          !matchingSuggestions.includes(suggestion)) {
          matchingSuggestions.push(suggestion);
        }
      });
    });

    setSuggestions(matchingSuggestions.slice(0, 5));
  }, [currentWord, fileType]);

  if (suggestions.length === 0) {
    return null;
  }

  const THEME_COLORS = {
    cyberpunk: {
      background: '#1a1a1a',
      border: '#00ff41',
      text: '#00ff41',
      hover: '#001a0a',
    },
    neon: {
      background: '#1a1a1a',
      border: '#ff00c8',
      text: '#fffb00',
      hover: '#1a001a',
    },
    matrix: {
      background: '#0a1a0a',
      border: '#00ff41',
      text: '#00ff41',
      hover: '#001a00',
    },
    'blade runner': {
      background: '#1a0a0a',
      border: '#ff6600',
      text: '#ff6600',
      hover: '#1a0600',
    },
    'neon-orange': {
      background: '#1a1a1a',
      border: '#ff9500',
      text: '#ffe066',
      hover: '#1a0f00',
    },
    'cyan-red': {
      background: '#1a1a1a',
      border: '#ff0040',
      text: '#00ffff',
      hover: '#1a0010',
    },
    'gold-red': {
      background: '#1a1a1a',
      border: '#ff0040',
      text: '#ffd700',
      hover: '#1a0010',
    },
    'gold-red-cyan': {
      background: '#1a1a1a',
      border: '#00ffff',
      text: '#ffd700',
      hover: '#001a1a',
    },
    'neon-genesis': {
      background: '#1a1a1a',
      border: '#a020f0',
      text: '#00ff00',
      hover: '#1a0a2e',
    },
  };

  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.cyberpunk;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <ScrollView>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.suggestion, { backgroundColor: colors.hover }]}
            onPress={() => {
              onSelect(suggestion);
              onClose();
            }}
          >
            <Text style={[styles.suggestionText, { color: colors.text }]}>
              {suggestion}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    maxHeight: 200,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  suggestionText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
});