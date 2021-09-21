import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format, parseISO } from 'date-fns';
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
  Schedule,
  Section,
  SectionTitle,
  SectionSubTitle,
  SectionContent,
  AppointmentContainer,
  AppointmentInfo,
  AppointmentMeta,
  AppointmentMetaText,
  AppointmentMetaDescription,
  AppointmentMetaIcon,
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
  const [atualizar, setatualizar] = useState('');

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
  }, [user, atualizar]);

  const handleApproved = useCallback((id_appointment: string) => {
    api.post(`/appointments/${id_appointment}/approval`, {
      params: {
        approved: false,
      },
    });
    setatualizar('handleApproved');
  }, []);

  const handleRejection = useCallback((id_appointment: string) => {
    api.post(`/appointments/${id_appointment}/rejection`, {
      params: {
        approved: false,
      },
    });
    setatualizar('handleRejection');
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

      <Schedule>
        <Section>
          <SectionTitle>Agendamentos Futuros</SectionTitle>
          {appointments.length === 0 && (
            <SectionSubTitle>Nenhum agendamento neste período</SectionSubTitle>
          )}
          <SectionContent>
            {appointments.map((appointment) => (
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
                  <AppointmentMetaText>
                    {appointment.user.name}
                  </AppointmentMetaText>
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
            ))}
          </SectionContent>
        </Section>
      </Schedule>
    </Container>
  );
};
export default Dashboard;
