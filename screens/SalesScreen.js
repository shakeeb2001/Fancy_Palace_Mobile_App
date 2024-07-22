// SalesScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';

const SalesScreen = () => {
  const [sales, setSales] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAllSales = async () => {
    try {
      const response = await axios.get('https://fancy-palace-backend.vercel.app/api/sales');
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      Alert.alert('Error', 'Failed to fetch sales');
    }
  };

  const fetchSalesByDate = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please enter both start and end dates');
      return;
    }

    try {
      const response = await axios.get('https://fancy-palace-backend.vercel.app/api/sales/date', {
        params: { startDate, endDate },
      });
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales by date:', error);
      Alert.alert('Error', 'Failed to fetch sales by date');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>ID: {item._id}</Text>
      <Text style={styles.itemText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.itemText}>Amount: {item.amount || 'N/A'}</Text>
      {/* Add other relevant sales fields here */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={fetchAllSales}>
          <Text style={styles.buttonText}>Get All Sales</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dateContainer}>
        <TextInput
          style={styles.input}
          placeholder="Start Date (YYYY-MM-DD)"
          value={startDate}
          onChangeText={setStartDate}
        />
        <TextInput
          style={styles.input}
          placeholder="End Date (YYYY-MM-DD)"
          value={endDate}
          onChangeText={setEndDate}
        />
        <TouchableOpacity style={styles.button} onPress={fetchSalesByDate}>
          <Text style={styles.buttonText}>Get Sales by Date</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sales}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  dateContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
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
});

export default SalesScreen;
