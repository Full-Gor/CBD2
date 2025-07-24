import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

interface MatrixRainProps {
  color?: string;
}

interface Char {
  value: string;
  key: number;
}

interface Trail {
  chars: Char[];
  size: number;
  offset: Animated.Value;
  animatedOpacities: Animated.Value[];
}

interface MatrixColumn {
  x: number;
  trail: Trail;
  dropAnimation: Animated.Value;
}

// Fonctions utilitaires
function r(from: number, to: number): number {
  return ~~(Math.random() * (to - from + 1) + from);
}

function pick(...args: any[]): any {
  return args[r(0, args.length - 1)];
}

function getChar(): string {
  const charSets = [
    () => String.fromCharCode(r(0x3041, 0x30ff)), // Caractères japonais (Hiragana + Katakana)
    () => String.fromCharCode(r(0x2000, 0x206f)), // Ponctuation générale
    () => String.fromCharCode(r(0x0020, 0x003f))  // ASCII basique
  ];
  
  return pick(...charSets)();
}

export function MatrixRain({ color = '#9bff9b' }: MatrixRainProps) {
  const { width, height } = Dimensions.get('window');
  const [columns, setColumns] = useState<MatrixColumn[]>([]);
  
  const fontSize = 16;
  const columnWidth = fontSize;
  const numColumns = Math.floor(width / columnWidth);
  const rowCount = 30; // Réduit de 50 à 30 pour les performances

  useEffect(() => {
    console.log('MatrixRain: Initializing optimized Japanese animation');
    
    const newColumns: MatrixColumn[] = [];
    
    // Réduire le nombre de colonnes pour améliorer les performances
    const maxColumns = Math.min(numColumns, 15); // Limite à 15 colonnes au lieu de 50
    
    for (let i = 0; i < maxColumns; i++) {
      // Créer les caractères
      const chars: Char[] = [];
      for (let j = 0; j < rowCount; j++) {
        chars.push({
          value: getChar(),
          key: Math.random()
        });
      }

      // Créer la traînée
      const trailSize = r(8, 20); // Réduit de 10-30 à 8-20
      const animatedOpacities: Animated.Value[] = [];
      
      for (let j = 0; j < trailSize; j++) {
        animatedOpacities.push(new Animated.Value(0));
      }

      const trail: Trail = {
        chars,
        size: trailSize,
        offset: new Animated.Value(r(0, 100)),
        animatedOpacities
      };

      const dropAnimation = new Animated.Value(0);

      newColumns.push({
        x: i * columnWidth,
        trail,
        dropAnimation
      });

      // Animation de chute optimisée
      const delay = r(20, 60); // Plus lent pour réduire la charge
      const animateColumn = () => {
        // Animer l'offset pour faire défiler la traînée
        Animated.loop(
          Animated.timing(trail.offset, {
            toValue: chars.length + trail.size - 1,
            duration: delay * chars.length * 2, // Plus lent
            useNativeDriver: false,
          })
        ).start();

        // Mutation aléatoire des caractères (réduite)
        chars.forEach((char, index) => {
          if (Math.random() < 0.3) { // Réduit de 0.5 à 0.3
            setInterval(() => {
              char.value = getChar();
              char.key = Math.random();
            }, r(2000, 8000)); // Plus lent (2-8s au lieu de 1-5s)
          }
        });
      };

      // Démarrer avec un délai aléatoire
      setTimeout(() => animateColumn(), Math.random() * 3000);
    }
    
    console.log('MatrixRain: Created', newColumns.length, 'optimized Japanese columns');
    setColumns(newColumns);
  }, [width, height, numColumns]);

  const renderColumn = (column: MatrixColumn, columnIndex: number) => {
    const { trail } = column;
    
    return (
      <View key={columnIndex} style={[styles.column, { left: column.x }]}>
        {trail.chars.map((char, charIndex) => {
          // Calculer l'opacité basée sur la position dans la traînée
          const opacity = trail.offset.interpolate({
            inputRange: [
              charIndex - trail.size,
              charIndex - trail.size + 1,
              charIndex,
              charIndex + 1
            ],
            outputRange: [0, 0.1, 0.85, 0],
            extrapolate: 'clamp'
          });

          // Calculer la luminosité pour le dégradé
          const isLastInTrail = trail.offset.interpolate({
            inputRange: [
              charIndex - 1,
              charIndex,
              charIndex + 1
            ],
            outputRange: [0, 1, 0],
            extrapolate: 'clamp'
          });

          return (
            <Animated.Text
              key={char.key}
              style={[
                styles.char,
                {
                  opacity,
                  color,
                  fontSize,
                  transform: [{
                    scale: isLastInTrail.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.2]
                    })
                  }],
                  // Effet de lueur pour le dernier caractère
                  textShadowColor: '#fff',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: isLastInTrail.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 5]
                  })
                }
              ]}
            >
              {char.value}
            </Animated.Text>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {columns.map(renderColumn)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  column: {
    position: 'absolute',
    top: 0,
    flexDirection: 'column',
  },
  char: {
    textAlign: 'center',
    fontFamily: 'monospace',
    lineHeight: 16,
    height: 16,
    width: 16,
  },
});