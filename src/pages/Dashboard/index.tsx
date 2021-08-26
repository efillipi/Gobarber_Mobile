import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  AppointmentsList,
  AppointmentsListTitle,
  AppointmentContainer,
  AppointmentAvatar,
  AppointmentInfo,
  AppointmentName,
  AppointmentMeta,
  AppointmentMetaText,
} from './styles';

import { ProfileScreenNavigationProp } from '../../routes/StackParamList';

interface Appointment {
  id: string;
  dateAppointment: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC<ProfileScreenNavigationProp> = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    api
      .get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((response) => {
        const appointmentsFormatted = response.data.map((appointment) => ({
          ...appointment,
          hourFormatted: format(parseISO(appointment.dateAppointment), 'HH:mm'),
        }));

        setAppointments(appointmentsFormatted);
      });
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo, {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={() => navigation.navigate('Profile')}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>
      </Header>

      <AppointmentsList
        data={appointments}
        keyExtractor={(appointment) => appointment.id}
        ListHeaderComponent={
          <AppointmentsListTitle>Agendamento a seguir</AppointmentsListTitle>
        }
        renderItem={({ item: appointment }) => (
          <AppointmentContainer onPress={() => console.log(appointment.id)}>
            <AppointmentAvatar source={{ uri: appointment.user.avatar_url }} />
            <AppointmentInfo>
              <AppointmentName>{appointment.user.name}</AppointmentName>
            </AppointmentInfo>
          </AppointmentContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
