import { NativeStackScreenProps } from '@react-navigation/native-stack';

type StackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  Dashboard: undefined;
  Profile: undefined;
  AppointmentDatePicker: { providerId: string };
  AppointmentCreated: { providerId: string };
};

export type ProfileScreenNavigationProp =
  NativeStackScreenProps<StackParamList>;
