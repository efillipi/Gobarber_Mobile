export const selectedStyles = {
  selected: true,
  selectedColor: '#ff9000',
  selectedTextColor: '#232129',
  customStyles: {
    container: {
      borderRadius: 10,
    },
    text: {
      color: '#232129',
    },
  },
};

export const availableDaysStyles = {
  customStyles: {
    container: {
      backgroundColor: '#3e3b47',
      borderRadius: 10,
    },
    text: {
      color: '#f4ede8',
    },
  },
};

export const unavailableDaysStyles = {
  disableTouchEvent: true,
  customStyles: {
    container: {
      backgroundColor: '#3e3b47',

      opacity: 0.6,
      borderRadius: 10,
    },
    text: {
      color: '#f4ede89b',
    },
  },
};

export const daysOffStyles = {
  disableTouchEvent: true,
  customStyles: {
    text: {
      color: '#f4ede89b',
    },
  },
};

export const pastDaysStyles = {
  disableTouchEvent: true,
  customStyles: {
    container: {
      backgroundColor: '#3e3b47',
      opacity: 0.3,
      borderRadius: 10,
    },
    text: {
      color: '#f4ede89b',
    },
  },
};
