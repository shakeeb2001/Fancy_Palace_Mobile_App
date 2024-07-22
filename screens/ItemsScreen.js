import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import axios from 'axios';
import { BarCodeScanner } from 'expo-barcode-scanner';

const categories = {
  blenders: 'https://fancy-palace-backend.vercel.app/api/blender',
  ceramic: 'https://fancy-palace-backend.vercel.app/api/ceremic',
  fans: 'https://fancy-palace-backend.vercel.app/api/fan',
  gascooker: 'https://fancy-palace-backend.vercel.app/api/gascooker',
  heaterjug: 'https://fancy-palace-backend.vercel.app/api/heaterjug',
  iron: 'https://fancy-palace-backend.vercel.app/iron',
  ricecooker: 'https://fancy-palace-backend.vercel.app/ricecooker',
  soundsystem: 'https://fancy-palace-backend.vercel.app/soundsystem',
  torch: 'https://fancy-palace-backend.vercel.app/torch',
  'plastic-metal': 'https://fancy-palace-backend.vercel.app/metal',
};

const ItemsScreen = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('blenders');
  const [itemCode, setItemCode] = useState('');
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    fetchItems(selectedCategory);
  }, [selectedCategory]);

  const fetchItems = async (category) => {
    try {
      const response = await axios.get(categories[category]);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchItemByCode = async (code) => {
    if (!code) {
      Alert.alert('Error', 'Please enter an item code or scan a barcode');
      return;
    }
    try {
      const response = await axios.get(`${categories[selectedCategory]}/${code}`);
      setItems([response.data]);
    } catch (error) {
      console.error('Error fetching item:', error);
      Alert.alert('Error', 'Item not found');
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setModalVisible(false);
    setItemCode(data);
    fetchItemByCode(data);
  };

  const openScanner = () => {
    if (hasPermission === null) {
      Alert.alert('Requesting for camera permission');
    } else if (hasPermission === false) {
      Alert.alert('No access to camera');
    } else {
      setModalVisible(true);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Name: {item.name}</Text>
      <Text style={styles.itemText}>Code: {item.code}</Text>
      <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
      <Text style={styles.itemText}>Cost Code: {item.costCode}</Text>
      <Text style={styles.itemText}>Cost Price: {item.costPrice}</Text>
      <Text style={styles.itemText}>Tagged Price: {item.taggedPrice}</Text>
      <Text style={styles.itemText}>Selling Price: {item.sellingPrice}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.categorySelector}>
        {Object.keys(categories).map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryButton,
              selectedCategory === key && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(key)}
          >
            <Text style={styles.categoryButtonText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Item Code"
          value={itemCode}
          onChangeText={setItemCode}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => fetchItemByCode(itemCode)}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.scanButton} onPress={openScanner}>
          <Text style={styles.scanButtonText}>Scan Barcode</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContainer}
      />
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={styles.camera}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close Scanner</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#1e90ff',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
  },
  searchButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  listContainer: {
    flexGrow: 1,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  camera: {
    width: '80%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ItemsScreen;
