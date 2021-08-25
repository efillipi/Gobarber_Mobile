import styled from 'styled-components/native';
import { Platform } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 40px 30px ${Platform.OS === 'android' ? 150 : 40}px;
  position: relative;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`;

export const BackButtonContainer = styled.View`
  width: 50px;
  height: 50px;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  left: 24px;
`;

export const SignOutButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  right: 24px;
`;
export const SignOutContainer = styled.View`
  width: 50px;
  height: 50px;
`;

export const UserAvatarButton = styled.View`
  margin-top: 32px;
  position: relative;
`;

export const Avatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;
export const IconConainter = styled.TouchableOpacity`
  background-color: #232129;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  position: absolute;
  bottom: 0px;
  left: 200px;
  justify-content: center;
  align-items: center;
`;

export const AvatarButton = styled(FeatherIcon)``;
