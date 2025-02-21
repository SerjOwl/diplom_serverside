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

if response.status_code == 200:
    print(response.text)
else: 
    print(f"Error: {response.status_code}")
