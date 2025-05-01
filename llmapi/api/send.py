import requests
from config import Config

config = Config()

url = f"http://{config.host}:{config.port}/ask_deepseek"
params = {
    "input_content": "Привет",
    "user_id": 1,
    # optional params next
    "session_id": "6f8c072b-3b14-423a-877f-4baf5554bf27",
    "deep_think": False,
    "print_log": False,
}
response = requests.get(url, params=params)

if response.status_code == 200:
    print(response.text)
else: 
    print(f"Error: {response.status_code}")

# Пример запроса
# http://127.0.0.1:7171/ask_deepseek?input_content=Привет!&user_id=1