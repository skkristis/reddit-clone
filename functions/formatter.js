export default function formatter(num) {
  const method = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

  return method.format(num);
}
