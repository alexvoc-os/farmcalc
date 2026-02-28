/**
 * Helper functions pentru gestionarea anilor agricoli
 * An agricol: YYYY-YYYY (ex: 2024-2025)
 * Începe în august și se termină în iulie
 */

/**
 * Calculează anul agricol curent bazat pe luna curentă
 * Dacă suntem în august-decembrie: folosim anul curent și următorul
 * Dacă suntem în ianuarie-iulie: folosim anul trecut și anul curent
 */
export function getCurrentAgriculturalYear(): string {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11 (0 = ianuarie)
  const currentYear = now.getFullYear();

  // August = luna 7 (index 0-based)
  if (currentMonth >= 7) {
    // August-Decembrie
    return `${currentYear}-${currentYear + 1}`;
  } else {
    // Ianuarie-Iulie
    return `${currentYear - 1}-${currentYear}`;
  }
}

/**
 * Generează lista ultimilor N ani agricoli
 * @param count - numărul de ani de generat (default: 1 - doar anul curent)
 * @param includeNext - dacă să includă și anul viitor (default: true)
 */
export function getAvailableAgriculturalYears(count: number = 1, includeNext: boolean = true): string[] {
  // TEMPORARY: Pornim cu 2024-2025 în loc de anul calculat automat
  // pentru a rezolva problema că culturile existente sunt în 2024-2025
  const currentYear = '2024-2025'; // Hardcodat temporar
  const [startYear] = currentYear.split('-').map(Number);

  const years: string[] = [];

  // Adaugă anul viitor dacă e cerut
  if (includeNext) {
    years.push(`${startYear + 1}-${startYear + 2}`);
  }

  // Adaugă anul curent (doar 1 an pentru început)
  years.push(currentYear);

  return years;
}

/**
 * Verifică dacă un an agricol este valid (format YYYY-YYYY)
 */
export function isValidAgriculturalYear(year: string): boolean {
  const regex = /^\d{4}-\d{4}$/;
  if (!regex.test(year)) return false;

  const [startYear, endYear] = year.split('-').map(Number);
  return endYear === startYear + 1;
}

/**
 * Obține anul agricol următor pentru un an dat
 */
export function getNextAgriculturalYear(year: string): string {
  const [startYear] = year.split('-').map(Number);
  return `${startYear + 1}-${startYear + 2}`;
}

/**
 * Obține anul agricol anterior pentru un an dat
 */
export function getPreviousAgriculturalYear(year: string): string {
  const [startYear] = year.split('-').map(Number);
  return `${startYear - 1}-${startYear}`;
}

/**
 * Formatează anul agricol pentru afișare
 * Ex: "2024-2025" → "An agricol 2024-2025"
 */
export function formatAgriculturalYear(year: string): string {
  return `An agricol ${year}`;
}

/**
 * Formatează anul agricol scurt
 * Ex: "2024-2025" → "2024/25"
 */
export function formatAgriculturalYearShort(year: string): string {
  const [startYear, endYear] = year.split('-');
  return `${startYear}/${endYear.slice(-2)}`;
}

/**
 * Verifică dacă un an agricol este anul curent
 */
export function isCurrentAgriculturalYear(year: string): boolean {
  return year === getCurrentAgriculturalYear();
}

/**
 * Calculează diferența în ani între doi ani agricoli
 */
export function getYearDifference(year1: string, year2: string): number {
  const [start1] = year1.split('-').map(Number);
  const [start2] = year2.split('-').map(Number);
  return start1 - start2;
}

/**
 * Sortează o listă de ani agricoli în ordine descrescătoare (cel mai recent primul)
 */
export function sortAgriculturalYears(years: string[]): string[] {
  return years.sort((a, b) => {
    const [yearA] = a.split('-').map(Number);
    const [yearB] = b.split('-').map(Number);
    return yearB - yearA; // Descrescător
  });
}

/**
 * Verifică dacă un an agricol este în intervalul de păstrare (ultimii 5 ani)
 */
export function isWithinRetentionPeriod(year: string, retentionYears: number = 5): boolean {
  const currentYear = getCurrentAgriculturalYear();
  const difference = Math.abs(getYearDifference(currentYear, year));
  return difference < retentionYears;
}

/**
 * Obține intervalul de date pentru un an agricol
 * @returns { start: Date, end: Date }
 */
export function getAgriculturalYearDateRange(year: string): { start: Date; end: Date } {
  const [startYear, endYear] = year.split('-').map(Number);

  // Început: 1 august YYYY
  const start = new Date(startYear, 7, 1); // Luna 7 = august (0-indexed)

  // Sfârșit: 31 iulie YYYY+1
  const end = new Date(endYear, 6, 31); // Luna 6 = iulie

  return { start, end };
}

/**
 * Obține label-ul pentru butonul de creare an nou
 */
export function getCreateNewYearLabel(currentYear: string): string {
  const nextYear = getNextAgriculturalYear(currentYear);
  return `Creează ${formatAgriculturalYear(nextYear)}`;
}
