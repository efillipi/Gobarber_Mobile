import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AppRoutes from './app.routes';
import Profile from '../pages/Profile';

const Drawer = createDrawerNavigator();

const MyDrawer: React.FC = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        sceneContainerStyle: { backgroundColor: '#312e38' },
        drawerStyle: { backgroundColor: '#312e38', width: 150 },
        drawerActiveBackgroundColor: '#3e3b47',
        drawerLabelStyle: {
          fontSize: 18,

          color: '#fff',
        },
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home" component={AppRoutes} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
};

export default MyDrawer;
