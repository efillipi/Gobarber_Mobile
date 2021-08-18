import { NativeStackScreenProps } from '@react-navigation/native-stack';

type StackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  Dashboard: undefined;
  Profile: undefined;
  AppointmentDatePicker: { providerId: string };
  AppointmentCreated: { date: Number };
};

export type ProfileScreenNavigationProp =
  NativeStackScreenProps<StackParamList>;
