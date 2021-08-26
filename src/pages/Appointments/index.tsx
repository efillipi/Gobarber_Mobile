import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  Calendar,
  Title,
} from './styles';
import {
  selectedStyles,
  availableDaysStyles,
  daysOffStyles,
  unavailableDaysStyles,
  pastDaysStyles,
} from '../../utils/Calendar/styles';
import Calendars from '../../components/Calendar';
import api from '../../services/api';
import { ProfileScreenNavigationProp } from '../../routes/StackParamList';

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

  const [selectedDate, setSelectedDate] =
    useState<CalendarObjects>(minimumDate);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [markedDate, setMarkedDate] = useState({});
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

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

  const handleMonthChange = useCallback((month: CalendarObjects) => {
    const date = new Date(month.timestamp);
    setCurrentMonth(date);
  }, []);

  const handleDateChange = useCallback((day: CalendarObjects) => {
    setSelectedDate(day);
  }, []);

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

    availableDaysObjet_unavailableDaysObjet[selectedDate.dateString] =
      selectedStyles;

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
    </Container>
  );
};

export default Dashboard;
