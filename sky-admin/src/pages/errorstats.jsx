import * as React from 'react';
import { List, useListContext } from 'react-admin';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const months = [
  { label: 'Все месяцы', value: 0 },
  { label: 'Январь', value: 1 },
  { label: 'Февраль', value: 2 },
  { label: 'Март', value: 3 },
  { label: 'Апрель', value: 4 },
  { label: 'Май', value: 5 },
  { label: 'Июнь', value: 6 },
  { label: 'Июль', value: 7 },
  { label: 'Август', value: 8 },
  { label: 'Сентябрь', value: 9 },
  { label: 'Октябрь', value: 10 },
  { label: 'Ноябрь', value: 11 },
  { label: 'Декабрь', value: 12 },
];

const ChartSection = () => {
  const { data } = useListContext();

  // Преобразование и сортировка данных
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    // Собираем все уникальные даты и типы ошибок
    const allDates = Array.from(new Set(data.map(e => e.day))).sort();
    const allTypes = Array.from(new Set(data.map(e => e.error_type)));

    // Формируем массив данных для графика
    return allDates.map(date => {
      const dateObj = new Date(date);
      const entry = { 
        date: dateObj,
        dateStr: dateObj.toLocaleDateString(),
        year: dateObj.getFullYear(),
        month: dateObj.getMonth() + 1
      };

      // Добавляем количество ошибок для каждого типа
      allTypes.forEach(type => {
        const stat = data.find(e => e.day === date && e.error_type === type);
        entry[type] = stat ? stat.error_count : 0;
      });

      return entry;
    });
  }, [data]);

  // Получаем список типов ошибок для отображения в графике
  const errorTypes = React.useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map(e => e.error_type)));
  }, [data]);

  // Цвета для линий графика
  const errorColors = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8',
    '#f58231', '#911eb4', '#46f0f0', '#f032e6',
    '#bcf60c', '#fabebe', '#008080', '#e6beff'
  ];

  // Получаем список доступных годов из данных
  const years = React.useMemo(() => {
    const set = new Set(processedData.map(d => d.year));
    return Array.from(set).sort((a, b) => a - b);
  }, [processedData]);

  // Состояния для фильтрации
  const [selectedYear, setSelectedYear] = React.useState(years[0] || null);
  const [selectedMonth, setSelectedMonth] = React.useState(0);

  // Фильтрация данных по году и месяцу
  const filteredData = React.useMemo(() => {
    if (!selectedYear) return [];

    return processedData.filter(d => {
      if (d.year !== selectedYear) return false;
      if (selectedMonth === 0) return true;
      return d.month === selectedMonth;
    });
  }, [processedData, selectedYear, selectedMonth]);

  // Состояния для управления областью просмотра графика
  const [viewRange, setViewRange] = React.useState({
    startIndex: 0,
    endIndex: filteredData.length > 0 ? filteredData.length - 1 : 0,
  });

  // Сброс области просмотра при изменении фильтров
  React.useEffect(() => {
    setViewRange({
      startIndex: 0,
      endIndex: filteredData.length > 0 ? filteredData.length - 1 : 0,
    });
  }, [filteredData]);

  // Логика для панорамирования графика
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartX = React.useRef(null);
  const dragStartRange = React.useRef(null);
  const maxIndex = filteredData.length - 1;

  // Видимые данные в текущей области просмотра
  const visibleData = React.useMemo(() => {
    return filteredData.slice(viewRange.startIndex, viewRange.endIndex + 1);
  }, [filteredData, viewRange]);

  // Обработчики событий мыши для панорамирования
  const onMouseDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartRange.current = { ...viewRange };
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartX.current;
    const sensitivity = 10;
    const deltaIndex = Math.round(-deltaX / sensitivity);

    let newStart = dragStartRange.current.startIndex + deltaIndex;
    let newEnd = dragStartRange.current.endIndex + deltaIndex;

    const rangeSize = dragStartRange.current.endIndex - dragStartRange.current.startIndex;

    // Проверка границ
    if (newStart < 0) {
      newStart = 0;
      newEnd = rangeSize;
    }
    if (newEnd > maxIndex) {
      newEnd = maxIndex;
      newStart = maxIndex - rangeSize;
    }

    setViewRange({ startIndex: newStart, endIndex: newEnd });
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Обработчик колеса мыши для масштабирования
  const onWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const zoomStep = 2;
    let { startIndex, endIndex } = viewRange;
    const rangeSize = endIndex - startIndex;

    if (e.deltaY < 0) { // Уменьшение масштаба
      if (rangeSize > 5) {
        const newRangeSize = Math.max(5, rangeSize - zoomStep);
        const center = Math.floor((startIndex + endIndex) / 2);
        startIndex = Math.max(0, center - Math.floor(newRangeSize / 2));
        endIndex = Math.min(maxIndex, startIndex + newRangeSize);
        startIndex = endIndex - newRangeSize;
      }
    } else { // Увеличение масштаба
      const newRangeSize = Math.min(maxIndex, rangeSize + zoomStep);
      const center = Math.floor((startIndex + endIndex) / 2);
      startIndex = Math.max(0, center - Math.floor(newRangeSize / 2));
      endIndex = Math.min(maxIndex, startIndex + newRangeSize);
      startIndex = endIndex - newRangeSize;
    }

    setViewRange({ startIndex, endIndex });
  };

  return (
    <div
      style={{ padding: '20px', userSelect: isDragging ? 'none' : 'auto' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      <h2>График ошибок</h2>

      {/* Фильтры по году и месяцу */}
      <div style={{ marginBottom: 20 }}>
        <label>
          Год:{' '}
          <select
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: 20 }}>
          Месяц:{' '}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Основной график ошибок */}
      <div>
        <h3>Количество ошибок по типам</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={visibleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateStr" interval="preserveStartEnd" />
            <YAxis yAxisId="left" domain={[0, 'auto']} />
            <Tooltip />
            <Legend />
            {errorTypes.map((type, idx) => (
              <Line
                key={type}
                yAxisId="left"
                type="monotone"
                dataKey={type}
                stroke={errorColors[idx % errorColors.length]}
                name={type}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ErrorStatsList = () => (
  <List perPage={100} pagination={false} exporter={false}>
    <ChartSection />
  </List>
);

export default ErrorStatsList;