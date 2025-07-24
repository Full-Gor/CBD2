import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { FileData } from '@/store/fileStore';
import { Play, FileText, Download } from 'lucide-react-native';

interface MediaViewerProps {
  file: FileData;
}

const { width, height } = Dimensions.get('window');

export function MediaViewer({ file }: MediaViewerProps) {
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const extension = getFileExtension(file.name);

  const renderImageViewer = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.filename}>{file.name}</Text>
        <Text style={styles.fileType}>Image • {extension.toUpperCase()}</Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: file.uri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>Tap and hold to save to gallery</Text>
      </View>
    </View>
  );

  const renderVideoViewer = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.filename}>{file.name}</Text>
        <Text style={styles.fileType}>Video • {extension.toUpperCase()}</Text>
      </View>
      
      <View style={styles.videoContainer}>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => Alert.alert('Video Player', 'Video playback would open here')}
        >
          <Play size={48} color="#00ff41" />
        </TouchableOpacity>
        <Text style={styles.videoText}>Tap to play video</Text>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>Video format: {extension.toUpperCase()}</Text>
      </View>
    </View>
  );

  const renderAudioViewer = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.filename}>{file.name}</Text>
        <Text style={styles.fileType}>Audio • {extension.toUpperCase()}</Text>
      </View>
      
      <View style={styles.audioContainer}>
        <View style={styles.audioVisualizer}>
          <View style={styles.audioWave} />
          <View style={[styles.audioWave, { height: 60 }]} />
          <View style={[styles.audioWave, { height: 40 }]} />
          <View style={[styles.audioWave, { height: 80 }]} />
          <View style={[styles.audioWave, { height: 30 }]} />
        </View>
        
        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => Alert.alert('Audio Player', 'Audio playback would start here')}
        >
          <Play size={32} color="#00ff41" />
        </TouchableOpacity>
        
        <Text style={styles.audioText}>Tap to play audio</Text>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>Audio format: {extension.toUpperCase()}</Text>
      </View>
    </View>
  );

  const renderPdfViewer = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.filename}>{file.name}</Text>
        <Text style={styles.fileType}>Document • PDF</Text>
      </View>
      
      <View style={styles.pdfContainer}>
        <FileText size={64} color="#ff0080" />
        <Text style={styles.pdfText}>PDF Document</Text>
        
        <TouchableOpacity 
          style={styles.openButton}
          onPress={() => Alert.alert('PDF Viewer', 'PDF would open in external viewer')}
        >
          <Text style={styles.openButtonText}>Open PDF</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>Tap to open in external PDF viewer</Text>
      </View>
    </View>
  );

  const renderUnsupportedFile = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.filename}>{file.name}</Text>
        <Text style={styles.fileType}>File • {extension.toUpperCase()}</Text>
      </View>
      
      <View style={styles.unsupportedContainer}>
        <FileText size={64} color="#666" />
        <Text style={styles.unsupportedText}>File type not supported for preview</Text>
        
        <TouchableOpacity 
          style={styles.downloadButton}
          onPress={() => Alert.alert('Download', 'File would be downloaded')}
        >
          <Download size={20} color="#00ff41" />
          <Text style={styles.downloadButtonText}>Download File</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Determine which viewer to show based on file extension
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) {
    return renderImageViewer();
  } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
    return renderVideoViewer();
  } else if (['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'].includes(extension)) {
    return renderAudioViewer();
  } else if (extension === 'pdf') {
    return renderPdfViewer();
  } else {
    return renderUnsupportedFile();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  filename: {
    color: '#00ff41',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  fileType: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: width - 32,
    height: height * 0.6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  audioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  audioVisualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    gap: 4,
  },
  audioWave: {
    width: 8,
    height: 50,
    backgroundColor: '#00ff41',
    borderRadius: 4,
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#001a0a',
    borderWidth: 2,
    borderColor: '#00ff41',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  videoText: {
    color: '#00ff41',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  audioText: {
    color: '#00ff41',
    fontSize: 16,
    fontFamily: 'monospace',
    marginTop: 16,
  },
  pdfText: {
    color: '#ff0080',
    fontSize: 18,
    fontFamily: 'monospace',
    marginVertical: 16,
  },
  unsupportedText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'monospace',
    marginVertical: 16,
    textAlign: 'center',
  },
  openButton: {
    backgroundColor: '#1a0010',
    borderWidth: 1,
    borderColor: '#ff0080',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  openButtonText: {
    color: '#ff0080',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001a0a',
    borderWidth: 1,
    borderColor: '#00ff41',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  downloadButtonText: {
    color: '#00ff41',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  info: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  infoText: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});