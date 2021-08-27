import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format, parseISO, isAfter, isToday, addDays } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/auth';
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
  TitleContainer,
  Title,
  Description,
  ButtonContainer,
  NextAppointmentContainer,
  NextAppointment,
  AppointmentContainer,
  AppointmentAvatar,
  AppointmentInfo,
  AppointmentName,
  AppointmentMeta,
  AppointmentMetaText,
} from './styles';

import { ProfileScreenNavigationProp } from '../../../routes/StackParamList';

export interface Appointment {
  id: string;
  dateAppointment: string;
  hourFormatted: Date;
  hour: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC<ProfileScreenNavigationProp> = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM ", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBR,
    });
  }, [selectedDate]);

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
          hourFormatted: parseISO(appointment.dateAppointment),
          hour: format(parseISO(appointment.dateAppointment), 'HH:mm'),
        }));

        appointmentsFormatted.sort((a, b) => {
          return a.hour < b.hour ? -1 : 1;
        });

        setAppointments(appointmentsFormatted);
      });
  }, [selectedDate]);

  const morningAvailability = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.hourFormatted.getHours() <= 12,
    );
  }, [appointments]);

  const afternoonAvailability = useMemo(() => {
    return appointments.filter(
      (appointment) => appointment.hourFormatted.getHours() > 12,
    );
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find((appointment) =>
      isAfter(parseISO(appointment.dateAppointment), new Date()),
    );
  }, [appointments]);

  const handleNextDay = useCallback(async () => {
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);
  }, [selectedDate]);

  const handleBackDay = useCallback(async () => {
    const backDay = addDays(selectedDate, -1);
    setSelectedDate(backDay);
  }, [selectedDate]);

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

      <TitleContainer>
        <ButtonContainer onPress={handleBackDay}>
          <Icon name="chevron-left" size={24} color="#ff9000" />
        </ButtonContainer>
        <Title>
          Horários agendados {'\n'}
          <Description>{selectedDateAsText}</Description>
          <Description>{selectedWeekDay}</Description>
        </Title>
        <ButtonContainer onPress={handleNextDay}>
          <Icon name="chevron-right" size={24} color="#ff9000" />
        </ButtonContainer>
      </TitleContainer>
      {isToday(selectedDate) && nextAppointment && (
        <NextAppointmentContainer>
          <SectionTitle>Agendamento a seguir </SectionTitle>

          <NextAppointment onPress={() => console.log(nextAppointment)}>
            <AppointmentMeta>
              <Icon name="clock" size={14} color="#ff9000" />
              <AppointmentMetaText>{nextAppointment?.hour}</AppointmentMetaText>
            </AppointmentMeta>

            <AppointmentInfo>
              <AppointmentAvatar
                source={{ uri: nextAppointment?.user.avatar_url }}
              />
              <AppointmentName>{nextAppointment?.user.name}</AppointmentName>
            </AppointmentInfo>
          </NextAppointment>
        </NextAppointmentContainer>
      )}

      <Schedule>
        <Section>
          <SectionTitle>Manhã</SectionTitle>

          {morningAvailability.length === 0 && (
            <SectionSubTitle>Nenhum agendamento neste período</SectionSubTitle>
          )}
          <SectionContent>
            {morningAvailability.map((appointment) => (
              <AppointmentContainer
                key={appointment.id}
                onPress={() => console.log(appointment)}
              >
                <AppointmentMeta>
                  <Icon name="clock" size={14} color="#ff9000" />
                  <AppointmentMetaText>{appointment.hour}</AppointmentMetaText>
                </AppointmentMeta>

                <AppointmentInfo>
                  <AppointmentAvatar
                    source={{ uri: appointment.user.avatar_url }}
                  />
                  <AppointmentName>{appointment.user.name}</AppointmentName>
                </AppointmentInfo>
              </AppointmentContainer>
            ))}
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Tarde</SectionTitle>
          {afternoonAvailability.length === 0 && (
            <SectionSubTitle>Nenhum agendamento neste período</SectionSubTitle>
          )}
          <SectionContent>
            {afternoonAvailability.map((appointment) => (
              <AppointmentContainer
                key={appointment.id}
                onPress={() => console.log(appointment)}
              >
                <AppointmentMeta>
                  <Icon name="clock" size={14} color="#ff9000" />
                  <AppointmentMetaText>{appointment.hour}</AppointmentMetaText>
                </AppointmentMeta>

                <AppointmentInfo>
                  <AppointmentAvatar
                    source={{ uri: appointment.user.avatar_url }}
                  />
                  <AppointmentName>{appointment.user.name}</AppointmentName>
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
