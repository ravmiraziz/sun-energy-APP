export function formatPrice(
  value: number | string,
  locale: string = "en-US",
): string {
  const number =
    typeof value === "string" ? Number(value.replace(/,/g, "")) : value;

  if (isNaN(number)) return "0";

  return new Intl.NumberFormat(locale).format(number);
}

export const formatReceiptPrice = (value: number | string) =>
  Number(value).toLocaleString("en-US");
