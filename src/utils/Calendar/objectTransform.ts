import { isBefore } from 'date-fns';

import {
  selectedStyles,
  availableDaysStyles,
  daysOffStyles,
  unavailableDaysStyles,
  pastDaysStyles,
  unavailableDaysStylesProvider,
} from './styles';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface CalendarObjects {
  dateString: string;
}

interface Request {
  monthAvailability: MonthAvailabilityItem[];
  currentMonth: Date;
  minimumDate?: string;
  selectedDate: Date;
}

function MinimumDate(): CalendarObjects {
  const firstDate = new Date();
  return {
    dateString: `${firstDate.getFullYear()}-${String(
      firstDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(firstDate.getDate()).padStart(2, '0')}`,
  };
}

function SelectDay(date: Date): CalendarObjects {
  return {
    dateString: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`,
  };
}

function objectTransformClient({
  monthAvailability,
  currentMonth,
  selectedDate,
}: Request): Object {
  const daysOff: string[] = [];
  const dayOffOne = 5;
  const dayOffTwo = 6;
  const unavailableDays = monthAvailability
    .filter((monthDay) => monthDay.available === false)
    .map((monthDay) => {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      const day = String(monthDay.day).padStart(2, '0');
      const data = `${year}-${month}-${day}`;
      return data;
    });

  const availableDays = monthAvailability
    .filter((monthDay) => monthDay.available === true)
    .map((monthDay) => {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      const day = String(monthDay.day).padStart(2, '0');
      const data = `${year}-${month}-${day}`;
      return data;
    });

  const pastDays = availableDays.filter((pastDay) =>
    isBefore(new Date(pastDay), new Date(MinimumDate().dateString)),
  );

  monthAvailability.forEach((monthDay) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const day = String(monthDay.day).padStart(2, '0');
    const data = new Date(`${year}-${month}-${day}`);
    if (data.getDay() === dayOffOne || data.getDay() === dayOffTwo) {
      const data_data = `${year}-${month}-${day}`;
      daysOff.push(data_data);
    }
  });

  const unavailableDaysObjet = unavailableDays.reduce(
    (objet: any, value: any) => {
      objet[value] = unavailableDaysStyles;
      return objet;
    },
    {},
  );

  const availableDaysObjet_unavailableDaysObjet = availableDays.reduce(
    (objet: any, value: any) => {
      objet[value] = availableDaysStyles;
      return objet;
    },
    unavailableDaysObjet,
  );

  const availableDaysObjet_unavailableDaysObjet_pastDaysObject =
    pastDays.reduce((objet: any, value: any) => {
      objet[value] = pastDaysStyles;
      return objet;
    }, availableDaysObjet_unavailableDaysObjet);

  availableDaysObjet_unavailableDaysObjet_pastDaysObject[
    SelectDay(selectedDate).dateString
  ] = selectedStyles;

  const availableDaysObjet_unavailableDaysObjet_pastDaysObject_selectedObject_daysOffObjet =
    daysOff.reduce((objet: any, value: any) => {
      objet[value] = daysOffStyles;
      return objet;
    }, availableDaysObjet_unavailableDaysObjet_pastDaysObject);

  return availableDaysObjet_unavailableDaysObjet_pastDaysObject_selectedObject_daysOffObjet;
}

function objectTransformProvider({
  monthAvailability,
  currentMonth,
  selectedDate,
}: Request): Object {
  const daysOff: string[] = [];
  const dayOffOne = 5;
  const dayOffTwo = 6;
  const unavailableDays = monthAvailability
    .filter((monthDay) => monthDay.available === false)
    .map((monthDay) => {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      const day = String(monthDay.day).padStart(2, '0');
      const data = `${year}-${month}-${day}`;
      return data;
    });

  const availableDays = monthAvailability
    .filter((monthDay) => monthDay.available === true)
    .map((monthDay) => {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      const day = String(monthDay.day).padStart(2, '0');
      const data = `${year}-${month}-${day}`;
      return data;
    });

  monthAvailability.forEach((monthDay) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const day = String(monthDay.day).padStart(2, '0');
    const data = new Date(`${year}-${month}-${day}`);
    if (data.getDay() === dayOffOne || data.getDay() === dayOffTwo) {
      const data_data = `${year}-${month}-${day}`;
      daysOff.push(data_data);
    }
  });

  const unavailableDaysObjet = unavailableDays.reduce(
    (objet: any, value: any) => {
      objet[value] = unavailableDaysStylesProvider;
      return objet;
    },
    {},
  );

  const availableDaysObjet_unavailableDaysObjet = availableDays.reduce(
    (objet: any, value: any) => {
      objet[value] = availableDaysStyles;
      return objet;
    },
    unavailableDaysObjet,
  );

  availableDaysObjet_unavailableDaysObjet[SelectDay(selectedDate).dateString] =
    selectedStyles;

  const availableDaysObjet_unavailableDaysObjetselectedObject_daysOffObjet =
    daysOff.reduce((objet: any, value: any) => {
      objet[value] = daysOffStyles;
      return objet;
    }, availableDaysObjet_unavailableDaysObjet);

  return availableDaysObjet_unavailableDaysObjetselectedObject_daysOffObjet;
}

export { objectTransformClient, objectTransformProvider };
