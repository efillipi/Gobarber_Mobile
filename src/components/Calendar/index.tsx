import React from 'react';
import { Calendar, LocaleConfig, CalendarProps } from 'react-native-calendars';

LocaleConfig.locales.br = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  dayNames: [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ],
  dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  today: 'HOJE',
};
LocaleConfig.defaultLocale = 'br';

const Calendars: React.FC<CalendarProps> = ({ ...rest }) => {
  return (
    <Calendar
      theme={{
        calendarBackground: '#312e38',
        dayTextColor: '#f6f5f8',
        monthTextColor: '#f6f5f8',
        arrowColor: '#FF9000',
      }}
      {...rest}
    />
  );
};

export default Calendars;
