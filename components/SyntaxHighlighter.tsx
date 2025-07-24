import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  style?: any;
  theme: string;
  syntaxHighlighting: boolean;
  fontSize?: number;
}

// Définir les couleurs de syntaxe par thème
const SYNTAX_THEMES = {
  cyberpunk: {
    keyword: '#ff0080',
    string: '#00ff41',
    number: '#00ffff',
    comment: '#666666',
    function: '#fffb00',
    tag: '#ff0080',
    attribute: '#00ff41',
    selector: '#ff0080',
    property: '#00ff41',
    value: '#00ffff',
    variable: '#fffb00',
    operator: '#ff0080',
    default: '#ffffff',
  },
  neon: {
    keyword: '#ff00c8',
    string: '#fffb00',
    number: '#00fff7',
    comment: '#666666',
    function: '#39ff14',
    tag: '#ff00c8',
    attribute: '#fffb00',
    selector: '#ff00c8',
    property: '#fffb00',
    value: '#00fff7',
    variable: '#39ff14',
    operator: '#ff00c8',
    default: '#ffffff',
  },
  matrix: {
    keyword: '#00ff41',
    string: '#00ff41',
    number: '#00ff41',
    comment: '#003300',
    function: '#00ff41',
    tag: '#00ff41',
    attribute: '#00ff41',
    selector: '#00ff41',
    property: '#00ff41',
    value: '#00ff41',
    variable: '#00ff41',
    operator: '#00ff41',
    default: '#00ff41',
  },
  'blade runner': {
    keyword: '#ff6600',
    string: '#fffb00',
    number: '#ff0080',
    comment: '#666666',
    function: '#ff6600',
    tag: '#ff6600',
    attribute: '#fffb00',
    selector: '#ff6600',
    property: '#fffb00',
    value: '#ff0080',
    variable: '#ff6600',
    operator: '#ff6600',
    default: '#ffffff',
  },
  'neon-orange': {
    keyword: '#ff9500',
    string: '#ffe066',
    number: '#4fd3ff',
    comment: '#666666',
    function: '#4fd3ff',
    tag: '#ff9500',
    attribute: '#ffe066',
    selector: '#ff9500',
    property: '#ffe066',
    value: '#4fd3ff',
    variable: '#4fd3ff',
    operator: '#ff9500',
    default: '#ffffff',
  },
  'cyan-red': {
    keyword: '#ff0040',
    string: '#00ffff',
    number: '#00ffff',
    comment: '#666666',
    function: '#00ffff',
    tag: '#ff0040',
    attribute: '#00ffff',
    selector: '#ff0040',
    property: '#00ffff',
    value: '#00ffff',
    variable: '#00ffff',
    operator: '#ff0040',
    default: '#ffffff',
  },
  'gold-red': {
    keyword: '#ff0040',
    string: '#ffd700',
    number: '#ffd700',
    comment: '#666666',
    function: '#ffd700',
    tag: '#ff0040',
    attribute: '#ffd700',
    selector: '#ff0040',
    property: '#ffd700',
    value: '#ffd700',
    variable: '#ffd700',
    operator: '#ff0040',
    default: '#ffffff',
  },
  'gold-red-cyan': {
    keyword: '#ff0040',
    string: '#ffd700',
    number: '#00ffff',
    comment: '#666666',
    function: '#00ffff',
    tag: '#ff0040',
    attribute: '#ffd700',
    selector: '#ff0040',
    property: '#ffd700',
    value: '#00ffff',
    variable: '#00ffff',
    operator: '#ff0040',
    default: '#ffffff',
  },
  'neon-genesis': {
    keyword: '#a020f0', // Purple
    string: '#00ff00',  // Bright green
    number: '#ff1493',  // Deep pink
    comment: '#4b0082', // Indigo
    function: '#ffd700', // Gold
    tag: '#a020f0',
    attribute: '#00ff00',
    selector: '#a020f0',
    property: '#00ff00',
    value: '#ff1493',
    variable: '#ffd700',
    operator: '#ff1493',
    default: '#ffffff',
  },
};

const KEYWORDS = {
  js: ['const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 'return', 'break', 'continue', 'switch', 'case', 'default', 'try', 'catch', 'finally', 'throw', 'new', 'class', 'extends', 'import', 'export', 'from', 'async', 'await', 'typeof', 'instanceof', 'void', 'delete', 'true', 'false', 'null', 'undefined'],
  jsx: ['const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 'return', 'break', 'continue', 'switch', 'case', 'default', 'try', 'catch', 'finally', 'throw', 'new', 'class', 'extends', 'import', 'export', 'from', 'async', 'await', 'typeof', 'instanceof', 'void', 'delete', 'true', 'false', 'null', 'undefined', 'React', 'useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 'useMemo', 'useRef'],
  ts: ['const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 'return', 'break', 'continue', 'switch', 'case', 'default', 'try', 'catch', 'finally', 'throw', 'new', 'class', 'extends', 'import', 'export', 'from', 'async', 'await', 'typeof', 'instanceof', 'void', 'delete', 'true', 'false', 'null', 'undefined', 'interface', 'type', 'enum', 'namespace', 'module', 'declare', 'abstract', 'implements', 'private', 'protected', 'public', 'static', 'readonly', 'as', 'is', 'keyof', 'never', 'any', 'unknown'],
  tsx: ['const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 'return', 'break', 'continue', 'switch', 'case', 'default', 'try', 'catch', 'finally', 'throw', 'new', 'class', 'extends', 'import', 'export', 'from', 'async', 'await', 'typeof', 'instanceof', 'void', 'delete', 'true', 'false', 'null', 'undefined', 'interface', 'type', 'enum', 'namespace', 'module', 'declare', 'abstract', 'implements', 'private', 'protected', 'public', 'static', 'readonly', 'as', 'is', 'keyof', 'never', 'any', 'unknown', 'React', 'useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 'useMemo', 'useRef'],
  py: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'break', 'continue', 'try', 'except', 'finally', 'raise', 'import', 'from', 'as', 'pass', 'lambda', 'yield', 'global', 'nonlocal', 'assert', 'del', 'with', 'async', 'await', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is'],
  php: ['<?php', '?>', 'echo', 'print', 'if', 'else', 'elseif', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'function', 'return', 'class', 'public', 'private', 'protected', 'static', 'new', 'extends', 'implements', 'interface', 'namespace', 'use', 'trait', 'abstract', 'final', 'const', 'var', 'global', 'isset', 'unset', 'empty', 'die', 'exit', 'include', 'require', 'include_once', 'require_once'],
  html: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'select', 'option', 'textarea', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'nav', 'main', 'section', 'article', 'aside', 'meta', 'link', 'script', 'style', 'title'],
  css: ['color', 'background', 'background-color', 'font-size', 'font-family', 'font-weight', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom', 'flex', 'grid', 'align-items', 'justify-content', 'text-align', 'line-height', 'overflow', 'z-index', 'opacity', 'transform', 'transition', 'animation', 'hover', 'active', 'focus', 'before', 'after'],
};

export function SyntaxHighlighter({
  code,
  language,
  style,
  theme,
  syntaxHighlighting,
  fontSize = 14
}: SyntaxHighlighterProps) {
  if (!syntaxHighlighting) {
    return (
      <Text style={[styles.code, style, { fontSize, lineHeight: fontSize * 1.3 }]}>
        {code}
      </Text>
    );
  }

  const colors = SYNTAX_THEMES[theme as keyof typeof SYNTAX_THEMES] || SYNTAX_THEMES.cyberpunk;
  const keywords = KEYWORDS[language as keyof typeof KEYWORDS] || [];

  const tokenize = (text: string) => {
    const tokens: { type: string; value: string }[] = [];
    let remaining = text;

    while (remaining.length > 0) {
      let matched = false;

      // Comments
      if (language === 'js' || language === 'jsx' || language === 'ts' || language === 'tsx') {
        // Single line comment
        if (remaining.startsWith('//')) {
          const endIndex = remaining.indexOf('\n');
          const comment = endIndex === -1 ? remaining : remaining.substring(0, endIndex);
          tokens.push({ type: 'comment', value: comment });
          remaining = endIndex === -1 ? '' : remaining.substring(endIndex);
          matched = true;
        }
        // Multi-line comment
        else if (remaining.startsWith('/*')) {
          const endIndex = remaining.indexOf('*/');
          const comment = endIndex === -1 ? remaining : remaining.substring(0, endIndex + 2);
          tokens.push({ type: 'comment', value: comment });
          remaining = endIndex === -1 ? '' : remaining.substring(endIndex + 2);
          matched = true;
        }
      }

      // Strings
      if (!matched && (remaining.startsWith('"') || remaining.startsWith("'") || remaining.startsWith('`'))) {
        const quote = remaining[0];
        let endIndex = 1;
        while (endIndex < remaining.length) {
          if (remaining[endIndex] === quote && remaining[endIndex - 1] !== '\\') {
            break;
          }
          endIndex++;
        }
        const string = remaining.substring(0, endIndex + 1);
        tokens.push({ type: 'string', value: string });
        remaining = remaining.substring(endIndex + 1);
        matched = true;
      }

      // Numbers
      if (!matched && /^\d/.test(remaining)) {
        const match = remaining.match(/^\d+\.?\d*/);
        if (match) {
          tokens.push({ type: 'number', value: match[0] });
          remaining = remaining.substring(match[0].length);
          matched = true;
        }
      }

      // Keywords and identifiers
      if (!matched && /^[a-zA-Z_$]/.test(remaining)) {
        const match = remaining.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
        if (match) {
          const word = match[0];
          if (keywords.includes(word)) {
            tokens.push({ type: 'keyword', value: word });
          } else if (remaining.substring(match[0].length).trimStart().startsWith('(')) {
            tokens.push({ type: 'function', value: word });
          } else {
            tokens.push({ type: 'identifier', value: word });
          }
          remaining = remaining.substring(match[0].length);
          matched = true;
        }
      }

      // HTML/JSX Tags
      if (!matched && (language === 'html' || language === 'jsx' || language === 'tsx') && remaining.startsWith('<')) {
        const match = remaining.match(/^<\/?[a-zA-Z][a-zA-Z0-9]*/);
        if (match) {
          tokens.push({ type: 'tag', value: match[0] });
          remaining = remaining.substring(match[0].length);
          matched = true;
        }
      }

      // Operators
      if (!matched && /^[+\-*/%=<>!&|^~?:]/.test(remaining)) {
        const match = remaining.match(/^[+\-*/%=<>!&|^~?:]+/);
        if (match) {
          tokens.push({ type: 'operator', value: match[0] });
          remaining = remaining.substring(match[0].length);
          matched = true;
        }
      }

      // Default
      if (!matched) {
        tokens.push({ type: 'default', value: remaining[0] });
        remaining = remaining.substring(1);
      }
    }

    return tokens;
  };

  const tokens = tokenize(code);

  return (
    <Text style={[styles.code, style, { fontSize, lineHeight: fontSize * 1.3 }]}>
      {tokens.map((token, index) => {
        let color = colors.default;

        switch (token.type) {
          case 'keyword':
            color = colors.keyword;
            break;
          case 'string':
            color = colors.string;
            break;
          case 'number':
            color = colors.number;
            break;
          case 'comment':
            color = colors.comment;
            break;
          case 'function':
            color = colors.function;
            break;
          case 'tag':
            color = colors.tag;
            break;
          case 'operator':
            color = colors.operator;
            break;
          case 'identifier':
            if (token.value[0] === token.value[0].toUpperCase() && token.value[0] !== token.value[0].toLowerCase()) {
              color = colors.function;
            } else {
              color = colors.variable;
            }
            break;
        }

        return (
          <Text key={index} style={{ color }}>
            {token.value}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  code: {
    fontFamily: 'monospace',
  },
});