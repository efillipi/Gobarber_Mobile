import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardProviders from '../pages/Dashboard/providers';
import Profile from '../pages/Profile';

const App = createNativeStackNavigator();

const AppRoutesProvider: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#312e38' },
    }}
  >
    <App.Screen name="Dashboard" component={DashboardProviders} />
    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
);

export default AppRoutesProvider;
