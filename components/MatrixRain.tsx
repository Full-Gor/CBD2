import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

interface MatrixRainProps {
    color?: string;
}

interface MatrixColumn {
    x: number;
    y: Animated.Value;
    chars: string[];
    speed: number;
}

export function MatrixRain({ color = '#00ff41' }: MatrixRainProps) {
    const { width, height } = Dimensions.get('window');
    const [columns, setColumns] = useState<MatrixColumn[]>([]);

    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const fontSize = 16;
    const columnWidth = fontSize;
    const numColumns = Math.floor(width / columnWidth);

    useEffect(() => {
        // Créer les colonnes
        const newColumns: MatrixColumn[] = [];

        for (let i = 0; i < numColumns; i++) {
            const chars: string[] = [];
            const charCount = Math.floor(height / fontSize) + 10;

            for (let j = 0; j < charCount; j++) {
                chars.push(matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)));
            }

            const animatedY = new Animated.Value(-charCount * fontSize);
            const speed = 4000 + Math.random() * 6000;

            newColumns.push({
                x: i * columnWidth,
                y: animatedY,
                chars,
                speed
            });

            // Animation de chute
            const animateColumn = () => {
                animatedY.setValue(-charCount * fontSize);
                Animated.timing(animatedY, {
                    toValue: height,
                    duration: speed,
                    useNativeDriver: true,
                }).start(() => {
                    // Réinitialiser et recommencer
                    animateColumn();
                });
            };

            // Démarrer avec un délai aléatoire
            setTimeout(() => animateColumn(), Math.random() * 4000);
        }

        setColumns(newColumns);
    }, [width, height, numColumns]);

    return (
        <View style={styles.container} pointerEvents="none">
            {columns.map((column, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.column,
                        {
                            left: column.x,
                            transform: [{ translateY: column.y }],
                        }
                    ]}
                >
                    {column.chars.map((char, charIndex) => (
                        <Text
                            key={charIndex}
                            style={[
                                styles.char,
                                {
                                    color: color,
                                    opacity: 0.3 + (1 - (charIndex / column.chars.length)) * 0.7,
                                    fontSize,
                                }
                            ]}
                        >
                            {char}
                        </Text>
                    ))}
                </Animated.View>
            ))}
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
        zIndex: 1,
    },
    column: {
        position: 'absolute',
        top: 0,
    },
    char: {
        fontFamily: 'monospace',
    },
});