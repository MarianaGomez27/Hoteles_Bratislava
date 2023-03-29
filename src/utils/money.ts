export const formatMoneyToStorage = (number: number) => {
  const moneyFormatter = new Intl.NumberFormat('en-US');
  const result = moneyFormatter.format(number);
  return result.replace(',', '');
}