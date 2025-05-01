import jsonServerProvider from "ra-data-json-server";

const baseDataProvider = jsonServerProvider(import.meta.env.VITE_JSON_SERVER_URL);

// Рекурсивная функция для замены null на ""
function sanitizeRecord<T>(record: T): T {
  if (Array.isArray(record)) {
    // @ts-expect-error
    return record.map(sanitizeRecord);
  } else if (record !== null && typeof record === "object") {
    const sanitized: any = {};
    Object.entries(record).forEach(([key, value]) => {
      sanitized[key] = value === null ? "" : sanitizeRecord(value);
    });
    return sanitized;
  }
  return record;
}

// Кастомная обработка для NeurologStats
const addIdsForStats = (data: any[]) => 
  data.map((item, index) => ({
    ...item,
    id: item.session_date || `generated-${index}` // Используем session_date или генерируем id
  }));

export const dataProvider = {
  ...baseDataProvider,
  
  getList: async (resource: string, params: any) => {
    if (resource === "NeurologStats") {
      // Кастомная реализация для статистики
      try {
        const response = await fetch('https://localhost:7171/api/NeurologsStats');
        let data = await response.json();
        
        // Добавляем id и санитайзим данные
        data = addIdsForStats(data).map(sanitizeRecord);
        
        return {
          data,
          total: data.length,
        };
      } catch (error) {
        console.error("Ошибка загрузки NeurologStats:", error);
        return { data: [], total: 0 };
      }
    }

    if (resource === "ErrorStatsDaily") {
      // Кастомная реализация для статистики
      try {
        const response = await fetch('https://localhost:7171/api/ErrorStatsDaily');
        let data = await response.json();
        
        // Добавляем id и санитайзим данные
        data = addIdsForStats(data).map(sanitizeRecord);
        
        return {
          data,
          total: data.length,
        };
      } catch (error) {
        console.error("Ошибка загрузки ErrorStatsDaily:", error);
        return { data: [], total: 0 };
      }
    }
    
    // Стандартная обработка для других ресурсов
    const { data, total } = await baseDataProvider.getList(resource, params);
    return {
      data: Array.isArray(data) ? data.map(sanitizeRecord) : [],
      total,
    };
  },

  // Остальные методы остаются без изменений, но добавляем санитайзинг
  getOne: (resource: string, params: any) =>
    baseDataProvider.getOne(resource, params).then(({ data }) => ({
      data: data ? sanitizeRecord(data) : {},
    })),

  getMany: (resource: string, params: any) =>
    baseDataProvider.getMany(resource, params).then(({ data }) => ({
      data: Array.isArray(data) ? data.map(sanitizeRecord) : [],
    })),

  getManyReference: (resource: string, params: any) =>
    baseDataProvider.getManyReference(resource, params).then(({ data, total }) => ({
      data: Array.isArray(data) ? data.map(sanitizeRecord) : [],
      total,
    })),

  update: (resource: string, params: any) =>
    baseDataProvider.update(resource, params).then(({ data }) => ({
      data: data ? sanitizeRecord(data) : {},
    })),

  updateMany: (resource: string, params: any) =>
    baseDataProvider.updateMany(resource, params).then(({ data }) => ({
      data: Array.isArray(data) ? data : [],
    })),

  create: (resource: string, params: any) =>
    baseDataProvider.create(resource, params).then(({ data }) => ({
      data: data ? sanitizeRecord(data) : {},
    })),

  delete: (resource: string, params: any) =>
    baseDataProvider.delete(resource, params).then(({ data }) => ({
      data: data ? sanitizeRecord(data) : {},
    })),

  deleteMany: (resource: string, params: any) =>
    baseDataProvider.deleteMany(resource, params).then(({ data }) => ({
      data: Array.isArray(data) ? data : [],
    })),
};
