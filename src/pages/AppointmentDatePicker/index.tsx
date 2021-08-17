import React from 'react';
import { View, Button } from 'react-native';

import { useRoute } from '@react-navigation/native';

import { ProfileScreenNavigationProp } from '../../routes/StackParamList';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface RouteParams {
  providerId: string;
}

const AppointmentCreated: React.FC<ProfileScreenNavigationProp> = ({
  navigation,
}) => {
  const route = useRoute();

  const params = route.params as RouteParams;

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button
        title="Provider"
        onPress={() => {
          navigation.navigate('AppointmentCreated', {
            providerId: params.providerId,
          });
        }}
      />
      <Button title=" Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default AppointmentCreated;
