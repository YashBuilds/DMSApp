import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    majorHead: '',
    minorHead: '',
    fromDate: null,
    toDate: null,
    tags: '',
    uploadedBy: '',
  });
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const searchDocuments = async () => {
    setLoading(true);
    try {
      const tagsArray = filters.tags
        .split(',')
        .map(tag => ({ tag_name: tag.trim() }))
        .filter(tag => tag.tag_name);

      const requestBody = {
        major_head: filters.majorHead,
        minor_head: filters.minorHead,
        from_date: filters.fromDate ? formatDate(filters.fromDate) : '',
        to_date: filters.toDate ? formatDate(filters.toDate) : '',
        tags: tagsArray,
        uploaded_by: filters.uploadedBy,
        start: 0,
        length: 20,
        filterId: '',
        search: {
          value: searchQuery,
        },
      };

      const response = await fetch(
        'https://apis.allsoft.co/api/documentManagement/searchDocumentEntry',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': 'your_token_here',
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      
      if (response.ok) {
        setDocuments(result.data || []);
      } else {
        Alert.alert('Error', result.message || 'Search failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const clearFilters = () => {
    setFilters({
      majorHead: '',
      minorHead: '',
      fromDate: null,
      toDate: null,
      tags: '',
      uploadedBy: '',
    });
    setSearchQuery('');
  };

  const renderDocument = ({ item }) => (
    <View style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <Text style={styles.documentTitle}>{item.document_name}</Text>
        <Text style={styles.documentDate}>{item.document_date}</Text>
      </View>
      <View style={styles.documentMeta}>
        <Text style={styles.metaItem}>
          <Text style={styles.metaLabel}>Major: </Text>
          {item.major_head}
        </Text>
        <Text style={styles.metaItem}>
          <Text style={styles.metaLabel}>Minor: </Text>
          {item.minor_head}
        </Text>
      </View>
      {item.document_remarks && (
        <Text style={styles.documentRemarks}>{item.document_remarks}</Text>
      )}
      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag.tag_name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search Documents</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter-outline" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={searchDocuments}>
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Documents List */}
      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.documentsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyStateText}>
              {loading ? 'Searching...' : 'No documents found'}
            </Text>
          </View>
        }
      />

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filtersContent}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Major Head</Text>
              <TextInput
                style={styles.filterInput}
                value={filters.majorHead}
                onChangeText={(text) => setFilters({...filters, majorHead: text})}
                placeholder="Filter by major head"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Minor Head</Text>
              <TextInput
                style={styles.filterInput}
                value={filters.minorHead}
                onChangeText={(text) => setFilters({...filters, minorHead: text})}
                placeholder="Filter by minor head"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>From Date</Text>
              <TouchableOpacity
                style={styles.dateFilterInput}
                onPress={() => setShowFromDatePicker(true)}
              >
                <Text style={styles.dateFilterText}>
                  {filters.fromDate ? formatDate(filters.fromDate) : 'Select date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>To Date</Text>
              <TouchableOpacity
                style={styles.dateFilterInput}
                onPress={() => setShowToDatePicker(true)}
              >
                <Text style={styles.dateFilterText}>
                  {filters.toDate ? formatDate(filters.toDate) : 'Select date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Tags</Text>
              <TextInput
                style={styles.filterInput}
                value={filters.tags}
                onChangeText={(text) => setFilters({...filters, tags: text})}
                placeholder="Tags separated by commas"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <TouchableOpacity
              style={styles.applyFiltersButton}
              onPress={() => {
                setShowFilters(false);
                searchDocuments();
              }}
            >
              <Text style={styles.applyFiltersText}>Apply Filters</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {showFromDatePicker && (
          <DateTimePicker
            value={filters.fromDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowFromDatePicker(false);
              if (selectedDate) {
                setFilters({...filters, fromDate: selectedDate});
              }
            }}
          />
        )}

        {showToDatePicker && (
          <DateTimePicker
            value={filters.toDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowToDatePicker(false);
              if (selectedDate) {
                setFilters({...filters, toDate: selectedDate});
              }
            }}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentsList: {
    padding: 16,
  },
  documentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  documentTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  documentDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  documentMeta: {
    marginBottom: 8,
  },
  metaItem: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 2,
  },
  metaLabel: {
    fontWeight: '600',
  },
  documentRemarks: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#3730a3',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  clearButton: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
  filtersContent: {
    flex: 1,
    padding: 24,
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  dateFilterInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateFilterText: {
    fontSize: 16,
    color: '#111827',
  },
  applyFiltersButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  applyFiltersText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});