import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  BackButton,
  Header,
  ProfileButton,
  UserAvatar,
} from './styles';
import { ProfileScreenNavigationProp } from '../../routes/StackParamList';

export interface Appointment {
  id: string;
  dateAppointment: string;
  dateFormatted: string;
  hour: string;
  provider: {
    name: string;
  };
  user: {
    name: string;
    avatar_url: string;
  };
}

const AppointmentsById: React.FC<ProfileScreenNavigationProp> = ({
  navigation,
}) => {
  const { user } = useAuth();

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <ProfileButton onPress={() => navigation.navigate('Profile')}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>
      </Header>
    </Container>
  );
};
export default AppointmentsById;
