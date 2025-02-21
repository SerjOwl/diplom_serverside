import requests
from config import Config

config = Config()

url = f"http://{config.host}:{config.port}/get-name"

params = {
    "input_content": "Привет",
    "deep_think": False,
    "print_log": True
}

response = requests.get(url, params=params)
print(response)
