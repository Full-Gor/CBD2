import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text, TouchableOpacity, Pressable } from 'react-native';
import { useFileStore, FileData } from '@/store/fileStore';
import { SyntaxHighlighter } from './SyntaxHighlighter';
import { AutoComplete } from './AutoComplete';
import { SnippetSelector } from './SnippetSelector';
import { Eye, EyeOff, Lightbulb } from 'lucide-react-native';

interface CodeEditorProps {
  file: FileData;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function CodeEditor({ file, onFocus, onBlur }: CodeEditorProps) {
  const {
    updateFileContent,
    theme,
    syntaxHighlighting,
    fontSize,
    lineNumbers,
    wordWrap,
    autoComplete,
    bracketMatching
  } = useFileStore();

  const [cursorPosition, setCursorPosition] = useState(0);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [showSnippetSelector, setShowSnippetSelector] = useState(false);
  const [selectedSnippetCategory, setSelectedSnippetCategory] = useState('');
  const textInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Focus automatiquement le TextInput au montage
  useEffect(() => {
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  }, []);

  const handleContentChange = (text: string) => {
    updateFileContent(file.id, text);

    // Auto-complete logic
    if (autoComplete) {
      const beforeCursor = text.substring(0, cursorPosition);
      const words = beforeCursor.split(/[\s\(\)\[\]\{\}\<\>\=\+\-\*\/\&\|\!\?\:\;\,\.\"\']/);
      const lastWord = words[words.length - 1];

      if (lastWord.length > 1) {
        setCurrentWord(lastWord);
        setShowAutoComplete(true);
      } else {
        setShowAutoComplete(false);
      }
    }

    // Bracket matching logic
    if (bracketMatching) {
      // This would be implemented with highlighting logic
    }
  };

  const handleSelectionChange = (event: any) => {
    const { start, end } = event.nativeEvent.selection;
    setSelection({ start, end });
    setCursorPosition(start);
  };

  const getLineNumbers = () => {
    const lines = file.content.split('\n');
    return lines.map((_, index) => index + 1);
  };

  const insertSnippet = (snippet: string) => {
    const beforeCursor = file.content.substring(0, selection.start);
    const afterCursor = file.content.substring(selection.end);
    const newContent = beforeCursor + snippet + afterCursor;
    updateFileContent(file.id, newContent);

    // Move cursor to end of snippet
    const newCursorPosition = selection.start + snippet.length;
    setTimeout(() => {
      if (textInputRef.current) {
        // Pour React Native
        textInputRef.current.setSelection?.(newCursorPosition, newCursorPosition);
        // Alternative pour focus
        textInputRef.current.focus();
      }
    }, 100);
  };

  const getSnippetsForFileType = () => {
    switch (file.type) {
      case 'html':
        return [
          { name: 'HTML5', snippet: '<!DOCTYPE html>\n<html lang="fr">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>Document</title>\n</head>\n<body>\n\t\n</body>\n</html>' },
          { name: 'Cards', category: 'card' },
          { name: 'Boutons', category: 'button' },
          { name: 'Navigation', category: 'navbar' },
          { name: 'Footers', category: 'footer' },
          { name: 'Formulaires', category: 'form' },
          { name: 'Liens CSS/JS', category: 'links' },
          { name: 'Meta Tags', category: 'meta' }
        ];
      case 'css':
        return [
          { name: 'Flexbox', snippet: 'display: flex;\njustify-content: center;\nalign-items: center;' },
          { name: 'Grid', snippet: 'display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 1rem;' },
          { name: 'Animation', snippet: '@keyframes fadeIn {\n\tfrom { opacity: 0; transform: translateY(20px); }\n\tto { opacity: 1; transform: translateY(0); }\n}' }
        ];
      case 'js':
      case 'jsx':
        return [
          { name: 'Function', snippet: 'function functionName() {\n\t\n}' },
          { name: 'Arrow Function', snippet: 'const functionName = () => {\n\t\n};' },
          { name: 'Fetch API', snippet: 'fetch("/api/data")\n\t.then(response => response.json())\n\t.then(data => {\n\t\tconsole.log(data);\n\t});' }
        ];
      default:
        return [];
    }
  };

  // Zone cliquable pour forcer le focus
  const handleEditorPress = () => {
    textInputRef.current?.focus();
    if (onFocus) onFocus();
  };

  // Définir les couleurs par thème pour l'éditeur
  const THEME_COLORS = {
    cyberpunk: {
      snippetButton: '#00ff41',
      snippetBorder: '#00ff41',
      lineNumber: '#666',
      selection: '#00ff41',
    },
    neon: {
      snippetButton: '#fffb00',
      snippetBorder: '#ff00c8',
      lineNumber: '#ff00c8',
      selection: '#fffb00',
    },
    matrix: {
      snippetButton: '#00ff41',
      snippetBorder: '#00ff41',
      lineNumber: '#003300',
      selection: '#00ff41',
    },
    'blade runner': {
      snippetButton: '#ff6600',
      snippetBorder: '#fffb00',
      lineNumber: '#666',
      selection: '#ff6600',
    },
    'neon-orange': {
      snippetButton: '#ffe066',
      snippetBorder: '#4fd3ff',
      lineNumber: '#666',
      selection: '#ffe066',
    },
    'cyan-red': {
      snippetButton: '#00ffff',
      snippetBorder: '#ff0040',
      lineNumber: '#666',
      selection: '#00ffff',
    },
    'gold-red': {
      snippetButton: '#ffd700',
      snippetBorder: '#ff0040',
      lineNumber: '#666',
      selection: '#ffd700',
    },
    'gold-red-cyan': {
      snippetButton: '#ffd700',
      snippetBorder: '#00ffff',
      lineNumber: '#666',
      selection: '#ffd700',
    },
  };

  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.cyberpunk;

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolbarButton, lineNumbers && styles.activeToolbarButton]}
          onPress={() => useFileStore.getState().setLineNumbers(!lineNumbers)}
        >
          {lineNumbers ? <Eye size={16} color="#00ff41" /> : <EyeOff size={16} color="#666" />}
          <Text style={styles.toolbarButtonText}>Lines</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.snippetsScroll}>
          <View style={styles.snippetsContainer}>
            {getSnippetsForFileType().map((snippet, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.snippetButton,
                  {
                    borderColor: colors.snippetBorder,
                    backgroundColor: colors.snippetBorder + '1a'
                  }
                ]}
                onPress={() => {
                  if (snippet.category) {
                    setSelectedSnippetCategory(snippet.category);
                    setShowSnippetSelector(true);
                  } else if (snippet.snippet) {
                    insertSnippet(snippet.snippet);
                  }
                }}
              >
                <Text style={[styles.snippetButtonText, { color: colors.snippetButton }]}>
                  {snippet.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <Pressable style={styles.editorContainer} onPress={handleEditorPress}>
        <View style={styles.editorRow}>
          {lineNumbers && (
            <View style={styles.lineNumbers}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                ref={scrollViewRef}
                scrollEnabled={false}
              >
                {getLineNumbers().map((lineNumber) => (
                  <Text
                    key={lineNumber}
                    style={[
                      styles.lineNumber,
                      {
                        color: colors.lineNumber,
                        lineHeight: fontSize * 1.3
                      }
                    ]}
                  >
                    {lineNumber}
                  </Text>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.codeContainer}>
            <ScrollView
              horizontal={!wordWrap}
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.verticalScroll}
                onScroll={(event) => {
                  if (scrollViewRef.current && lineNumbers) {
                    scrollViewRef.current.scrollTo({
                      y: event.nativeEvent.contentOffset.y,
                      animated: false
                    });
                  }
                }}
                scrollEventThrottle={16}
              >
                <View style={[
                  styles.codeInputContainer,
                  wordWrap && { width: '100%' }
                ]}>
                  <View style={styles.syntaxHighlighterContainer}>
                    <SyntaxHighlighter
                      code={file.content}
                      language={file.type}
                      style={styles.syntaxHighlighter}
                      theme={theme}
                      syntaxHighlighting={syntaxHighlighting}
                      fontSize={fontSize}
                    />
                  </View>
                  <TextInput
                    ref={textInputRef}
                    style={[
                      styles.codeInput,
                      {
                        fontSize,
                        lineHeight: fontSize * 1.3,
                        color: syntaxHighlighting ? 'transparent' : '#fff'
                      }
                    ]}
                    value={file.content}
                    onChangeText={handleContentChange}
                    onSelectionChange={handleSelectionChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    multiline
                    textAlignVertical="top"
                    keyboardType="default"
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    placeholder="Commencez à coder..."
                    placeholderTextColor="#666"
                    selectionColor={colors.selection}
                    scrollEnabled={false}
                  />
                </View>
              </ScrollView>
            </ScrollView>
          </View>
        </View>
      </Pressable>

      {file.isModified && (
        <View style={styles.modifiedIndicator}>
          <Text style={styles.modifiedText}>• Modifié</Text>
        </View>
      )}

      {showAutoComplete && autoComplete && (
        <AutoComplete
          currentWord={currentWord}
          onSelect={(suggestion) => {
            const beforeWord = file.content.substring(0, cursorPosition - currentWord.length);
            const afterCursor = file.content.substring(cursorPosition);
            const newContent = beforeWord + suggestion + afterCursor;
            updateFileContent(file.id, newContent);
            setShowAutoComplete(false);
          }}
          onClose={() => setShowAutoComplete(false)}
          fileType={file.type}
        />
      )}

      <SnippetSelector
        visible={showSnippetSelector}
        onClose={() => setShowSnippetSelector(false)}
        onSelect={insertSnippet}
        category={selectedSnippetCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
  },
  activeToolbarButton: {
    backgroundColor: '#001a0a',
    borderColor: '#00ff41',
  },
  toolbarButtonText: {
    color: '#00ff41',
    fontSize: 10,
    fontFamily: 'monospace',
    marginLeft: 4,
  },
  snippetsScroll: {
    flex: 1,
  },
  snippetsContainer: {
    flexDirection: 'row',
    paddingRight: 8,
  },
  snippetButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 4,
  },
  snippetButtonText: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  editorContainer: {
    flex: 1,
  },
  editorRow: {
    flexDirection: 'row',
    flex: 1,
  },
  lineNumbers: {
    width: 35,
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  lineNumber: {
    fontSize: 12,
    fontFamily: 'monospace',
    textAlign: 'right',
  },
  codeContainer: {
    flex: 1,
    position: 'relative',
  },
  horizontalScroll: {
    flex: 1,
  },
  verticalScroll: {
    flex: 1,
  },
  codeInputContainer: {
    flex: 1,
    position: 'relative',
  },
  syntaxHighlighterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    pointerEvents: 'none',
  },
  syntaxHighlighter: {
    backgroundColor: 'transparent',
  },
  codeInput: {
    flex: 1,
    fontFamily: 'monospace',
    padding: 10,
    textAlignVertical: 'top',
  },
  modifiedIndicator: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#ff0080',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  modifiedText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'monospace',
  },
});