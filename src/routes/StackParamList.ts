import { NativeStackScreenProps } from '@react-navigation/native-stack';

type StackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  Dashboard: undefined;
  Profile: undefined;
  AppointmentDatePicker: { providerId: string };
  AppointmentConfirmation: {
    date: Date;
    provider: {
      id: string;
      name: string;
      avatar_url: string;
    };
  };
  AppointmentCreated: { date: Number };
};

export type ProfileScreenNavigationProp =
  NativeStackScreenProps<StackParamList>;
