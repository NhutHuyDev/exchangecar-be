enum SortOptions {
  ASC_POSTED_DATE = 'posted_at',
  DES_POSTED_DATE = '-posted_at',
  ASC_SELLING_PRICE = 'selling_price',
  DES_SELLING_PRICE = '-selling_price',
  ASC_CAR_MILEAGE = 'car_mileage',
  DES_CAR_MILEAGE = '-car_mileage',
  ASC_MANUFACTURING_DATE = 'manufacturing_date',
  DES_MANUFACTURING_DATE = '-manufacturing_date',
}

export default SortOptions;

export const mapSortParam = {
  [SortOptions.ASC_POSTED_DATE]: 'car_post.posted_at',
  [SortOptions.DES_POSTED_DATE]: '-car_post.posted_at',
  [SortOptions.ASC_SELLING_PRICE]: 'car.selling_price',
  [SortOptions.DES_SELLING_PRICE]: '-car.selling_price',
  [SortOptions.ASC_CAR_MILEAGE]: 'car.car_mileage',
  [SortOptions.DES_CAR_MILEAGE]: '-car.car_mileage',
  [SortOptions.ASC_MANUFACTURING_DATE]: 'car.manufacturing_date',
  [SortOptions.DES_MANUFACTURING_DATE]: '-car.manufacturing_date',
};
