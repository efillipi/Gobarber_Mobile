import styled, { css } from 'styled-components/native';
import {
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';
import { FlatList, Platform } from 'react-native';
import { Appointment } from '.';

interface Props {
  next?: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

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

export const Title = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 24px 12px;
`;

export const TitleContainer = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: ${Platform.OS === 'android' ? 24 : 18}px;
`;

export const TitleButton = styled.TouchableOpacity`
  justify-content: center;

  margin: 0 24px 0 24px;
`;
export const NetxButton = styled.TouchableOpacity`
  justify-content: center;
`;

export const AppointmentBorder = styled.View`
  background: #ff9000;
  height: 100%;
  width: 2px;
  margin-right: 10px;
`;

export const BackButton = styled.TouchableOpacity`
  justify-content: center;
`;

export const Description = styled.Text``;

export const TitleInfo = styled.Text`
  color: #ff9000;
`;

export const NextAppointmentContainer = styled.View`
  margin: 0 0 12px;
`;

export const NextAppointment = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 16px;
  border-radius: 10px;
  margin: 0 24px 10px;
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

export const SectionContent = styled.View``;

export const AppointmentContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 16px;
  border-radius: 10px;
`;

export const AppointmentInfo = styled.TouchableOpacity<Props>`
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
  flex-direction: row;
  justify-content: center;
`;

export const AppointmentMetaText = styled.Text`
  margin-left: 8px;
  color: #f4ede8;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
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

export const SectionContentModal = styled.View`
  border-radius: 10px;
  background: #28262e;
  padding: 84px 12px 12px 12px;
  margin: 12px;
  position: relative;
  top: 180px;
`;

export const ButtonCancel = styled.TouchableOpacity`
  height: 60px;
  background: #c53030;
  border-radius: 10px;
  margin-top: 12px;
  margin-bottom: 12px;
  justify-content: center;
  align-items: center;
`;

export const ButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: 18px;
`;

export const ButtonContainerModal = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  background: #28262e;
  border-radius: 10px;
  position: absolute;
  margin: 12px 0 0 12px;
  top: 0;
`;

export const ProvidersList = styled(
  FlatList as new () => FlatList<Appointment>,
).attrs({
  contentContainerStyle: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
})``;

export const ProvidersListTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: 24px;
  margin-bottom: 24px;
`;
