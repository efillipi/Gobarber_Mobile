import styled from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 0 12px 12px 24px;
  padding-top: ${Platform.OS === 'android'
    ? 24
    : `${getStatusBarHeight() + 24}`}px;
  background: #28262e;
  align-items: center;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;
export const Content = styled.View`
  flex: 1;
  justify-content: space-between;
  margin: 24px 0;
`;

export const DrawerItemListContent = styled.View``;

export const SignOutButton = styled.TouchableOpacity`
  align-items: center;
  /* margin-bottom: 24px; */
`;
export const SignOutContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const SignOutText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  margin-left: 8px;
`;
