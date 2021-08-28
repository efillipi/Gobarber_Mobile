import { NativeStackScreenProps } from '@react-navigation/native-stack';

type StackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  Dashboard: undefined;
  Test: undefined;
  Profile: undefined;
  AppointmentDatePicker: { providerId: string };
  AppointmentConfirmation: {
    date: number;
    provider: {
      id: string;
      name: string;
      avatar_url: string;
    };
  };
  AppointmentCreated: { date: number };
};

export type ProfileScreenNavigationProp =
  NativeStackScreenProps<StackParamList>;
