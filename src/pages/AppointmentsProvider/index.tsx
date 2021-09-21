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
  AppointmentContainer,
  AppointmentInfo,
  AppointmentMeta,
  AppointmentMetaText,
  AppointmentMetaDescription,
  AppointmentMetaIcon,
  ProvidersList,
  ProvidersListTitle,
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

const Dashboard: React.FC<ProfileScreenNavigationProp> = ({ navigation }) => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    api
      .get<Appointment[]>('/appointments', {
        params: {
          approved: false,
        },
      })
      .then((response) => {
        const appointmentsFormatted = response.data.map((appointment) => ({
          ...appointment,
          hour: format(parseISO(appointment.dateAppointment), 'HH:mm'),
          dateFormatted: format(
            parseISO(appointment.dateAppointment),
            "dd'/'MM",
            {
              locale: ptBR,
            },
          ),
        }));

        appointmentsFormatted.sort((a, b) => {
          return a.dateAppointment < b.dateAppointment ? -1 : 1;
        });

        setAppointments(appointmentsFormatted);
      });
  }, [user, appointments]);

  const handleApproved = useCallback((id_appointment: string) => {
    api.post(`/appointments/${id_appointment}/approval`, {
      params: {
        approved: false,
      },
    });
  }, []);

  const handleRejection = useCallback((id_appointment: string) => {
    api.post(`/appointments/${id_appointment}/rejection`, {
      params: {
        approved: false,
      },
    });
  }, []);

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
      <ProvidersList
        data={appointments}
        keyExtractor={(appointment) => appointment.id}
        ListHeaderComponent={
          <ProvidersListTitle>Futuros Agendamentos</ProvidersListTitle>
        }
        renderItem={({ item: appointment }) => (
          <AppointmentContainer key={appointment.id}>
            <AppointmentMeta>
              <AppointmentMetaDescription>
                {appointment?.dateFormatted}
              </AppointmentMetaDescription>
              <AppointmentMetaDescription>
                {appointment?.hour}
              </AppointmentMetaDescription>
            </AppointmentMeta>

            <AppointmentInfo>
              <AppointmentMetaText>{appointment.user.name}</AppointmentMetaText>
              <AppointmentMetaIcon
                onPress={() => handleApproved(appointment.id)}
              >
                <Icon name="check-square" size={24} color="#04d361" />
              </AppointmentMetaIcon>
              <AppointmentMetaIcon
                onPress={() => handleRejection(appointment.id)}
              >
                <Icon name="x-square" size={24} color="#c53030" />
              </AppointmentMetaIcon>
            </AppointmentInfo>
          </AppointmentContainer>
        )}
      />
    </Container>
  );
};
export default Dashboard;
