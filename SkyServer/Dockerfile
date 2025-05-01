# Этап 1: сборка приложения
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Копируем файл проекта и восстанавливаем зависимости (кэшируется Docker)
COPY *.csproj ./
RUN dotnet restore

# Копируем весь исходный код и собираем проект
COPY . ./
RUN dotnet build -c Release --no-restore

# Публикуем приложение в папку /app
RUN dotnet publish -c Release -o /app --no-restore

# Этап 2: создание runtime-образа
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

# Добавляем небезопасного пользователя для безопасности
RUN useradd -m -r -u 1000 appuser

# Копируем опубликованные файлы из этапа сборки
COPY --from=build /app ./

# Назначаем владельцем пользователя appuser
RUN chown -R appuser:appuser /app

# Переключаемся на небезопасного пользователя
USER appuser

# Открываем порт, на котором будет работать приложение (например, 8080)
EXPOSE 8080

# Задаем команду запуска приложения
ENTRYPOINT ["dotnet", "SkyServer.dll"]
