import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export default function UploadScreen() {
  const [document, setDocument] = useState(null);
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [documentDate, setDocumentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setDocument(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const uploadDocument = async () => {
    if (!document || !majorHead || !minorHead) {
      Alert.alert('Error', 'Please fill all required fields and select a document');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      
      formData.append('file', {
        uri: document.uri,
        type: document.mimeType || 'application/octet-stream',
        name: document.name,
      });

      const tagsArray = tags
        .split(',')
        .map(tag => ({ tag_name: tag.trim() }))
        .filter(tag => tag.tag_name);

      const data = {
        major_head: majorHead,
        minor_head: minorHead,
        document_date: formatDate(documentDate),
        document_remarks: remarks,
        tags: tagsArray,
        user_id: 'user123',
      };

      formData.append('data', JSON.stringify(data));

      const response = await fetch(
        'https://apis.allsoft.co/api/documentManagement/saveDocumentEntry',
        {
          method: 'POST',
          headers: {
            'token': 'your_token_here',
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Document uploaded successfully');
        // Reset form
        setDocument(null);
        setMajorHead('');
        setMinorHead('');
        setDocumentDate(new Date());
        setRemarks('');
        setTags('');
      } else {
        Alert.alert('Error', result.message || 'Upload failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || documentDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDocumentDate(currentDate);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Document</Text>
        <Text style={styles.subtitle}>Add a new document to the system</Text>
      </View>

      <View style={styles.form}>
        {/* Document Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Document *</Text>
          <TouchableOpacity style={styles.documentPicker} onPress={pickDocument}>
            <Ionicons
              name={document ? "document" : "cloud-upload-outline"}
              size={24}
              color={document ? "#2563eb" : "#6b7280"}
            />
            <Text style={[styles.documentText, document && styles.documentSelected]}>
              {document ? document.name : "Tap to select document"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Major Head */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Major Head *</Text>
          <TextInput
            style={styles.input}
            value={majorHead}
            onChangeText={setMajorHead}
            placeholder="e.g., Company, Project"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Minor Head */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Minor Head *</Text>
          <TextInput
            style={styles.input}
            value={minorHead}
            onChangeText={setMinorHead}
            placeholder="e.g., Work Order, Invoice"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Document Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Document Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#6b7280" />
            <Text style={styles.dateText}>{formatDate(documentDate)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={documentDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        {/* Tags */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tags</Text>
          <TextInput
            style={styles.input}
            value={tags}
            onChangeText={setTags}
            placeholder="Enter tags separated by commas"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Remarks */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Remarks</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Additional notes or comments"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
          onPress={uploadDocument}
          disabled={isUploading}
        >
          <Ionicons
            name={isUploading ? "hourglass-outline" : "cloud-upload-outline"}
            size={20}
            color="white"
          />
          <Text style={styles.uploadButtonText}>
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
  },
  documentPicker: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  documentText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  documentSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
  dateInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#111827',
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  uploadButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});