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
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
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

const AppointmentDatePicker: React.FC<ProfileScreenNavigationProp> = ({
  navigation,
  route,
}) => {
  const { user } = useAuth();
  const params = route.params as RouteParams;

  const [selectedProvider, setSelectedProvider] = useState<string>(
    params.providerId,
  );

  const minimumDate = useMemo(() => {
    const date = new Date();
    return {
      day: date.getDay(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      timestamp: date.getTime(),
      dateString: `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDay()}`,
    };
  }, []);

  const [selectedDate, setSelectedDate] =
    useState<CalendarObjects>(minimumDate);

  const [disabledDay, setDisabledDay] = useState({});

  const [selectedHour, setSelectedHour] = useState(0);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  useEffect(() => {
    api.get('providers').then((response) => {
      setProviders(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${selectedProvider}/month-availability`, {
        params: {
          year: selectedDate.year,
          month: selectedDate.month,
        },
      })
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const daysFull = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => monthDay.available === false)
      .map((monthDay) => {
        const { year } = selectedDate;
        const { month } = selectedDate;
        return `'${year}-${month}-${monthDay.day}':{{disabled: true, disableTouchEvent: true}},`;
      });

    return dates;
  }, [selectedDate, monthAvailability]);

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

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate.timestamp);

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
        <HeaderTitle>Cabelereiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
      <Container>
        <ProvidersListContainer>
          <ProvidersList
            data={providers}
            keyExtractor={(provider) => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProvider}
                onPress={() => handleSelectProvider(provider.id)}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>
        <Calendar>
          <Title>Escolha a data</Title>
          <Calendars
            onDayPress={(day) => {
              setSelectedDate(day);
            }}
            onMonthChange={(month) => {
              setSelectedDate(month);
            }}
          />
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ hourFormatted, hour, available }) => (
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
