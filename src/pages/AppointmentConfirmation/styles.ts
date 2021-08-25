import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

export const ImageContainer = styled.View`
  padding: 24px;
`;

export const Avatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;

export const Title = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 32px;
  color: #f4ede8;
  margin-top: 48px;
  text-align: center;
`;

export const Description = styled.Text`
  font-family: 'RobotoSlab-Regular';
  font-size: 18px;
  color: #f4ede8;
  margin-top: 16px;
`;

export const ButtonContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
`;

export const OkButton = styled.TouchableOpacity`
  width: 40%;
  padding: 12px 24px;
  background: #04d361;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 24px;
`;

export const CancelButton = styled.TouchableOpacity`
  width: 40%;
  padding: 12px 24px;
  background: #c53030;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 24px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
`;
