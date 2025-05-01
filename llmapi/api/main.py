import asyncio
import uvicorn
import re
import time
import uuid

from ollama import chat, ChatResponse
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from config import Config

system_prompt = 'You are a module of an application called SkyAI. You must answer only in Russian language.'

app = FastAPI()

config = Config()

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

    # тестовый режим работы сервера, просто отправляю приколы обратно. В падлу разворачивать на сервере ЛЛМ
    if user_id != None:
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

        # Пример получения количества токенов (зависит от используемой модели/библиотеки)
        input_tokens = len(input_content.split())  # Примерный подсчет токенов
        output_tokens = len(response_text.split())  # Примерный подсчет токенов

    except Exception as e:
        error_message = str(e)

    response_time = int((time.time() - start_time) * 1000)  # В миллисекундах

    return {
        "user_id": user_id,
        "session_id": session_id,
        "prompt": input_content,
        "response": clean_response if not error_message else None,
        "deep_think": think_texts if deep_think and not error_message else None,
        "response_time": response_time,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "error_message": error_message
    }

origins = ["*"]
# origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host=config.host, port=config.port)