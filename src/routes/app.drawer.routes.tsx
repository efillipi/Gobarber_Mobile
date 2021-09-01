import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../hooks/auth';
import DrawerNavigation from '../components/DrawerNavigation';
import AppProvider from './appProvider.routes';
import AppUser from './appUser.routes';

import Profile from '../pages/Profile';

const Drawer = createDrawerNavigator();

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  return user.role === 'Provider' ? <MyDrawerProvider /> : <MyDrawerClient />;
};

const MyDrawerClient: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerNavigation props={{ ...props }} />}
      screenOptions={{
        headerShown: false,
        sceneContainerStyle: { backgroundColor: '#312e38' },
        drawerStyle: { backgroundColor: '#312e38', width: `70%` },
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
        name="Profile"
        component={Profile}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="calendar" size={24} color="#312e38" />,
        }}
        name="Meus Agendamentos"
        component={Profile}
      />
    </Drawer.Navigator>
  );
};

const MyDrawerProvider: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerNavigation props={{ ...props }} />}
      screenOptions={{
        headerShown: false,
        sceneContainerStyle: { backgroundColor: '#312e38' },
        drawerStyle: { backgroundColor: '#312e38', width: `70%` },
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
        name="Profile"
        component={Profile}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="calendar" size={24} color="#312e38" />,
        }}
        name="Agendamentos"
        component={Profile}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="image" size={24} color="#312e38" />,
        }}
        name="Portfolio"
        component={Profile}
      />
      <Drawer.Screen
        options={{
          drawerIcon: () => <Icon name="briefcase" size={24} color="#312e38" />,
        }}
        name="Serviços"
        component={Profile}
      />
    </Drawer.Navigator>
  );
};

export default AppRoutes;
