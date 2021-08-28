import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/auth';

import DashboardProviders from '../pages/Dashboard/providers';
import DashboardUsers from '../pages/Dashboard/users';
import Test from '../pages/Dashboard';
import Profile from '../pages/Profile';
import AppointmentDatePicker from '../pages/AppointmentDatePicker';
import AppointmentCreated from '../pages/AppointmentCreated';
import AppointmentConfirmation from '../pages/AppointmentConfirmation';

const App = createNativeStackNavigator();

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  return user.role === 'Provider' ? <AppRoutesProvider /> : <AppRoutesUser />;
};

const AppRoutesUser: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#312e38' },
    }}
  >
    <App.Screen name="Dashboard" component={DashboardUsers} />
    <App.Screen name="Profile" component={Profile} />
    <App.Screen
      name="AppointmentDatePicker"
      component={AppointmentDatePicker}
    />
    <App.Screen
      name="AppointmentConfirmation"
      component={AppointmentConfirmation}
    />
    <App.Screen name="AppointmentCreated" component={AppointmentCreated} />
  </App.Navigator>
);

const AppRoutesProvider: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#312e38' },
    }}
  >
    <App.Screen name="Dashboard" component={DashboardProviders} />
    <App.Screen name="Test" component={Test} />
    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
);

export default AppRoutes;
