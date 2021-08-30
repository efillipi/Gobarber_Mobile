import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format, parseISO, isAfter, isToday, addDays } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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
  AppointmentContainer,
  AppointmentAvatar,
  AppointmentInfo,
  AppointmentName,
  AppointmentMeta,
  AppointmentMetaText,
} from './styles';
import {
  selectedStyles,
  availableDaysStyles,
  daysOffStyles,
  unavailableDaysStyles,
} from '../../../utils/Calendar/styles';

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

  const minimumDate = useMemo(() => {
    const firstDate = selectedDate;
    return {
      dateString: `${firstDate.getFullYear()}-${String(
        firstDate.getMonth() + 1,
      ).padStart(2, '0')}-${firstDate.getDate()}`,
    };
  }, [selectedDate]);

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

  const handleDateChange = useCallback((day: CalendarObjects) => {
    const date = new Date(day.timestamp);
    date.setDate(day.day);
    setSelectedDate(date);
  }, []);

  const handleMonthChange = useCallback((month: CalendarObjects) => {
    const date = new Date(month.timestamp);
    setCurrentMonth(date);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: String(selectedDate.getMonth() + 1).padStart(2, '0'),
        },
      })
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [selectedDate, user]);
  useMemo(() => {
    const daysOff: string[] = [];
    const dayOffOne = 5;
    const dayOffTwo = 6;
    const unavailableDays = monthAvailability
      .filter((monthDay) => monthDay.available === false)
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const day = String(monthDay.day).padStart(2, '0');
        const data = `${year}-${month}-${day}`;
        return data;
      });

    const availableDays = monthAvailability
      .filter((monthDay) => monthDay.available === true)
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const day = String(monthDay.day).padStart(2, '0');
        const data = `${year}-${month}-${day}`;
        return data;
      });

    monthAvailability.forEach((monthDay) => {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      const day = String(monthDay.day).padStart(2, '0');
      const data = new Date(`${year}-${month}-${day}`);
      if (data.getDay() === dayOffOne || data.getDay() === dayOffTwo) {
        const data_data = `${year}-${month}-${day}`;
        daysOff.push(data_data);
      }
    });

    const unavailableDaysObjet = unavailableDays.reduce(
      (objet: any, value: any) => {
        objet[value] = unavailableDaysStyles;
        return objet;
      },
      {},
    );

    const availableDaysObjet_unavailableDaysObjet = availableDays.reduce(
      (objet: any, value: any) => {
        objet[value] = availableDaysStyles;
        return objet;
      },
      unavailableDaysObjet,
    );

    // availableDaysObjet_unavailableDaysObjet[selectedDate] =
    //   selectedStyles;

    const availableDaysObjet_unavailableDaysObjet_selectedObject_daysOffObjet =
      daysOff.reduce((objet: any, value: any) => {
        objet[value] = daysOffStyles;
        return objet;
      }, availableDaysObjet_unavailableDaysObjet);

    setMarkedDate(
      availableDaysObjet_unavailableDaysObjet_selectedObject_daysOffObjet,
    );
  }, [currentMonth, monthAvailability, selectedDate]);

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
        <NetxButton onPress={handleBackDay}>
          <Icon name="chevron-left" size={24} color="#ff9000" />
        </NetxButton>

        <TitleButton onPress={() => setModalVisible(!modalVisible)}>
          <TitleContainer>
            <Description>Horários agendados {'\n'}</Description>
            <TitleInfo>{selectedDateAsText}</TitleInfo>
            <TitleInfo>{selectedWeekDay}</TitleInfo>
          </TitleContainer>
        </TitleButton>

        <BackButton onPress={handleNextDay}>
          <Icon name="chevron-right" size={24} color="#ff9000" />
        </BackButton>
      </Title>
      {!modalVisible && (
        <Calendars
          current={selectedDate}
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
