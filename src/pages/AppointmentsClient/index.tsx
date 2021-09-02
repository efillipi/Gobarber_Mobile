import React, { useState, useEffect, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  ProfileButton,
  UserAvatar,
  Schedule,
  Section,
  SectionTitle,
  SectionSubTitle,
  SectionContent,
  TitleInfo,
  BackButton,
  AppointmentBorder,
  NextAppointmentContainer,
  NextAppointment,
  AppointmentContainer,
  AppointmentInfo,
  AppointmentMeta,
  AppointmentMetaText,
} from './styles';
import { ProfileScreenNavigationProp } from '../../routes/StackParamList';

export interface Appointment {
  id: string;
  dateAppointment: string;
  dateFormatted: string;
  hour: string;
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
          id_client: user.id,
        },
      })
      .then((response) => {
        const appointmentsFormatted = response.data.map((appointment) => ({
          ...appointment,
          hour: format(parseISO(appointment.dateAppointment), 'HH:mm'),
          dateFormatted: format(
            parseISO(appointment.dateAppointment),
            "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
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
  }, [user]);

  const nextAppointment = useMemo(() => {
    return appointments.find((appointment) =>
      isAfter(parseISO(appointment.dateAppointment), new Date()),
    );
  }, [appointments]);

  const futureAppointments = useMemo(() => {
    return appointments.filter((appointment) =>
      isAfter(new Date(appointment.dateAppointment), new Date()),
    );
  }, [appointments]);

  const aastAppointments = useMemo(() => {
    return appointments.filter((appointment) =>
      isBefore(new Date(appointment.dateAppointment), new Date()),
    );
  }, [appointments]);

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

      {nextAppointment && (
        <NextAppointmentContainer>
          <TitleInfo>Agendamento a seguir </TitleInfo>

          <NextAppointment>
            <AppointmentMeta>
              <Icon name="calendar" size={24} color="#ff9000" />
            </AppointmentMeta>

            <AppointmentInfo next>
              <AppointmentBorder />
              <AppointmentMetaText>
                {nextAppointment?.dateFormatted}
              </AppointmentMetaText>
            </AppointmentInfo>
          </NextAppointment>
        </NextAppointmentContainer>
      )}
      <Schedule>
        <Section>
          <SectionTitle>Agendamentos Futuros</SectionTitle>
          {futureAppointments.length === 0 && (
            <SectionSubTitle>Nenhum agendamento neste período</SectionSubTitle>
          )}
          <SectionContent>
            {futureAppointments.map((appointment) => (
              <AppointmentContainer key={appointment.id}>
                <AppointmentMeta>
                  <Icon name="calendar" size={24} color="#ff9000" />
                </AppointmentMeta>

                <AppointmentInfo>
                  <AppointmentMetaText>
                    {appointment?.dateFormatted}
                  </AppointmentMetaText>
                </AppointmentInfo>
              </AppointmentContainer>
            ))}
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Agendamentos Antigos</SectionTitle>
          {aastAppointments.length === 0 && (
            <SectionSubTitle>Nenhum agendamento neste período</SectionSubTitle>
          )}
          <SectionContent>
            {aastAppointments.map((appointment) => (
              <AppointmentContainer key={appointment.id}>
                <AppointmentMeta>
                  <Icon name="calendar" size={24} color="#ff9000" />
                </AppointmentMeta>

                <AppointmentInfo>
                  <AppointmentMetaText>
                    {appointment?.dateFormatted}
                  </AppointmentMetaText>
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
