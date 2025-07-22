import { create } from 'zustand';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FileData {
  id: string;
  name: string;
  content: string;
  type: 'html' | 'css' | 'js' | 'php' | 'py' | 'ts' | 'jsx' | 'tsx' | 'json' | 'txt' | 'png' | 'jpg' | 'jpeg' | 'gif' | 'mp3' | 'mp4' | 'pdf';
  uri?: string;
  isModified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isMediaFile?: boolean;
  folder?: string;
}

export interface SoundSettings {
  keyPress: { enabled: boolean; uri?: string };
  tabSwitch: { enabled: boolean; uri?: string };
  pageChange: { enabled: boolean; uri?: string };
  save: { enabled: boolean; uri?: string };
  run: { enabled: boolean; uri?: string };
  delete: { enabled: boolean; uri?: string };
  error: { enabled: boolean; uri?: string };
}

interface FileStore {
  // État des fichiers
  openFiles: FileData[];
  activeFileId: string | null;
  recentFiles: FileData[];
  undoStack: string[];
  redoStack: string[];
  
  // Paramètres de l'éditeur
  theme: string;
  autoComplete: boolean;
  bracketMatching: boolean;
  voiceCommands: boolean;
  keyboardSize: number;
  fontSize: number;
  lineNumbers: boolean;
  wordWrap: boolean;
  syntaxHighlighting: boolean;
  
  // Paramètres des sons
  soundSettings: SoundSettings;
  
  // Actions pour les fichiers
  openFile: (file: FileData) => void;
  closeFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  saveFile: (fileId: string) => Promise<void>;
  saveFileAs: (fileId: string, newName: string) => Promise<void>;
  createNewFile: (name: string, type: FileData['type']) => void;
  createFolder: (name: string) => void;
  setActiveFile: (fileId: string) => void;
  pickDocument: () => Promise<void>;
  exportFile: (fileId: string) => Promise<void>;
  loadRecentFiles: () => Promise<void>;
  clearRecentFiles: () => void;
  runFile: (fileId: string) => Promise<void>;
  undo: () => void;
  redo: () => void;
  
  // Actions pour les paramètres
  setTheme: (theme: string) => void;
  setAutoComplete: (enabled: boolean) => void;
  setBracketMatching: (enabled: boolean) => void;
  setVoiceCommands: (enabled: boolean) => void;
  setKeyboardSize: (size: number) => void;
  setFontSize: (size: number) => void;
  setLineNumbers: (enabled: boolean) => void;
  setWordWrap: (enabled: boolean) => void;
  setSyntaxHighlighting: (enabled: boolean) => void;
  setSoundEnabled: (soundType: keyof SoundSettings, enabled: boolean) => void;
  setSoundUri: (soundType: keyof SoundSettings, uri: string) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}

const getFileType = (fileName: string): FileData['type'] => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'html': return 'html';
    case 'css': return 'css';
    case 'js': return 'js';
    case 'jsx': return 'jsx';
    case 'ts': return 'ts';
    case 'tsx': return 'tsx';
    case 'php': return 'php';
    case 'py': return 'py';
    case 'json': return 'json';
    case 'png': return 'png';
    case 'jpg': case 'jpeg': return 'jpg';
    case 'gif': return 'gif';
    case 'mp3': return 'mp3';
    case 'mp4': return 'mp4';
    case 'pdf': return 'pdf';
    default: return 'txt';
  }
};

const isMediaFile = (type: FileData['type']): boolean => {
  return ['png', 'jpg', 'jpeg', 'gif', 'mp3', 'mp4', 'pdf'].includes(type);
};

// Sons par défaut
const DEFAULT_SOUNDS = {
  keyPress: { enabled: true, uri: undefined },
  tabSwitch: { enabled: true, uri: undefined },
  pageChange: { enabled: true, uri: undefined },
  save: { enabled: true, uri: undefined },
  run: { enabled: true, uri: undefined },
  delete: { enabled: true, uri: undefined },
  error: { enabled: true, uri: undefined },
};

export const useFileStore = create<FileStore>((set, get) => ({
  // État initial
  openFiles: [],
  activeFileId: null,
  recentFiles: [],
  undoStack: [],
  redoStack: [],
  
  // Paramètres par défaut
  theme: 'cyberpunk',
  autoComplete: true,
  bracketMatching: true,
  voiceCommands: false,
  keyboardSize: 280,
  fontSize: 14,
  lineNumbers: true,
  wordWrap: false,
  syntaxHighlighting: true,
  soundSettings: DEFAULT_SOUNDS,

  // Actions pour les fichiers
  openFile: (file) => {
    set((state) => {
      const existingFile = state.openFiles.find(f => f.id === file.id);
      if (existingFile) {
        return { activeFileId: file.id };
      }
      return {
        openFiles: [...state.openFiles, file],
        activeFileId: file.id,
      };
    });
  },

  closeFile: (fileId) => {
    set((state) => {
      const newOpenFiles = state.openFiles.filter(f => f.id !== fileId);
      const newActiveFileId = state.activeFileId === fileId
        ? newOpenFiles.length > 0 ? newOpenFiles[0].id : null
        : state.activeFileId;

      return {
        openFiles: newOpenFiles,
        activeFileId: newActiveFileId,
      };
    });
  },

  updateFileContent: (fileId, content) => {
    const state = get();
    const currentFile = state.openFiles.find(f => f.id === fileId);

    if (currentFile && currentFile.content !== content) {
      set((state) => ({
        undoStack: [...state.undoStack.slice(-19), currentFile.content],
        redoStack: [],
      }));
    }

    set((state) => ({
      openFiles: state.openFiles.map(file =>
        file.id === fileId
          ? { ...file, content, isModified: true, updatedAt: new Date() }
          : file
      ),
    }));
  },

  saveFile: async (fileId) => {
    const file = get().openFiles.find(f => f.id === fileId);
    if (!file) return;

    try {
      const documentsDir = FileSystem.documentDirectory;
      const filePath = `${documentsDir}${file.name}`;

      if (file.isMediaFile) {
        if (file.uri) {
          await FileSystem.copyAsync({
            from: file.uri,
            to: filePath
          });
        }
      } else {
        await FileSystem.writeAsStringAsync(filePath, file.content);
      }

      set((state) => ({
        openFiles: state.openFiles.map(f =>
          f.id === fileId
            ? { ...f, isModified: false, uri: filePath, updatedAt: new Date() }
            : f
        ),
      }));

      const recentFiles = [...get().recentFiles.filter(f => f.id !== fileId), file];
      await AsyncStorage.setItem('recentFiles', JSON.stringify(recentFiles.slice(0, 10)));
      set({ recentFiles: recentFiles.slice(0, 10) });
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  },

  saveFileAs: async (fileId, newName) => {
    const file = get().openFiles.find(f => f.id === fileId);
    if (!file) return;

    try {
      const documentsDir = FileSystem.documentDirectory;
      const filePath = `${documentsDir}${newName}`;

      if (file.isMediaFile) {
        if (file.uri) {
          await FileSystem.copyAsync({
            from: file.uri,
            to: filePath
          });
        }
      } else {
        await FileSystem.writeAsStringAsync(filePath, file.content);
      }

      const newFile: FileData = {
        ...file,
        id: Date.now().toString(),
        name: newName,
        type: getFileType(newName),
        uri: filePath,
        isModified: false,
        updatedAt: new Date(),
        isMediaFile: isMediaFile(getFileType(newName)),
      };

      set((state) => ({
        openFiles: state.openFiles.map(f =>
          f.id === fileId ? newFile : f
        ),
        activeFileId: newFile.id,
      }));
    } catch (error) {
      console.error('Error saving file as:', error);
      throw error;
    }
  },

  createNewFile: (name, type) => {
    const folderName = name.includes('/') ? name.split('/')[0] : 'project';
    const fileName = name.includes('/') ? name.split('/')[1] : name;

    const newFile: FileData = {
      id: Date.now().toString(),
      name: fileName,
      content: '',
      type,
      isModified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isMediaFile: isMediaFile(type),
      folder: folderName,
    };

    set((state) => ({
      openFiles: [...state.openFiles, newFile],
      activeFileId: newFile.id,
    }));
  },

  createFolder: (name) => {
    // Créer un fichier README.md dans le nouveau dossier
    const readmeFile: FileData = {
      id: Date.now().toString(),
      name: `${name}/README.md`,
      content: `# ${name}\n\nDescription du projet ${name}`,
      type: 'txt',
      isModified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isMediaFile: false,
      folder: name,
    };

    set((state) => ({
      openFiles: [...state.openFiles, readmeFile],
      activeFileId: readmeFile.id,
    }));
  },

  setActiveFile: (fileId) => {
    set({ activeFileId: fileId });
  },

  pickDocument: async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileType = getFileType(asset.name);

        let content = '';

        if (!isMediaFile(fileType)) {
          try {
            content = await FileSystem.readAsStringAsync(asset.uri);
          } catch (error) {
            console.log('Could not read file content, treating as binary');
          }
        }

        const newFile: FileData = {
          id: Date.now().toString(),
          name: asset.name,
          content,
          type: fileType,
          uri: asset.uri,
          isModified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          isMediaFile: isMediaFile(fileType),
        };

        get().openFile(newFile);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  },

  exportFile: async (fileId) => {
    const file = get().openFiles.find(f => f.id === fileId);
    if (!file) return;

    try {
      const documentsDir = FileSystem.documentDirectory;
      const filePath = `${documentsDir}export_${file.name}`;

      if (file.isMediaFile && file.uri) {
        await FileSystem.copyAsync({
          from: file.uri,
          to: filePath
        });
      } else {
        await FileSystem.writeAsStringAsync(filePath, file.content);
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
      }
    } catch (error) {
      console.error('Error exporting file:', error);
      throw error;
    }
  },

  loadRecentFiles: async () => {
    try {
      const recentFilesData = await AsyncStorage.getItem('recentFiles');
      if (recentFilesData) {
        const recentFiles = JSON.parse(recentFilesData);
        set({ recentFiles });
      }
    } catch (error) {
      console.error('Error loading recent files:', error);
    }
  },

  clearRecentFiles: () => {
    AsyncStorage.removeItem('recentFiles');
    set({ recentFiles: [] });
  },

  runFile: async (fileId) => {
    const file = get().openFiles.find(f => f.id === fileId);
    if (!file) return;

    try {
      await get().saveFile(fileId);

      if (file.type === 'html') {
        const runnerContent = file.content;
        const runnerPath = `${FileSystem.documentDirectory}runner.html`;
        await FileSystem.writeAsStringAsync(runnerPath, runnerContent);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(runnerPath);
        }
      } else if (file.type === 'js') {
        const runnerContent = `
<!DOCTYPE html>
<html>
<head>
    <title>JavaScript Runner</title>
    <style>
        body { 
            background: #0a0a0a; 
            color: #00ff41; 
            font-family: monospace; 
            padding: 20px; 
        }
        #output { 
            border: 1px solid #00ff41; 
            padding: 10px; 
            margin-top: 10px; 
            min-height: 200px; 
        }
    </style>
</head>
<body>
    <h1>JavaScript Output</h1>
    <div id="output"></div>
    <script>
        const output = document.getElementById('output');
        const originalLog = console.log;
        console.log = function(...args) {
            output.innerHTML += args.join(' ') + '<br>';
            originalLog.apply(console, args);
        };
        
        try {
            ${file.content}
        } catch (error) {
            output.innerHTML += '<span style="color: #ff0080;">Error: ' + error.message + '</span><br>';
        }
    </script>
</body>
</html>`;

        const runnerPath = `${FileSystem.documentDirectory}js_runner.html`;
        await FileSystem.writeAsStringAsync(runnerPath, runnerContent);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(runnerPath);
        }
      } else {
        if (file.uri && await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(file.uri);
        }
      }
    } catch (error) {
      console.error('Error running file:', error);
      throw error;
    }
  },

  undo: () => {
    const state = get();
    if (state.undoStack.length === 0 || !state.activeFileId) return;

    const currentFile = state.openFiles.find(f => f.id === state.activeFileId);
    if (!currentFile) return;

    const previousContent = state.undoStack[state.undoStack.length - 1];
    const newUndoStack = state.undoStack.slice(0, -1);

    set((state) => ({
      openFiles: state.openFiles.map(file =>
        file.id === state.activeFileId
          ? { ...file, content: previousContent, isModified: true, updatedAt: new Date() }
          : file
      ),
      undoStack: newUndoStack,
      redoStack: [...state.redoStack, currentFile.content],
    }));
  },

  redo: () => {
    const state = get();
    if (state.redoStack.length === 0 || !state.activeFileId) return;

    const currentFile = state.openFiles.find(f => f.id === state.activeFileId);
    if (!currentFile) return;

    const nextContent = state.redoStack[state.redoStack.length - 1];
    const newRedoStack = state.redoStack.slice(0, -1);

    set((state) => ({
      openFiles: state.openFiles.map(file =>
        file.id === state.activeFileId
          ? { ...file, content: nextContent, isModified: true, updatedAt: new Date() }
          : file
      ),
      undoStack: [...state.undoStack, currentFile.content],
      redoStack: newRedoStack,
    }));
  },

  // Actions pour les paramètres
  setTheme: (theme) => {
    set({ theme });
    get().saveSettings();
  },
  
  setAutoComplete: (enabled) => {
    set({ autoComplete: enabled });
    get().saveSettings();
  },
  
  setBracketMatching: (enabled) => {
    set({ bracketMatching: enabled });
    get().saveSettings();
  },
  
  setVoiceCommands: (enabled) => {
    set({ voiceCommands: enabled });
    get().saveSettings();
  },
  
  setKeyboardSize: (size) => {
    set({ keyboardSize: size });
    get().saveSettings();
  },
  
  setFontSize: (size) => {
    set({ fontSize: size });
    get().saveSettings();
  },
  
  setLineNumbers: (enabled) => {
    set({ lineNumbers: enabled });
    get().saveSettings();
  },
  
  setWordWrap: (enabled) => {
    set({ wordWrap: enabled });
    get().saveSettings();
  },
  
  setSyntaxHighlighting: (enabled) => {
    set({ syntaxHighlighting: enabled });
    get().saveSettings();
  },
  
  setSoundEnabled: (soundType, enabled) => {
    set((state) => ({
      soundSettings: {
        ...state.soundSettings,
        [soundType]: {
          ...state.soundSettings[soundType],
          enabled
        }
      }
    }));
    get().saveSettings();
  },
  
  setSoundUri: (soundType, uri) => {
    set((state) => ({
      soundSettings: {
        ...state.soundSettings,
        [soundType]: {
          ...state.soundSettings[soundType],
          uri
        }
      }
    }));
    get().saveSettings();
  },
  
  loadSettings: async () => {
    try {
      const settingsData = await AsyncStorage.getItem('editorSettings');
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        set({
          theme: settings.theme || 'cyberpunk',
          autoComplete: settings.autoComplete ?? true,
          bracketMatching: settings.bracketMatching ?? true,
          voiceCommands: settings.voiceCommands ?? false,
          keyboardSize: settings.keyboardSize || 280,
          fontSize: settings.fontSize || 14,
          lineNumbers: settings.lineNumbers ?? true,
          wordWrap: settings.wordWrap ?? false,
          syntaxHighlighting: settings.syntaxHighlighting ?? true,
          soundSettings: settings.soundSettings || DEFAULT_SOUNDS,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  },
  
  saveSettings: async () => {
    const state = get();
    const settings = {
      theme: state.theme,
      autoComplete: state.autoComplete,
      bracketMatching: state.bracketMatching,
      voiceCommands: state.voiceCommands,
      keyboardSize: state.keyboardSize,
      fontSize: state.fontSize,
      lineNumbers: state.lineNumbers,
      wordWrap: state.wordWrap,
      syntaxHighlighting: state.syntaxHighlighting,
      soundSettings: state.soundSettings,
    };
    
    try {
      await AsyncStorage.setItem('editorSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },
}));