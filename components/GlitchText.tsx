import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface GlitchTextProps {
  text: string;
  color?: string;
  fontSize?: number;
  style?: any;
}

export function GlitchText({ text, color = '#00ff41', fontSize = 24, style }: GlitchTextProps) {
  const [glitchOffset1] = useState(new Animated.Value(0));
  const [glitchOffset2] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0));
  const letters = text.split('');

  useEffect(() => {
    // Animation d'apparition lettre par lettre
    letters.forEach((_, index) => {
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, index * 200);
    });

    // Animation de glitch continue
    const startGlitch = () => {
      Animated.sequence([
        Animated.timing(glitchOffset1, {
          toValue: 2,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(glitchOffset1, {
          toValue: -2,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(glitchOffset1, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.sequence([
        Animated.timing(glitchOffset2, {
          toValue: -2,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(glitchOffset2, {
          toValue: 2,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(glitchOffset2, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Démarrer l'effet glitch après l'apparition
    const glitchDelay = letters.length * 200 + 1000;
    setTimeout(() => {
      const glitchInterval = setInterval(startGlitch, 2000 + Math.random() * 3000);
      return () => clearInterval(glitchInterval);
    }, glitchDelay);

  }, [letters.length, glitchOffset1, glitchOffset2, opacity]);

  return (
    <View style={[styles.container, style]}>
      {/* Texte principal */}
      <Animated.Text
        style={[
          styles.text,
          {
            color,
            fontSize,
            opacity,
            transform: [{ translateX: glitchOffset1 }],
          },
        ]}
      >
        {text}
      </Animated.Text>

      {/* Couche glitch rouge */}
      <Animated.Text
        style={[
          styles.glitchLayer,
          {
            color: '#ff0000',
            fontSize,
            opacity: 0.8,
            transform: [{ translateX: glitchOffset2 }],
          },
        ]}
      >
        {text}
      </Animated.Text>

      {/* Couche glitch bleue */}
      <Animated.Text
        style={[
          styles.glitchLayer,
          {
            color: '#00ffff',
            fontSize,
            opacity: 0.8,
            transform: [{ translateX: glitchOffset1 }],
          },
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  glitchLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 