import styled from 'styled-components/native';
import {
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  padding-top: ${getStatusBarHeight() + 24}px;
  background: #28262e;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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

export const ProfileButton = styled.TouchableOpacity`
  border-width: 1px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border-color: #3e3b47;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;
export const Title = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: 24px;
  margin: 24px;
`;

export const Description = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #ff9000;
  font-size: 24px;
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
  margin: 0 24px 24px;
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

export const NextAppointmentContainer = styled.View``;

export const NextAppointment = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 16px;
  border-radius: 10px;
  margin: 0 24px 10px;
`;

export const AppointmentContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 16px;
  border-radius: 10px;
`;

export const AppointmentInfo = styled.View`
  flex: 1;
  padding: 10px;
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
