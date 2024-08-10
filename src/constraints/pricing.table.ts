enum DaysPublishOptions {
  Seven = '7',
  Fifteen = '15',
  Twenty = '20',
  Thirty = '30',
}

const DaysPublishOptionTable = {
  [DaysPublishOptions.Seven]: {
    numberDays: 7,
    price: 14000,
  },

  [DaysPublishOptions.Fifteen]: {
    numberDays: 15,
    price: 30000,
  },

  [DaysPublishOptions.Twenty]: {
    numberDays: 20,
    price: 40000,
  },

  [DaysPublishOptions.Thirty]: {
    numberDays: 30,
    price: 60000,
  },
};

export { DaysPublishOptions, DaysPublishOptionTable };
