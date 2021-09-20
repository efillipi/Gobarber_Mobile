import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format, parseISO, isAfter, isToday, addDays } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import OneSignal from 'react-native-onesignal';
import Calendars from '../../../components/Calendar';
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
  TitleInfo,
  TitleButton,
  NetxButton,
  BackButton,
  NextAppointmentContainer,
  NextAppointment,
  AppointmentBorder,
  AppointmentContainer,
  AppointmentAvatar,
  AppointmentInfo,
  AppointmentName,
  AppointmentMeta,
  AppointmentMetaText,
} from './styles';
import { objectTransformProvider } from '../../../utils/Calendar/objectTransform';
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

interface CalendarObjects {
  day: number;
  month: number;
  year: number;
  timestamp: number;
  dateString: string;
}

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const Dashboard: React.FC<ProfileScreenNavigationProp> = ({ navigation }) => {
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [markedDate, setMarkedDate] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    // OneSignal Init Code
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId('54f801e4-ad9c-4ce2-8812-a390df3a1e01');
    // END OneSignal Init Code
  }, []);

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

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: String(currentMonth.getMonth() + 1).padStart(2, '0'),
        },
      })
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user]);

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

  useMemo(() => {
    setMarkedDate(
      objectTransformProvider({
        currentMonth,
        monthAvailability,
        selectedDate,
      }),
    );
  }, [currentMonth, monthAvailability, selectedDate]);

  const handleNextDay = useCallback(async () => {
    const nextDay = addDays(selectedDate, 1);
    setSelectedDate(nextDay);
  }, [selectedDate]);

  const handleBackDay = useCallback(async () => {
    const backDay = addDays(selectedDate, -1);
    setSelectedDate(backDay);
  }, [selectedDate]);

  const handleDateChange = useCallback((day: CalendarObjects) => {
    const date = new Date(addDays(day.timestamp, 1));
    setSelectedDate(date);
  }, []);

  const handleMonthChange = useCallback((month: CalendarObjects) => {
    const date = new Date(month.timestamp);
    setCurrentMonth(date);
  }, []);

  const handleCalendarChange = useCallback(() => {
    setModalVisible(!modalVisible);
  }, [modalVisible]);

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

      <Title>
        {!modalVisible && (
          <NetxButton onPress={handleBackDay}>
            <Icon name="chevron-left" size={24} color="#ff9000" />
          </NetxButton>
        )}

        <TitleButton onPress={handleCalendarChange}>
          <TitleContainer>
            <Description>Horários agendados {'\n'}</Description>
            <TitleInfo>{selectedDateAsText}</TitleInfo>
            <TitleInfo>{selectedWeekDay}</TitleInfo>
          </TitleContainer>
        </TitleButton>
        {!modalVisible && (
          <BackButton onPress={handleNextDay}>
            <Icon name="chevron-right" size={24} color="#ff9000" />
          </BackButton>
        )}
      </Title>
      {modalVisible && (
        <Calendars
          current={currentMonth}
          onDayPress={(day) => {
            handleDateChange(day);
          }}
          onMonthChange={(month) => {
            handleMonthChange(month);
          }}
          markingType="custom"
          markedDates={markedDate}
        />
      )}

      {isToday(selectedDate) && nextAppointment && (
        <NextAppointmentContainer>
          <SectionTitle>Agendamento a seguir </SectionTitle>

          <NextAppointment>
            <AppointmentMeta>
              <Icon name="clock" size={14} color="#ff9000" />
              <AppointmentMetaText>{nextAppointment?.hour}</AppointmentMetaText>
            </AppointmentMeta>

            <AppointmentInfo next>
              <AppointmentBorder />
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
              <AppointmentContainer key={appointment.id}>
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
              <AppointmentContainer key={appointment.id}>
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
