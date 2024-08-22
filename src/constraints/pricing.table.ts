import SystemPackageOptions from './systemPackage.enum.constraint';

enum DaysPublishOptions {
  Seven = '7',
  Fifteen = '15',
  Twenty = '20',
  Thirty = '30',
}

const DaysPublishOptionTable = {
  [DaysPublishOptions.Seven]: {
    numberDays: 7,
    [SystemPackageOptions.Standard]: { price: 14000 },
    [SystemPackageOptions.Premium]: { price: 14000 },
    [SystemPackageOptions.Vip]: { price: 14000 },
  },

  [DaysPublishOptions.Fifteen]: {
    numberDays: 15,
    [SystemPackageOptions.Standard]: { price: 30000 },
    [SystemPackageOptions.Premium]: { price: 70000 },
    [SystemPackageOptions.Vip]: { price: 150000 },
  },

  [DaysPublishOptions.Twenty]: {
    numberDays: 20,
    [SystemPackageOptions.Standard]: { price: 40000 },
    [SystemPackageOptions.Premium]: { price: 120000 },
    [SystemPackageOptions.Vip]: { price: 200000 },
  },

  [DaysPublishOptions.Thirty]: {
    numberDays: 30,
    [SystemPackageOptions.Standard]: { price: 60000 },
    [SystemPackageOptions.Premium]: { price: 180000 },
    [SystemPackageOptions.Vip]: { price: 300000 },
  },
};

export { DaysPublishOptions, DaysPublishOptionTable };
