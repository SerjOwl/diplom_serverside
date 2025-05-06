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
import { getYearMonth } from '../modules/utils';

const ChartSection = () => {
  const { data } = useListContext();

  // Преобразование данных
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map(item => ({
      month: getYearMonth(item.month),
      userCount: item.user_count
    })).sort((a, b) => a.month - b.month);
  }, [data]);

  // Состояния для управления областью просмотра графика
  const [viewRange, setViewRange] = React.useState({
    startIndex: 0,
    endIndex: processedData.length > 0 ? processedData.length - 1 : 0,
  });

  // Сброс области просмотра при изменении данных
  React.useEffect(() => {
    setViewRange({
      startIndex: 0,
      endIndex: processedData.length > 0 ? processedData.length - 1 : 0,
    });
  }, [processedData]);

  // Логика для панорамирования графика
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartX = React.useRef(null);
  const dragStartRange = React.useRef(null);
  const maxIndex = processedData.length - 1;

  // Видимые данные в текущей области просмотра
  const visibleData = React.useMemo(() => {
    return processedData.slice(viewRange.startIndex, viewRange.endIndex + 1);
  }, [processedData, viewRange]);

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
      <h2>Рост пользователей приложения</h2>

      {/* Основной график */}
      <div>
        <h3>Количество пользователей по месяцам</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={visibleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" interval="preserveStartEnd" />
            <YAxis domain={[0, 'auto']} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="userCount"
              stroke="#3cb44b"
              name="Количество пользователей"
              dot={false}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const UserGrowthList = () => (
  <List perPage={100} pagination={false} exporter={false}>
    <ChartSection />
  </List>
);

export default UserGrowthList;