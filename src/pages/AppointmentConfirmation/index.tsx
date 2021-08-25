import React, { useMemo, useCallback } from 'react';
import { Alert, Image } from 'react-native';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { ProfileScreenNavigationProp } from '../../routes/StackParamList';
import api from '../../services/api';
import logoImg from '../../assets/logo.png';

import {
  Container,
  ImageContainer,
  Avatar,
  Title,
  Description,
  ButtonContainer,
  OkButton,
  CancelButton,
  ButtonText,
} from './styles';

interface RouteParams {
  date: Date;
  provider: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

const AppointmentConfirmation: React.FC<ProfileScreenNavigationProp> = ({
  navigation,
  route,
}) => {
  const { date, provider } = route.params as RouteParams;

  const formattedDate = useMemo(() => {
    return format(date, "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'", {
      locale: ptBR,
    });
  }, [date]);

  const handleOk = useCallback(async () => {
    try {
      await api.post('appointments', {
        provider_id: provider.id,
        dateAppointment: date,
      });
      navigation.navigate('AppointmentCreated', {
        date: date.getTime(),
      });
    } catch (err) {
      Alert.alert('Erro ao criar agendamento', `${err.response.data.message}`);
    }

    navigation.goBack();
  }, [navigation, date, provider.id]);

  const handleCancel = useCallback(async () => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Container>
      <ImageContainer>
        <Image source={logoImg} />
      </ImageContainer>

      <Avatar source={{ uri: provider.avatar_url }} />

      <Title>Confimar Agendamento</Title>
      <Description>{formattedDate}</Description>
      <Description>Com {provider.name}</Description>
      <ButtonContainer>
        <OkButton onPress={handleOk}>
          <ButtonText>SIM</ButtonText>
        </OkButton>

        <CancelButton onPress={handleCancel}>
          <ButtonText>NÃO</ButtonText>
        </CancelButton>
      </ButtonContainer>
    </Container>
  );
};

export default AppointmentConfirmation;
