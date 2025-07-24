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
  const [letters, setLetters] = useState<string[]>([]);

  useEffect(() => {
    // Diviser le texte en lettres
    setLetters(text.split(''));

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

    // Animation glitch continue
    const glitchAnimation = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glitchOffset1, {
            toValue: Math.random() * 4 - 2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(glitchOffset2, {
            toValue: Math.random() * 4 - 2,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glitchOffset1, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(glitchOffset2, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setTimeout(glitchAnimation, Math.random() * 2000 + 500);
      });
    };

    glitchAnimation();
  }, [text]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        {letters.map((letter, index) => (
          <Animated.View
            key={index}
            style={{
              opacity: opacity,
              transform: [{ translateX: 0 }],
            }}
          >
            {/* Texte principal */}
            <Text style={[styles.mainText, { color, fontSize }]}>
              {letter}
            </Text>
            
            {/* Couche glitch 1 */}
            <Animated.Text
              style={[
                styles.glitchLayer,
                {
                  color: '#00fffc',
                  fontSize,
                  transform: [
                    { translateX: glitchOffset1 },
                    { translateY: -1 },
                  ],
                },
              ]}
            >
              {letter}
            </Animated.Text>
            
            {/* Couche glitch 2 */}
            <Animated.Text
              style={[
                styles.glitchLayer,
                {
                  color: '#fc00ff',
                  fontSize,
                  transform: [
                    { translateX: glitchOffset2 },
                    { translateY: 1 },
                  ],
                },
              ]}
            >
              {letter}
            </Animated.Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
  },
  mainText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  glitchLayer: {
    position: 'absolute',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    opacity: 0.7,
  },
});