
export const TruncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/**
 * Конвертирует временную строку формата "HH:MM:SS.SSSSSSS" в миллисекунды
 * @param {string} timeString - Строка времени ("00:00:22.1888520")
 * @returns {number} Количество миллисекунд
 */
export const convertTimeToMilliseconds = (timeString: any) => {
    // Разбиваем строку на компоненты
    const [hours, minutes, rest] = timeString.split(':');
    const [seconds, milliseconds] = rest.split('.');
  
    // Преобразуем каждую часть в числа и вычисляем миллисекунды
    const hrs = parseInt(hours, 10) * 60 * 60 * 1000;
    const mins = parseInt(minutes, 10) * 60 * 1000;
    const secs = parseInt(seconds, 10) * 1000;
    
    // Берем первые 3 цифры из миллисекунд (если их больше) и дополняем нулями
    const ms = parseInt(
      milliseconds.slice(0, 3).padEnd(3, '0'), 
      10
    );
  
    return hrs + mins + secs + ms;
  };

  export function getYearMonth(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    // getMonth() возвращает месяц от 0 до 11, поэтому прибавляем 1
    // и добавляем ведущий ноль, если месяц однозначный
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }