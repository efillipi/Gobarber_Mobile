import React from 'react';
import { Text, View } from 'react-native';
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
        'stylesheet.calendar.header': {
          week: {
            marginTop: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
        },
        calendarBackground: '#312e38',
        dayTextColor: '#f6f5f8',
        monthTextColor: '#f6f5f8',
        todayTextColor: '#FF9000',
        arrowColor: '#FF9000',
        selectedDayBackgroundColor: '#ff0',
        selectedDayTextColor: '#f00',
      }}
      {...rest}
    />
  );
};

export default Calendars;