Скачать приложение ollama
Зайти на https://ollama.com/library/deepseek-r1:14b и скачать нужную версию модели
	Если надо - отредачить исходный код в плане используемой модели, в базе использую 14b
Само приложение настраивать не надо, оно сидит в трее на автозапуске

pip install пакетов
pip install uvicorn

это запускает апи
перейти в папку diplom_serverside/api
uvicorn main:app --reload

Пример в send.py есть

# await ask_deepseek('Привет', False, True) 
# ask_deepseek_stream('Почему небо голубое?', False, False)
Это не пойдет тк мы собираемся обращаться к нему извне, это для тестов
Если что я пихнул порт и хост в config.py, если ошибки будут поменяешь

Для установки зависимостей:
pip install -r requirements.txt
