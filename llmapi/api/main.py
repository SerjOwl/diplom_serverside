import asyncio
import uvicorn
import re
import time
import uuid
import httpx  # добавляем импорт httpx

from ollama import chat, ChatResponse
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from config import Config

system_prompt = 'You are a module of an application called SkyAI. You must answer only in Russian language.'

app = FastAPI()

config = Config()

# Асинхронная функция для отправки логов
async def send_log(log_data: dict):
    headers = {
        "accept": "*/*",
        "Content-Type": "application/json"
    }
    async with httpx.AsyncClient(verify=False) as client:  # verify=False для локального https
        try:
            response = await client.post(config.url, json=log_data, headers=headers)
            response.raise_for_status()
        except Exception as e:
            # Логируем ошибку отправки лога, но не прерываем основное выполнение
            print(f"Ошибка отправки лога: {e}")

@app.get("/ask_deepseek")
async def ask_deepseek(
        input_content: str = Query(..., description="User input for DeepSeek"),
        user_id: str = Query(..., description="User ID"),
        session_id: str = Query(None, description="Session ID"),
        deep_think: bool = Query(False, description="Include Deep Think section"),
        print_log: bool = Query(False, description="Print response log")
):
    start_time = time.time()
    error_message = None
    response_text = ""
    think_texts = ""
    input_tokens = 0
    output_tokens = 0

    if not session_id:
        session_id = str(uuid.uuid4())

    # тестовый режим работы сервера, просто отправляю приколы обратно.
    if user_id is None:
        return {
            "user_id": user_id,
            "session_id": "test session_id",
            "prompt": input_content,
            "response": input_content,
            "deep_think": "test deep_think",
            "response_time": "test response_time",
            "input_tokens": "test input_tokens",
            "output_tokens": "test output_tokens",
            "error_message": "test error_message"
        }

    try:
        response: ChatResponse = chat(
            model=config.deepseek_model,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': input_content}
            ]
        )
        response_text = response['message']['content']

        if print_log:
            print(response_text)

        think_texts = "\n\n".join(re.findall(r'<think>(.*?)</think>', response_text, flags=re.DOTALL)).strip()
        clean_response = re.sub(r'<think>.*?</think>', '', response_text, flags=re.DOTALL).strip()

        input_tokens = len(input_content.split())  # примерный подсчет токенов
        output_tokens = len(response_text.split())  # примерный подсчет токенов

    except Exception as e:
        error_message = str(e)
        clean_response = None

    response_time_seconds = time.time() - start_time
    response_time_str = time.strftime("%H:%M:%S", time.gmtime(response_time_seconds)) + f".{int((response_time_seconds % 1) * 1e7):07d}"

    # Формируем данные для лога
    log_data = {
        "user_id": int(user_id) if user_id.isdigit() else user_id,
        "session_id": session_id,
        "prompt": input_content,
        "response_time": response_time_str,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "error_message": error_message,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%S")
    }

    asyncio.create_task(send_log(log_data))

    return {
        "user_id": user_id,
        "session_id": session_id,
        "prompt": input_content,
        "response": clean_response,
        "deep_think": think_texts if deep_think and not error_message else None,
        "response_time": int(response_time_seconds * 1000),  # в миллисекундах
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "error_message": error_message
    }

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host=config.host, port=config.port)
