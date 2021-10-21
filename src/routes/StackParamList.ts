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
  AppointmentsById: {
    id: string;
    dateAppointment: string;
    hour: string;
    user: {
      name: string;
      avatar_url: string;
    };
    provider: {
      name: string;
      avatar_url: string;
    };
  };
  ForgotPassword: undefined;
  ResetPassword: undefined;
};

export type ProfileScreenNavigationProp =
  NativeStackScreenProps<StackParamList>;
