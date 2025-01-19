export function formatPhoneNumber(number: string) {
  number = extractPhoneNumber(number);
  if (number.length > 10) {
    number = number.substring(0, 10);
  }
  if (number.length > 3) {
    number = number.substring(0, 3) + " " + number.substring(3, number.length);
  }
  if (number.length > 7) {
    number = number.substring(0, 7) + " " + number.substring(7, number.length);
  }
  return number;
}

export function extractPhoneNumber(number: string) {
  return number.replaceAll(/[^0-9*#]+/g, "");
}
