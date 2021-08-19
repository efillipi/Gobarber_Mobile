import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { Alert } from 'react-native';

import Calendars from '../../components/Calendar';
import { ProfileScreenNavigationProp } from '../../routes/StackParamList';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  BackButton,
  UserAvatar,
  Title,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface RouteParams {
  providerId: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

interface SelectedDate {
  day: number;
  month: number;
  year: number;
  timestamp: number;
  dateString: string;
}

const AppointmentDatePicker: React.FC<ProfileScreenNavigationProp> = ({
  navigation,
  route,
}) => {
  const { user } = useAuth();

  const { providerId } = route.params as RouteParams;

  const selectedProvider = providerId;

  const minimumDate = useMemo(() => {
    const today = new Date();

    const dateAlter = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
      dateString: `${today}`,
      timestamp: today.getTime(),
    };

    return dateAlter;
  }, []);

  const [selectedDate, setSelectedDate] = useState<SelectedDate>(minimumDate);
  const [selectedHour, setSelectedHour] = useState(0);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

  useEffect(() => {
    api
      .get(`/providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.year,
          month: selectedDate.month,
          day: selectedDate.day,
        },
      })
      .then((response) => {
        setAvailability(response.data);
        setSelectedHour(0);
      });
  }, [selectedProvider, selectedDate]);

  const handleCreateAppointment = useCallback(async () => {
    const { year, month, day } = selectedDate;
    try {
      const date = new Date(year, month - 1, day);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        dateAppointment: date,
      });

      navigation.navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert('Erro ao criar agendamento', `${err.response.data.message}`);
    }
  }, [selectedProvider, selectedDate, selectedHour, navigation]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour <= 12)
      .map(({ hour, available }) => ({
        hour,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        available,
      }));
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour > 12)
      .map(({ hour, available }) => ({
        hour,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        available,
      }));
  }, [availability]);

  return (
    <>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
      <Container>
        <Schedule>
          <Title>Calendario</Title>
          <Calendars
            onDayPress={(day) => {
              setSelectedDate(day);
              console.log('Select.day', day);
            }}
            // markedDates={{
            //   [selectedDate.dateString]: {
            //     selectedColor: '#FF9000',
            //     selectedTextColor: '#f4ede8',
            //     selected: true,
            //   },
            // }}
          />

          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ hourFormatted, hour, available }) => (
                <Hour
                  available={available}
                  selected={hour === selectedHour}
                  onPress={() => {
                    setSelectedHour(hour);
                  }}
                  key={hourFormatted}
                >
                  <HourText selected={hour === selectedHour}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(
                ({ hourFormatted, hour, available }) => (
                  <Hour
                    available={available}
                    selected={hour === selectedHour}
                    onPress={() => setSelectedHour(hour)}
                    key={hourFormatted}
                  >
                    <HourText selected={hour === selectedHour}>
                      {hourFormatted}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Container>
    </>
  );
};

export default AppointmentDatePicker;
