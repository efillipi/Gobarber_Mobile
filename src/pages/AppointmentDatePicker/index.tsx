/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { addDays, format } from 'date-fns';
import { Alert } from 'react-native';
import Calendars from '../../components/Calendar';
import { ProfileScreenNavigationProp } from '../../routes/StackParamList';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { objectTransformClient } from '../../utils/Calendar/objectTransform';
import {
  Container,
  Header,
  BackButton,
  ProfileButton,
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

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface CalendarObjects {
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
  const params = route.params as RouteParams;

  const [selectedProvider, setSelectedProvider] = useState<string>(
    params.providerId,
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedHourAvailable, setSelectedHourAvailable] = useState(false);

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

  useEffect(() => {
    api
      .get(`/providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: String(selectedDate.getMonth() + 1).padStart(2, '0'),
          day: String(selectedDate.getDate()).padStart(2, '0'),
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

  const handleDateChange = useCallback((day: CalendarObjects) => {
    const date = new Date(addDays(day.timestamp, 1));
    setSelectedDate(date);
  }, []);

  const handleMonthChange = useCallback((month: CalendarObjects) => {
    const date = new Date(month.timestamp);
    setCurrentMonth(date);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    if (selectedHourAvailable === false) {
      Alert.alert('Hor??rio Bloqueado', 'Por favor, escolha outro hor??rio ');
    } else {
      const date = selectedDate;

      date.setHours(selectedHour);
      date.setMinutes(0);

      const findProdiver = providers.find(
        (provider) => provider.id === selectedProvider,
      );

      const provider = {
        id: findProdiver?.id as string,
        name: findProdiver?.name as string,
        avatar_url: findProdiver?.avatar_url as string,
      };

      navigation.navigate('AppointmentConfirmation', {
        date: date.getTime(),
        provider,
      });
    }
  }, [
    selectedProvider,
    selectedDate,
    selectedHour,
    navigation,
    providers,
    selectedHourAvailable,
  ]);

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

  useMemo(() => {
    setMarkedDate(
      objectTransformClient({
        currentMonth,
        monthAvailability,
        selectedDate,
      }),
    );
  }, [currentMonth, monthAvailability, selectedDate]);

  return (
    <>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <ProfileButton onPress={() => navigation.navigate('Profile')}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>
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
          <Title>Escolha o hor??rio</Title>

          <Section>
            <SectionTitle>Manh??</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ hourFormatted, hour, available }) => (
                <HourContainer
                  key={hourFormatted}
                  onPress={() => {
                    setSelectedHour(hour);
                    setSelectedHourAvailable(available);
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
                    key={hourFormatted}
                    onPress={() => {
                      setSelectedHour(hour);
                      setSelectedHourAvailable(available);
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
