import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Feather';
import OneSignal from 'react-native-onesignal';
import { useAuth } from '../hooks/auth';
import DrawerNavigation from '../components/DrawerNavigation';
import AppProvider from './appProvider.routes';
import AppUser from './appUser.routes';
import AppointmentsClient from '../pages/AppointmentsClient';
import AppointmentsProvider from '../pages/AppointmentsProvider';
import Profile from '../pages/Profile';

const Drawer = createDrawerNavigator();

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    OneSignal.setAppId('54f801e4-ad9c-4ce2-8812-a390df3a1e01');
    OneSignal.setExternalUserId(user.id);
  }, [user]);

  return user.role === 'Provider' ? <MyDrawerProvider /> : <MyDrawerClient />;
};

const MyDrawerProvider: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerNavigation props={{ ...props }} />}
      screenOptions={{
        headerShown: false,
        sceneContainerStyle: { backgroundColor: '#312e38' },
        drawerStyle: { backgroundColor: '#312e38', width: '75%' },
        drawerActiveBackgroundColor: '#ff9000',
        drawerInactiveBackgroundColor: '#3e3b47',
        drawerActiveTintColor: '#312e38',
        drawerInactiveTintColor: '#fff',
        drawerLabelStyle: {
          fontSize: 18,
        },
      }}
    >
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="home" size={24} color="#312e38" />,
        }}
        name="Home"
        component={AppProvider}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="smile" size={24} color="#312e38" />,
        }}
        name="Perfil"
        component={Profile}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="calendar" size={24} color="#312e38" />,
        }}
        name="Agendamentos"
        component={AppointmentsProvider}
      />
    </Drawer.Navigator>
  );
};

const MyDrawerClient: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerNavigation props={{ ...props }} />}
      screenOptions={{
        headerShown: false,
        sceneContainerStyle: { backgroundColor: '#312e38' },
        drawerStyle: { backgroundColor: '#312e38', width: '75%' },
        drawerActiveBackgroundColor: '#ff9000',
        drawerInactiveBackgroundColor: '#3e3b47',
        drawerActiveTintColor: '#312e38',
        drawerInactiveTintColor: '#fff',
        drawerLabelStyle: {
          fontSize: 18,
        },
      }}
    >
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="home" size={24} color="#312e38" />,
        }}
        name="Home"
        component={AppUser}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="smile" size={24} color="#312e38" />,
        }}
        name="Perfil"
        component={Profile}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="calendar" size={24} color="#312e38" />,
        }}
        name="Agendamentos"
        component={AppointmentsClient}
      />
    </Drawer.Navigator>
  );
};

export default AppRoutes;
