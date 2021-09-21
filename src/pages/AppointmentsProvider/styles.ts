import styled, { css } from 'styled-components/native';
import {
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';
import { Platform } from 'react-native';

interface Props {
  next?: boolean;
}

export const Container = styled.View`
  flex: 1;
`;
export const BackButton = styled.TouchableOpacity``;

export const Header = styled.View`
  padding: 0 12px 12px 24px;
  padding-top: ${Platform.OS === 'android'
    ? 24
    : `${getStatusBarHeight() + 24}`}px;
  background: #28262e;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 12px;
`;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 20px;
  font-family: 'RobotoSlab-Regular';
  line-height: 28px;
`;

export const UserName = styled.Text`
  color: #ff9000;
  font-family: 'RobotoSlab-Medium';
`;

export const ProfileButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;

export const Schedule = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: getBottomSpace(),
  },
})``;

export const Section = styled.View``;

export const SectionTitle = styled.Text`
  font-size: 24px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  margin: 24px 24px;
`;

export const SectionSubTitle = styled.Text`
  font-size: 18px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  margin: 0 24px 24px;
`;

export const SectionContent = styled.View`
  margin: 0 24px 0px;
`;

export const AppointmentContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 16px;
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
  margin: 0 12px;
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

  margin: 0 8px 0 8px;
`;

export const AppointmentMetaDescription = styled.Text`
  margin-left: 8px;
  color: #ff9000;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
`;

export const AppointmentMetaText = styled.Text`
  margin-left: 8px;
  color: #f4ede8;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
`;
