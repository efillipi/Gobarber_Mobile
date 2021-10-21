import React from 'react';
import {
  DrawerContentComponentProps,
  DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  UserAvatar,
  Content,
  DrawerItemListContent,
  SignOutButton,
  SignOutContainer,
  SignOutText,
} from './styles';

type DrawerContentProps = {
  props: DrawerContentComponentProps;
};

const DrawerNavigation: React.FC<DrawerContentProps> = ({ props }) => {
  const { user, signOut } = useAuth();

  return (
    <Container>
      {/* <Header>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header> */}
      <Content>
        <DrawerItemListContent>
          <DrawerItemList {...props} />
        </DrawerItemListContent>
        <SignOutButton onPress={() => signOut()}>
          <SignOutContainer>
            <Icon name="log-out" size={18} color="#999591" />
            <SignOutText>Sair</SignOutText>
          </SignOutContainer>
        </SignOutButton>
      </Content>
    </Container>
  );
};

export default DrawerNavigation;
