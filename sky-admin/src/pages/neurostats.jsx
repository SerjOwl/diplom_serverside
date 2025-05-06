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
import { convertTimeToMilliseconds } from '../modules/utils';

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

  const processedData = React.useMemo(() => {
    if (!data) return [];
    return data
      .map(item => {
        const date = new Date(item.session_date);
        return {
          id: item.session_date,
          date,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          dateStr: date.toLocaleDateString(),
          avgResponseMs: convertTimeToMilliseconds(item.avg_response_time),
          inputTokens: item.avg_input_tokens,
          outputTokens: item.avg_output_tokens,
          requests: item.total_requests,
        };
      })
      .sort((a, b) => a.date - b.date);
  }, [data]);

  const years = React.useMemo(() => {
    const set = new Set(processedData.map(d => d.year));
    return Array.from(set).sort((a, b) => a - b);
  }, [processedData]);

  const [selectedYear, setSelectedYear] = React.useState(years[0] || null);
  const [selectedMonth, setSelectedMonth] = React.useState(0);

  const filteredData = React.useMemo(() => {
    if (!selectedYear) return [];

    return processedData.filter(d => {
      if (d.year !== selectedYear) return false;
      if (selectedMonth === 0) return true;
      return d.month === selectedMonth;
    });
  }, [processedData, selectedYear, selectedMonth]);

  const [viewRange, setViewRange] = React.useState({
    startIndex: 0,
    endIndex: filteredData.length > 0 ? filteredData.length - 1 : 0,
  });

  React.useEffect(() => {
    setViewRange({
      startIndex: 0,
      endIndex: filteredData.length > 0 ? filteredData.length - 1 : 0,
    });
  }, [filteredData]);

  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartX = React.useRef(null);
  const dragStartRange = React.useRef(null);

  const maxIndex = filteredData.length - 1;

  const visibleData = React.useMemo(() => {
    return filteredData.slice(viewRange.startIndex, viewRange.endIndex + 1);
  }, [filteredData, viewRange]);

  // Определяем максимум между inputTokens и outputTokens для левой оси токенов
  const maxTokens = React.useMemo(() => {
    if (visibleData.length === 0) return 0;
    const maxInput = Math.max(...visibleData.map(d => d.inputTokens));
    const maxOutput = Math.max(...visibleData.map(d => d.outputTokens));
    return Math.max(maxInput, maxOutput);
  }, [visibleData]);

  // Обработчики мыши для панорамирования
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

  const onWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const zoomStep = 2;
    let { startIndex, endIndex } = viewRange;
    const rangeSize = endIndex - startIndex;

    if (e.deltaY < 0) {
      if (rangeSize > 5) {
        const newRangeSize = Math.max(5, rangeSize - zoomStep);
        const center = Math.floor((startIndex + endIndex) / 2);
        startIndex = Math.max(0, center - Math.floor(newRangeSize / 2));
        endIndex = Math.min(maxIndex, startIndex + newRangeSize);
        startIndex = endIndex - newRangeSize;
      }
    } else {
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
      <h2>Графики производительности</h2>

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

      {/* График токенов (input и output) с одной левой осью Y */}
      <div style={{ marginBottom: 40 }}>
        <h3>Токены</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={visibleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateStr" interval="preserveStartEnd" />
            <YAxis
              yAxisId="left"
              domain={[0, Math.ceil(maxTokens * 1.1)]} // чуть больше максимума для отступа
            />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="inputTokens" stroke="#82ca9d" name="Входящие токены" />
            <Line yAxisId="left" type="monotone" dataKey="outputTokens" stroke="#ff7300" name="Исходящие токены" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Отдельный график для количества запросов */}
      <div style={{ marginBottom: 40 }}>
        <h3>Количество запросов</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={visibleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateStr" interval="preserveStartEnd" />
            <YAxis yAxisId="left" domain={[0, 'auto']} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="requests" stroke="#8884d8" name="Запросы" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* График времени ответа */}
      <div>
        <h3>Время ответа (мс)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={visibleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateStr" interval="preserveStartEnd" />
            <YAxis
              yAxisId="left"
              domain={[0, 'auto']}
              tickFormatter={(value) => `${value} мс`}
            />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="avgResponseMs" stroke="#413ea0" name="Время ответа" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const NeuroStatsList = () => (
  <List perPage={100} pagination={false} exporter={false}>
    <ChartSection />
  </List>
);

export default NeuroStatsList;
