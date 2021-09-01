import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
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
        drawerStyle: { backgroundColor: '#312e38', width: 250 },
        drawerActiveBackgroundColor: '#3e3b47',
        drawerLabelStyle: {
          fontSize: 18,
          color: '#fff',
        },
      }}
    >
      <Drawer.Screen name="Home" component={AppUser} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="asdd" component={Profile} />
      <Drawer.Screen name="sdas" component={Profile} />
      <Drawer.Screen name="zcz" component={Profile} />
      <Drawer.Screen name="das" component={Profile} />
      <Drawer.Screen name="zxc" component={Profile} />
      <Drawer.Screen name="Proxxfile" component={Profile} />
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
        drawerStyle: { backgroundColor: '#312e38', width: 250 },
        drawerActiveBackgroundColor: '#3e3b47',
        drawerLabelStyle: {
          fontSize: 18,
          color: '#fff',
        },
      }}
    >
      <Drawer.Screen name="Home" component={AppProvider} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
};

export default AppRoutes;
