import React, { useMemo, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import { Text } from 'react-native';
import { ProfileScreenNavigationProp } from '../../routes/StackParamList';

import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';

interface RouteParams {
  providerId: string;
}

const AppointmentCreated: React.FC<ProfileScreenNavigationProp> = ({
  navigation,
  route,
}) => {
  const params = route.params as RouteParams;

  const handleOk = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Dashboard',
        },
      ],
    });
  }, [navigation]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído</Title>
      <Text>{params.providerId}</Text>
      <OkButton onPress={handleOk}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
