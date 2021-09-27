import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Alert, Modal } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  ProfileButton,
  UserAvatar,
  SectionTitle,
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
  AppointmentMetaDescription,
  SectionContentModal,
  AppointmentMetaIcon,
  ButtonContainerModal,
  ButtonCancel,
  ButtonText,
  ProvidersList,
  ProvidersListTitle,
  ProvidersListTitleNull,
} from './styles';
import { ProfileScreenNavigationProp } from '../../routes/StackParamList';

export interface Appointment {
  id: string;
  dateAppointment: string;
  dateFormatted: string;
  hourFormatted: Date;
  dateAppointmentFormatted: string;
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

const AppointmentsClient: React.FC<ProfileScreenNavigationProp> = ({
  navigation,
}) => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentData, setAppointmentData] = useState<Appointment>();
  const [modalVisibleAppointments, setModalVisibleAppointments] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleAppointment = useCallback((appointment: Appointment) => {
    setAppointmentData(appointment);
  }, []);

  useEffect(() => {
    api
      .get<Appointment[]>('/appointments', {
        params: {
          id_client: user.id,
          approved: true,
        },
      })
      .then((response) => {
        const appointmentsFormatted = response.data.map((appointment) => ({
          ...appointment,
          hour: format(parseISO(appointment.dateAppointment), 'HH:mm'),
          dateAppointmentFormatted: format(
            parseISO(appointment.dateAppointment),
            'dd/MM/yyyy',
            {
              locale: ptBR,
            },
          ),
          dateFormatted: format(
            parseISO(appointment.dateAppointment),
            "dd'/'MM",
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

  const getData = useCallback(() => {
    setIsLoading(true);
    api
      .get<Appointment[]>('/appointments', {
        params: {
          id_client: user.id,
          approved: true,
        },
      })
      .then((response) => {
        const appointmentsFormatted = response.data.map((appointment) => ({
          ...appointment,
          hour: format(parseISO(appointment.dateAppointment), 'HH:mm'),
          dateAppointmentFormatted: format(
            parseISO(appointment.dateAppointment),
            'dd/MM/yyyy',
            {
              locale: ptBR,
            },
          ),
          dateFormatted: format(
            parseISO(appointment.dateAppointment),
            "dd'/'MM",
            {
              locale: ptBR,
            },
          ),
        }));

        appointmentsFormatted.sort((a, b) => {
          return a.dateAppointment < b.dateAppointment ? -1 : 1;
        });

        setAppointments(appointmentsFormatted);
        setModalVisibleAppointments(false);
        setIsLoading(false);
      });
  }, [user]);

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
              <AppointmentMetaDescription>
                {nextAppointment?.dateFormatted}
              </AppointmentMetaDescription>
              <AppointmentMetaDescription>
                {nextAppointment?.hour}
              </AppointmentMetaDescription>
            </AppointmentMeta>

            <AppointmentInfo
              next
              onPress={() => {
                setModalVisibleAppointments(!modalVisibleAppointments);
                handleAppointment(nextAppointment);
              }}
            >
              <AppointmentBorder />
              <AppointmentMetaText>
                Agendado com{'\n'} {nextAppointment.provider.name}
              </AppointmentMetaText>
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
          <AppointmentContainer key={appointmentData?.provider.name}>
            <AppointmentMeta>
              <AppointmentMetaIcon>
                <Icon name="scissors" size={24} color="#ff9000" />
              </AppointmentMetaIcon>
            </AppointmentMeta>
            <AppointmentInfo>
              <AppointmentMetaText>
                {appointmentData?.provider.name}
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
      <SectionTitle>Agendamentos Futuros</SectionTitle>

      <ProvidersList
        data={futureAppointments}
        keyExtractor={(appointment) => appointment.id}
        ListHeaderComponent={
          futureAppointments.length === 0 ? (
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
                <AppointmentMetaDescription>
                  {appointment?.dateFormatted}
                </AppointmentMetaDescription>
                <AppointmentMetaDescription>
                  {appointment?.hour}
                </AppointmentMetaDescription>
              </AppointmentMeta>

              <AppointmentInfo
                onPress={() => {
                  setModalVisibleAppointments(!modalVisibleAppointments);
                  handleAppointment(appointment);
                }}
              >
                <AppointmentMetaText>
                  Agendado com{'\n'} {appointment.provider.name}
                </AppointmentMetaText>
              </AppointmentInfo>
            </AppointmentContainer>
          </SectionContent>
        )}
      />
    </Container>
  );
};
export default AppointmentsClient;
