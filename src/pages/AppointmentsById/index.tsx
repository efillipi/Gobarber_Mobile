import React, { useCallback } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Icon from 'react-native-vector-icons/Feather';

import { ProfileScreenNavigationProp } from '../../routes/StackParamList';

import {
  Container,
  BackButtonContainer,
  BackButton,
  Title,
  Avatar,
  UserAvatarButton,
  SectionContent,
  AppointmentContainer,
  AppointmentInfo,
  AppointmentMeta,
  AppointmentMetaText,
  AppointmentMetaIcon,
  ButtonContainer,
  ButtonText,
} from './styles';
import api from '../../services/api';

export interface Appointment {
  id: string;
  dateAppointment: string;
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

const Profile: React.FC<ProfileScreenNavigationProp> = ({
  navigation,
  route,
}) => {
  const appointment = route.params as Appointment;

  const handleRejection = useCallback(
    (id_appointment: string) => {
      console.log({ id_appointment });
      api.post(`/appointments/${id_appointment}/rejection`, {
        params: {
          approved: false,
        },
      });
      navigation.goBack();
    },
    [navigation],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <BackButton onPress={() => navigation.goBack()}>
              <BackButtonContainer>
                <Icon name="chevron-left" size={24} color="#999591" />
              </BackButtonContainer>
            </BackButton>

            <UserAvatarButton>
              <Avatar source={{ uri: appointment.user.avatar_url }} />
            </UserAvatarButton>

            <SectionContent>
              <Title>Detalhes do Agendamento</Title>
              <AppointmentContainer key={appointment?.user.name}>
                <AppointmentMeta>
                  <AppointmentMetaIcon>
                    <Icon name="scissors" size={24} color="#ff9000" />
                  </AppointmentMetaIcon>
                </AppointmentMeta>
                <AppointmentInfo>
                  <AppointmentMetaText>
                    {appointment?.user.name}
                  </AppointmentMetaText>
                </AppointmentInfo>
              </AppointmentContainer>

              <AppointmentContainer key={appointment?.dateAppointment}>
                <AppointmentMeta>
                  <AppointmentMetaIcon>
                    <Icon name="calendar" size={24} color="#ff9000" />
                  </AppointmentMetaIcon>
                </AppointmentMeta>
                <AppointmentInfo>
                  <AppointmentMetaText>
                    {format(
                      parseISO(appointment.dateAppointment),
                      'MM/dd/yyyy',
                      {
                        locale: ptBR,
                      },
                    )}
                  </AppointmentMetaText>
                </AppointmentInfo>
              </AppointmentContainer>

              <AppointmentContainer key={appointment?.hour}>
                <AppointmentMeta>
                  <AppointmentMetaIcon>
                    <Icon name="clock" size={24} color="#ff9000" />
                  </AppointmentMetaIcon>
                </AppointmentMeta>
                <AppointmentInfo>
                  <AppointmentMetaText>{appointment?.hour}</AppointmentMetaText>
                </AppointmentInfo>
              </AppointmentContainer>
            </SectionContent>
            <ButtonContainer onPress={() => handleRejection(appointment.id)}>
              <ButtonText>Cancelar Agendamento</ButtonText>
            </ButtonContainer>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
