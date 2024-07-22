import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

const categories = {
  blenders: 'https://fancy-palace-backend.vercel.app/api/blender',
  fans: 'https://fancy-palace-backend.vercel.app/api/fan',
  gascooker: 'https://fancy-palace-backend.vercel.app/api/gascooker',
  heaterjug: 'https://fancy-palace-backend.vercel.app/api/heaterjug',
  iron: 'https://fancy-palace-backend.vercel.app/iron',
  ricecooker: 'https://fancy-palace-backend.vercel.app/ricecooker',
  soundsystem: 'https://fancy-palace-backend.vercel.app/soundsystem',
  torch: 'https://fancy-palace-backend.vercel.app/torch',
  'plastic-metal': 'https://fancy-palace-backend.vercel.app/metal',
  ceramic: 'https://fancy-palace-backend.vercel.app/api/ceremic',
};

const CustomCheckbox = ({ isChecked, onChange, label }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={onChange}>
    <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]} />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('');
  const [itemData, setItemData] = useState({
    name: '',
    code: '',
    quantity: '',
    costCode: '',
    costPrice: '',
    taggedPrice: '',
    sellingPrice: '',
  });

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcode(data);
    Alert.alert(`Barcode with type ${type} and data ${data} has been scanned!`);
    setItemData({ ...itemData, code: data });
  };

  const handleInputChange = (name, value) => {
    setItemData({ ...itemData, [name]: value });
  };

  const handleUpdateItem = async () => {
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    try {
      const response = await axios.post(categories[category], itemData);
      Alert.alert('Item Updated Successfully', `Item code: ${response.data.code}`);
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item');
    }
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  if (hasPermission === null) {
    return <Text style={styles.message}>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.message}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Select Category</Text>
          {Object.keys(categories).map((key) => (
            <CustomCheckbox
              key={key}
              label={key}
              isChecked={category === key}
              onChange={() => handleCategoryChange(key)}
            />
          ))}
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={itemData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Item Code"
            value={itemData.code}
            editable={false} // Make the item code field read-only
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={itemData.quantity}
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange('quantity', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Cost Code"
            value={itemData.costCode}
            onChangeText={(value) => handleInputChange('costCode', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Cost Price"
            value={itemData.costPrice}
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange('costPrice', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Tagged Price"
            value={itemData.taggedPrice}
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange('taggedPrice', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Selling Price"
            value={itemData.sellingPrice}
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange('sellingPrice', value)}
          />
          {scanned && (
            <TouchableOpacity style={styles.scanButton} onPress={() => setScanned(false)}>
              <Text style={styles.scanButtonText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateItem}>
            <Text style={styles.updateButtonText}>Update Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  cameraContainer: {
    height: 200,
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  camera: {
    height: '100%',
    width: '100%',
  },
  scanButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    flex: 0,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 20,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 8,
  },
  checkedCheckbox: {
    backgroundColor: '#1e90ff',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ScanScreen;
