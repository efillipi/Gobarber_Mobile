/* eslint-disable @typescript-eslint/no-explicit-any */
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
  HourContainer,
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
  const minimumDate = useMemo(() => {
    const firstDate = new Date();
    return {
      day: firstDate.getDate(),
      month: firstDate.getMonth() + 1,
      year: firstDate.getFullYear(),
      timestamp: firstDate.getTime(),
      dateString: `${firstDate.getFullYear()}-${String(
        firstDate.getMonth() + 1,
      ).padStart(2, '0')}-${firstDate.getDate()}`,
    };
  }, []);
  const { user } = useAuth();
  const params = route.params as RouteParams;

  const [selectedProvider, setSelectedProvider] = useState<string>(
    params.providerId,
  );

  const [selectedDate, setSelectedDate] =
    useState<CalendarObjects>(minimumDate);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [selectedHour, setSelectedHour] = useState(0);
  const [markedDate, setMarkedDate] = useState({});

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
          year: currentMonth.getFullYear(),
          month: String(currentMonth.getMonth() + 1).padStart(2, '0'),
        },
      })
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, selectedProvider]);

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

    const unavailableDaysObjet = unavailableDays.reduce(
      (objet: any, value: any) => {
        objet[value] = {
          disableTouchEvent: true,
          customStyles: {
            container: {
              backgroundColor: '#3e3b4749',
            },
            text: {
              color: '#f4ede89b',
            },
          },
        };
        return objet;
      },
      {},
    );

    const availableDaysObjet_unavailableDaysObjet = availableDays.reduce(
      (objet: any, value: any) => {
        objet[value] = {
          customStyles: {
            container: {
              backgroundColor: '#3e3b47',
            },
            text: {
              color: '#f4ede8',
            },
          },
        };
        return objet;
      },
      unavailableDaysObjet,
    );

    availableDaysObjet_unavailableDaysObjet[selectedDate.dateString] = {
      selected: true,
      selectedColor: '#ff9000',
      selectedTextColor: '#232129',
    };

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

    const availableDaysObjet_unavailableDaysObjet_disableObjet = daysOff.reduce(
      (objet: any, value: any) => {
        objet[value] = {
          disableTouchEvent: true,
          customStyles: {
            text: {
              color: '#f4ede89b',
            },
          },
        };
        return objet;
      },
      availableDaysObjet_unavailableDaysObjet,
    );

    setMarkedDate(availableDaysObjet_unavailableDaysObjet_disableObjet);
  }, [currentMonth, monthAvailability, selectedDate]);

  useEffect(() => {
    api
      .get(`/providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.year,
          month: String(selectedDate.month).padStart(2, '0'),
          day: String(selectedDate.day).padStart(2, '0'),
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

  const handleMonthChange = useCallback((month: CalendarObjects) => {
    const date = new Date(month.timestamp);
    setCurrentMonth(date);
  }, []);

  const handleDateChange = useCallback((day: CalendarObjects) => {
    setSelectedDate(day);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = `${selectedDate.dateString}T${String(selectedHour).padStart(
        2,
        '0',
      )}:00`;
      const AppointmentCreated = new Date(date);

      console.log('handleCreateAppointment date', date);
      console.log(
        'handleCreateAppointment AppointmentCreated',
        AppointmentCreated,
      );

      await api.post('appointments', {
        provider_id: selectedProvider,
        dateAppointment: date,
      });
      navigation.navigate('AppointmentCreated', {
        date: AppointmentCreated.getTime(),
      });
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
              handleDateChange(day);
            }}
            onMonthChange={(month) => {
              handleMonthChange(month);
            }}
            markingType="custom"
            markedDates={markedDate}
          />
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ hourFormatted, hour, available }) => (
                <HourContainer
                  onPress={() => {
                    setSelectedHour(hour);
                  }}
                >
                  <Hour
                    available={available}
                    selected={hour === selectedHour}
                    key={hourFormatted}
                  >
                    <HourText selected={hour === selectedHour}>
                      {hourFormatted}
                    </HourText>
                  </Hour>
                </HourContainer>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(
                ({ hourFormatted, hour, available }) => (
                  <HourContainer
                    onPress={() => {
                      setSelectedHour(hour);
                    }}
                  >
                    <Hour
                      available={available}
                      selected={hour === selectedHour}
                      key={hourFormatted}
                    >
                      <HourText selected={hour === selectedHour}>
                        {hourFormatted}
                      </HourText>
                    </Hour>
                  </HourContainer>
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
