export function formatTimeIn(dateString: string): string {
  const startDate = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return `${diffYears} ${declension(diffYears, 'год', 'года', 'лет')}`;
  }
  if (diffMonths > 0) {
    return `${diffMonths} ${declension(diffMonths, 'месяц', 'месяца', 'месяцев')}`;
  }
  if (diffDays > 0) {
    return `${diffDays} ${declension(diffDays, 'день', 'дня', 'дней')}`;
  }
  if (diffHours > 0) {
    return `${diffHours} ${declension(diffHours, 'час', 'часа', 'часов')}`;
  }
  if (diffMinutes > 0) {
    return `${diffMinutes} ${declension(diffMinutes, 'минуту', 'минуты', 'минут')}`;
  }
  return 'только что';
}

// Функция для склонения слов
export function declension(
  count: number,
  one: string,
  two: string,
  five: string,
): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return five;
  }

  switch (lastDigit) {
    case 1:
      return one;
    case 2:
    case 3:
    case 4:
      return two;
    default:
      return five;
  }
}
