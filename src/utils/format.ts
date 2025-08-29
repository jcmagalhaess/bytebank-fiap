export function formatToBRL(value: number | string): string {
  const num = typeof value === 'string' ? Number(value.replace(/\D/g, "")) / 100 : value;
  if (isNaN(num)) return "";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
