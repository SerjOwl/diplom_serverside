Скачать приложение ollama
Зайти на https://ollama.com/library/deepseek-r1:14b и скачать нужную версию модели
	Если надо - отредачить исходный код в плане используемой модели, в базе использую 14b
Само приложение настраивать не надо, оно сидит в трее на автозапуске

pip install пакетов
pip install uvicorn

это запускает апи
uvicorn main:app --reload

/get-answer-from-deepseek?input_content=ПРОМПТ&deep_think=False&print_log=True

// -------------------------------------------------------- //
Серж напиши примеры запросов в send.py можешь просто список параметров написать и через for пройтись 

Пример:
params = [
	{...},
	{...}
]

for param in params:
	requests.get(url, params=param)

# await ask_deepseek('Привет', False, True) 
# ask_deepseek_stream('Почему небо голубое?', False, False)
Это не пойдет тк мы собираемся обращаться к нему извне, это для тестов
Если что я пихнул порт и хост в config.py, если ошибки будут поменяешь

Для установки зависимостей:
pip install -r requirements.txt
