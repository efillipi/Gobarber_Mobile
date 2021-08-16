import { NativeStackScreenProps } from '@react-navigation/native-stack';

type StackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  Dashboard: undefined;
  Profile: undefined;
  AppointmentDatePicker: undefined;
  AppointmentCreated: undefined;
};

export type ProfileScreenNavigationProp =
  NativeStackScreenProps<StackParamList>;
