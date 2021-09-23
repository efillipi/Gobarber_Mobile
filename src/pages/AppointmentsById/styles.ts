import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface Props {
  next?: boolean;
}

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 40px 30px ${Platform.OS === 'android' ? 150 : 40}px;
  position: relative;
`;

export const SectionContent = styled.View`
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 12px 0;
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

export const AppointmentContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin: 12px 0 12px;
  border-radius: 10px;
`;

export const AppointmentInfo = styled.View<Props>`
  flex: 1;
  padding: 10px;
  ${(props) =>
    props.next &&
    css`
      padding-left: 0;
    `};
  height: 100%;
  background: #3e3b47;
  margin-bottom: 16px;
  border-radius: 10px;
  margin-left: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const AppointmentAvatar = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 36px;
`;

export const AppointmentName = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #f4ede8;
`;

export const AppointmentMeta = styled.View`
  align-items: center;
  justify-content: center;
`;

export const AppointmentMetaIconContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const AppointmentMetaIcon = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export const AppointmentMetaText = styled.Text`
  margin-left: 8px;
  color: #f4ede8;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
`;

export const ButtonContainer = styled.TouchableOpacity`
  height: 60px;
  background: #c53030;
  border-radius: 10px;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: 18px;
`;
