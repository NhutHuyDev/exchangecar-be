export function generateCarSlug(
  carBrand: string,
  carModel: string,
  manufacturingDate: number,
) {
  const randomNumber = String(Date.now()).slice(-7);

  return `${carBrand.toLowerCase()}-${carModel.toLocaleLowerCase()}-${manufacturingDate}-${randomNumber}`
    .split(' ')
    .join('');
}
