import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardUsers from '../pages/Dashboard/users';
import Profile from '../pages/Profile';
import AppointmentDatePicker from '../pages/AppointmentDatePicker';
import AppointmentCreated from '../pages/AppointmentCreated';
import AppointmentConfirmation from '../pages/AppointmentConfirmation';
import AppointmentsById from '../pages/AppointmentsById';

const App = createNativeStackNavigator();

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
    <App.Screen name="Agendamento" component={AppointmentsById} />
  </App.Navigator>
);

export default AppRoutesUser;
