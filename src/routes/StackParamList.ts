import { NativeStackScreenProps } from '@react-navigation/native-stack';

type StackParamList = {
  SignUp: undefined;
  SignIn: undefined;
};

export type ProfileScreenNavigationProp =
  NativeStackScreenProps<StackParamList>;
