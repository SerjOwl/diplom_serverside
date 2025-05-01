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
    if (!data || data.length === 0) return [];

    const allDates = Array.from(new Set(data.map(e => e.day))).sort();
    const allTypes = Array.from(new Set(data.map(e => e.error_type)));

    return allDates.map(date => {
      const entry = { date: new Date(date).toLocaleDateString() };
      allTypes.forEach(type => {
        const stat = data.find(e => e.day === date && e.error_type === type);
        entry[type] = stat ? stat.error_count : 0;
      });
      return entry;
    });
  }, [data]);

  const errorTypes = React.useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map(e => e.error_type)));
  }, [data]);

  const errorColors = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8',
    '#f58231', '#911eb4', '#46f0f0', '#f032e6',
    '#bcf60c', '#fabebe', '#008080', '#e6beff'
  ];

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

  const maxTokens = React.useMemo(() => {
    if (visibleData.length === 0) return 0;
    const maxInput = Math.max(...visibleData.map(d => d.inputTokens));
    const maxOutput = Math.max(...visibleData.map(d => d.outputTokens));
    return Math.max(maxInput, maxOutput);
  }, [visibleData]);

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
    <div style={{ padding: '20px' }}>
      <h2>График ошибок</h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" interval="preserveStartEnd" />
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
  );
};

export const ErrorStatsList = () => (
  <List perPage={100} pagination={false} exporter={false}>
    <ChartSection />
  </List>
);

export default ErrorStatsList;
