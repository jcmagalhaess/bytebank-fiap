/**
 * Percorre recursivamente um objeto ou array e remove todas as propriedades
 * ou elementos que são `null`, `''` (string vazia), ou `[]` (array vazio).
 * A função também remove objetos que se tornam vazios (`{}`) após a limpeza de suas propriedades.
 *
 * @param {any} item O objeto ou array a ser processado.
 * @returns {any} Um novo objeto ou array sem os valores vazios.
 */
export function removeNullProperties(item: any): any {
  if (typeof item !== 'object' || item === null) {
    return item;
  }

  if (Array.isArray(item)) {
    return item
      .map((element) => removeNullProperties(element))
      .filter(
        (element) =>
          element !== null &&
          element !== '' &&
          !(Array.isArray(element) && element.length === 0) &&
          !(typeof element === 'object' && Object.keys(element).length === 0)
      );
  }

  const newItem: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(item)) {
    const cleanedValue = removeNullProperties(value);

    if (
      cleanedValue !== null &&
      cleanedValue !== '' &&
      !(Array.isArray(cleanedValue) && cleanedValue.length === 0)
    ) {
      newItem[key] = cleanedValue;
    }
  }

  return newItem;
}
