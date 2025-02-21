Скачать приложение ollama
Зайти на https://ollama.com/library/deepseek-r1:14b и скачать нужную версию модели
	Если надо - отредачить исходный код в плане используемой модели, в базе использую 14b
Само приложение настраивать не надо, оно сидит в трее на автозапуске

pip install пакетов
pip install uvicorn

это запускает апи
uvicorn main:app --reload

/get-answer-from-deepseek?input_content=ПРОМПТ&deep_think=False&print_log=True