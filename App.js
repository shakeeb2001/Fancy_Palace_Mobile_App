import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Import the SalesScreen
import SalesScreen from './screens/SalesScreen';
import ScanScreen from './screens/ScanScreen';
import ItemsScreen from './screens/ItemsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Scan" component={ScanScreen} />
        <Tab.Screen name="Items" component={ItemsScreen} />
        <Tab.Screen name="Sales" component={SalesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
