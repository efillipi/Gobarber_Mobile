import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ButtonContainer,
  OkButton,
  ButtonText,
} from './styles';

import { ProfileScreenNavigationProp } from '../../routes/StackParamList';

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

const Dashboard: React.FC<ProfileScreenNavigationProp> = ({ navigation }) => {
  const { user } = useAuth();
  const handleOk = useCallback(async () => {
    navigation.navigate('DashboardProviders');
  }, [navigation]);

  const handleCancel = useCallback(async () => {
    navigation.navigate('DashboardUsers');
  }, [navigation]);

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

      <ButtonContainer>
        <OkButton onPress={handleOk}>
          <ButtonText>Provider</ButtonText>
        </OkButton>

        <OkButton onPress={handleCancel}>
          <ButtonText>USER</ButtonText>
        </OkButton>
      </ButtonContainer>
    </Container>
  );
};

export default Dashboard;
