import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Alert, Modal } from 'react-native';
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
  SectionTitle,
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
  AppointmentMetaIcon,
  SectionContentModal,
  ButtonCancel,
  ButtonText,
  ButtonContainerModal,
  ProvidersList,
  ProvidersListTitle,
  ProvidersListTitleNull,
} from './styles';
import { objectTransformProvider } from '../../../utils/Calendar/objectTransform';
import { ProfileScreenNavigationProp } from '../../../routes/StackParamList';

export interface Appointment {
  id: string;
  dateAppointment: string;
  dateAppointmentFormatted: string;
  hourFormatted: Date;
  hour: string;
  user: {
    name: string;
    avatar_url: string;
  };
  provider: {
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
  const [appointmentData, setAppointmentData] = useState<Appointment>();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleAppointments, setModalVisibleAppointments] =
    useState(false);
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [markedDate, setMarkedDate] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

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
        setAppointmentData(response.data[0]);
        const appointmentsFormatted = response.data.map((appointment) => ({
          ...appointment,
          dateAppointmentFormatted: format(
            parseISO(appointment.dateAppointment),
            'dd/MM/yyyy',
            {
              locale: ptBR,
            },
          ),
          hourFormatted: parseISO(appointment.dateAppointment),
          hour: format(parseISO(appointment.dateAppointment), 'HH:mm'),
        }));

        appointmentsFormatted.sort((a, b) => {
          return a.hour < b.hour ? -1 : 1;
        });

        setAppointments(appointmentsFormatted);
        if (appointmentsFormatted.length < 3) {
          setModalVisible(true);
        }
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

  const handleAppointment = useCallback((appointment: Appointment) => {
    setAppointmentData(appointment);
  }, []);

  const getData = useCallback(() => {
    setIsLoading(true);
    api
      .get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((response) => {
        setAppointmentData(response.data[0]);
        const appointmentsFormatted = response.data.map((appointment) => ({
          ...appointment,
          dateAppointmentFormatted: format(
            parseISO(appointment.dateAppointment),
            'dd/MM/yyyy',
            {
              locale: ptBR,
            },
          ),
          hourFormatted: parseISO(appointment.dateAppointment),
          hour: format(parseISO(appointment.dateAppointment), 'HH:mm'),
        }));

        appointmentsFormatted.sort((a, b) => {
          return a.hour < b.hour ? -1 : 1;
        });

        setAppointments(appointmentsFormatted);
        setModalVisibleAppointments(false);
        setIsLoading(false);
      });
  }, [selectedDate]);

  const handleRejection = useCallback(
    (id_appointment: string) => {
      Alert.alert('Cancelar Agendamento', 'Deseja Cancelar Agendamento?', [
        {
          text: 'Não',
          onPress: () => setModalVisibleAppointments(false),
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () =>
            api.post(`/appointments/${id_appointment}/cancel`).then(() => {
              getData();
            }),
        },
      ]);
    },
    [getData],
  );

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

            <AppointmentInfo
              next
              onPress={() => {
                setModalVisibleAppointments(!modalVisibleAppointments);
                handleAppointment(nextAppointment);
              }}
            >
              <AppointmentBorder />
              <AppointmentAvatar
                source={{ uri: nextAppointment?.user.avatar_url }}
              />
              <AppointmentName>{nextAppointment?.user.name}</AppointmentName>
            </AppointmentInfo>
          </NextAppointment>
        </NextAppointmentContainer>
      )}

      <Modal
        animationType="slide"
        transparent
        visible={modalVisibleAppointments}
        onRequestClose={() => {
          setModalVisibleAppointments(!modalVisibleAppointments);
        }}
      >
        <SectionContentModal>
          <AppointmentContainer key={appointmentData?.user.name}>
            <AppointmentMeta>
              <AppointmentMetaIcon>
                <Icon name="scissors" size={24} color="#ff9000" />
              </AppointmentMetaIcon>
            </AppointmentMeta>
            <AppointmentInfo>
              <AppointmentMetaText>
                {appointmentData?.user.name}
              </AppointmentMetaText>
            </AppointmentInfo>
          </AppointmentContainer>

          <AppointmentContainer key={appointmentData?.dateAppointment}>
            <AppointmentMeta>
              <AppointmentMetaIcon>
                <Icon name="calendar" size={24} color="#ff9000" />
              </AppointmentMetaIcon>
            </AppointmentMeta>
            <AppointmentInfo>
              <AppointmentMetaText>
                {appointmentData?.dateAppointmentFormatted}
              </AppointmentMetaText>
            </AppointmentInfo>
          </AppointmentContainer>

          <AppointmentContainer key={appointmentData?.hour}>
            <AppointmentMeta>
              <AppointmentMetaIcon>
                <Icon name="clock" size={24} color="#ff9000" />
              </AppointmentMetaIcon>
            </AppointmentMeta>
            <AppointmentInfo>
              <AppointmentMetaText>{appointmentData?.hour}</AppointmentMetaText>
            </AppointmentInfo>
          </AppointmentContainer>
          {isAfter(
            new Date(appointmentData?.dateAppointment as string),
            new Date(),
          ) && (
            <ButtonCancel
              onPress={() => {
                handleRejection(appointmentData?.id as string);
              }}
            >
              <ButtonText>Cancelar Agendamento</ButtonText>
            </ButtonCancel>
          )}
          <ButtonContainerModal
            onPress={() => {
              setModalVisibleAppointments(!modalVisibleAppointments);
            }}
          >
            <Icon name="x-circle" size={24} color="#999591" />
          </ButtonContainerModal>
        </SectionContentModal>
      </Modal>

      <ProvidersList
        data={appointments}
        keyExtractor={(appointment) => appointment.id}
        ListHeaderComponent={
          appointments.length === 0 ? (
            <ProvidersListTitle>
              Nenhum agendamento neste período
            </ProvidersListTitle>
          ) : (
            <ProvidersListTitleNull />
          )
        }
        refreshing={isLoading}
        onRefresh={getData}
        renderItem={({ item: appointment }) => (
          <SectionContent>
            <AppointmentContainer key={appointment.id}>
              <AppointmentMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <AppointmentMetaText>{appointment.hour}</AppointmentMetaText>
              </AppointmentMeta>

              <AppointmentInfo
                onPress={() => {
                  setModalVisibleAppointments(!modalVisibleAppointments);
                  handleAppointment(appointment);
                }}
              >
                <AppointmentAvatar
                  source={{ uri: appointment.user.avatar_url }}
                />
                <AppointmentName>{appointment.user.name}</AppointmentName>
              </AppointmentInfo>
            </AppointmentContainer>
          </SectionContent>
        )}
      />
    </Container>
  );
};

export default Dashboard;
