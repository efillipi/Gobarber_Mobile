import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardProviders from '../pages/Dashboard/providers';
import DashboardUsers from '../pages/Dashboard/users';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import AppointmentDatePicker from '../pages/AppointmentDatePicker';
import AppointmentCreated from '../pages/AppointmentCreated';
import AppointmentConfirmation from '../pages/AppointmentConfirmation';

const App = createNativeStackNavigator();

const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#312e38' },
    }}
  >
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="DashboardProviders" component={DashboardProviders} />
    <App.Screen name="DashboardUsers" component={DashboardUsers} />
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

export default AppRoutes;
