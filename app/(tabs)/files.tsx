import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFileStore } from '@/store/fileStore';
import {
  FolderOpen,
  FileText,
  Plus,
  Save,
  Upload,
  Download,
  Trash2,
  Code,
  Hash,
  Zap,
  Database,
  Layers,
  X,
  FolderPlus
} from 'lucide-react-native';

// Import du type depuis le store
import { FileData } from '@/store/fileStore';

interface FileType {
  type: string;
  name: string;
  icon: any;
  color: string;
}

const FILE_TYPES: FileType[] = [
  { type: 'html', name: 'HTML', icon: Code, color: '#e34f26' },
  { type: 'css', name: 'CSS', icon: Hash, color: '#1572b6' },
  { type: 'js', name: 'JavaScript', icon: Zap, color: '#f7df1e' },
  { type: 'jsx', name: 'JSX', icon: Layers, color: '#61dafb' },
  { type: 'ts', name: 'TypeScript', icon: Code, color: '#3178c6' },
  { type: 'tsx', name: 'TSX', icon: Layers, color: '#3178c6' },
  { type: 'php', name: 'PHP', icon: Database, color: '#777bb4' },
  { type: 'py', name: 'Python', icon: Code, color: '#3776ab' },
  { type: 'json', name: 'JSON', icon: FileText, color: '#ffd700' },
  { type: 'txt', name: 'Text', icon: FileText, color: '#ffffff' },
];

export default function FilesScreen() {
  const {
    openFiles,
    recentFiles,
    pickDocument,
    createNewFile,
    openFile,
    exportFile,
    closeFile,
    loadRecentFiles,
    clearRecentFiles
  } = useFileStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<string>('js');

  useEffect(() => {
    loadRecentFiles();
  }, [loadRecentFiles]);

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const fullFileName = newFileName.includes('.')
        ? newFileName
        : `${newFileName}.${selectedFileType}`;

      createNewFile(fullFileName, selectedFileType as FileData['type']);
      setNewFileName('');
      setShowCreateModal(false);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      // Créez un fichier README.md dans le dossier
      createNewFile(`${newFolderName}/README.md`, 'txt');
      setNewFolderName('');
      setShowFolderModal(false);
    }
  };

  const handleExportFile = async (fileId: string) => {
    try {
      await exportFile(fileId);
      Alert.alert('Success', 'File exported successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to export file');
    }
  };

  const renderFileItem = (file: FileData, isRecent = false) => {
    const fileType = FILE_TYPES.find(ft => ft.type === file.type) || FILE_TYPES[9];
    const IconComponent = fileType.icon;

    return (
      <TouchableOpacity
        key={file.id}
        style={styles.fileItem}
        onPress={() => openFile(file)}
      >
        <View style={styles.fileIcon}>
          <IconComponent size={24} color={fileType.color} />
        </View>

        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>{file.name}</Text>
          <Text style={styles.fileType}>{fileType.name}</Text>
          <Text style={styles.fileDate}>
            {isRecent ? 'Recent' : new Date(file.updatedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.fileActions}>
          <TouchableOpacity
            style={[styles.actionButton, { marginLeft: 0 }]}
            onPress={() => handleExportFile(file.id)}
          >
            <Download size={16} color="#00ff41" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => closeFile(file.id)}
          >
            <X size={16} color="#ff0080" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Files</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, { marginLeft: 0 }]}
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={20} color="#00ff41" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowFolderModal(true)}
          >
            <FolderPlus size={20} color="#00ff41" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={pickDocument}
          >
            <FolderOpen size={20} color="#00ff41" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => setShowCreateModal(true)}
            >
              <Plus size={24} color="#00ff41" />
              <Text style={styles.quickActionText}>New File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => setShowFolderModal(true)}
            >
              <FolderPlus size={24} color="#00ff41" />
              <Text style={styles.quickActionText}>New Folder</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={pickDocument}
            >
              <Upload size={24} color="#00ff41" />
              <Text style={styles.quickActionText}>Open File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={clearRecentFiles}
            >
              <Trash2 size={24} color="#ff0080" />
              <Text style={styles.quickActionText}>Clear Recent</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Open Files */}
        {openFiles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Open Files ({openFiles.length})</Text>
            {openFiles.map((file: FileData) => renderFileItem(file))}
          </View>
        )}

        {/* Recent Files */}
        {recentFiles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Files</Text>
            {recentFiles.map((file: FileData) => renderFileItem(file, true))}
          </View>
        )}

        {/* File Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>File Templates</Text>

          <View style={styles.templateGrid}>
            {FILE_TYPES.map((fileType: FileType) => {
              const IconComponent = fileType.icon;
              return (
                <TouchableOpacity
                  key={fileType.type}
                  style={styles.templateItem}
                  onPress={() => {
                    setSelectedFileType(fileType.type);
                    setNewFileName(`new_file.${fileType.type}`);
                    setShowCreateModal(true);
                  }}
                >
                  <IconComponent size={32} color={fileType.color} />
                  <Text style={styles.templateText}>{fileType.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Create File Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCreateModal}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New File</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.modalSection}>
                <Text style={styles.inputLabel}>File Name:</Text>
                <TextInput
                  style={styles.fileNameInput}
                  value={newFileName}
                  onChangeText={setNewFileName}
                  placeholder="Enter file name..."
                  placeholderTextColor="#666"
                  autoFocus
                />
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.inputLabel}>File Type:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.typeSelector}>
                    {FILE_TYPES.map((fileType: FileType) => {
                      const IconComponent = fileType.icon;
                      const isSelected = selectedFileType === fileType.type;

                      return (
                        <TouchableOpacity
                          key={fileType.type}
                          style={[
                            styles.typeOption,
                            isSelected && styles.selectedTypeOption
                          ]}
                          onPress={() => setSelectedFileType(fileType.type)}
                        >
                          <IconComponent
                            size={20}
                            color={isSelected ? '#0a0a0a' : fileType.color}
                          />
                          <Text style={[
                            styles.typeOptionText,
                            isSelected && styles.selectedTypeOptionText,
                            { marginLeft: 4 }
                          ]}>
                            {fileType.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { marginLeft: 0 }]}
                  onPress={() => setShowCreateModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.createButton]}
                  onPress={handleCreateFile}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Folder Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFolderModal}
        onRequestClose={() => setShowFolderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Folder</Text>
              <TouchableOpacity onPress={() => setShowFolderModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.modalSection}>
                <Text style={styles.inputLabel}>Folder Name:</Text>
                <TextInput
                  style={styles.fileNameInput}
                  value={newFolderName}
                  onChangeText={setNewFolderName}
                  placeholder="Enter folder name..."
                  placeholderTextColor="#666"
                  autoFocus
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { marginLeft: 0 }]}
                  onPress={() => setShowFolderModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.createButton]}
                  onPress={handleCreateFolder}
                >
                  <Text style={styles.createButtonText}>Create Folder</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff41',
    fontFamily: 'monospace',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    backgroundColor: '#001a0a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00ff41',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff41',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    width: '48%',
    marginBottom: 8,
  },
  quickActionText: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'monospace',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  fileIcon: {
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  fileType: {
    color: '#00ff41',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  fileDate: {
    color: '#666',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  fileActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    marginLeft: 8,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  templateItem: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    width: '30%',
    marginRight: '3.33%',
    marginBottom: 12,
  },
  templateText: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'monospace',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#00ff41',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#00ff41',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  modalContent: {
    // Pas de gap car non supporté dans toutes les versions
  },
  modalSection: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#00ff41',
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  fileNameInput: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  typeSelector: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
  },
  selectedTypeOption: {
    backgroundColor: '#00ff41',
    borderColor: '#00ff41',
  },
  typeOptionText: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  selectedTypeOptionText: {
    color: '#0a0a0a',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginLeft: 12,
  },
  createButton: {
    backgroundColor: '#00ff41',
    borderColor: '#00ff41',
  },
  modalButtonText: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  createButtonText: {
    color: '#0a0a0a',
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});