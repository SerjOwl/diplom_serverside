import asyncio
import uvicorn
import re

from ollama import chat, ChatResponse
from fastapi import FastAPI, Query
from config import Config


system_prompt = 'You are a module of an application called SkyAI. You must answer only in Russian language.'

app = FastAPI()
config = Config()


@app.get("/get-answer-from-deepseek")
async def ask_deepseek(
        input_content: str = Query(..., description="User input for DeepSeek"),
        deep_think: bool = Query(False, description="Include Deep Think section"),
        print_log: bool = Query(False, description="Print response log")
):
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

    return {"response": clean_response, "deep_think": think_texts} if deep_think else {"response": clean_response}


def ask_deepseek_stream(input_content: str, deep_think: bool = False, print_log: bool = True):
    stream = chat(
        model=config.deepseek_model,
        messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': input_content}
        ],
        stream=True,
    )
    for chunk in stream:
        print(chunk['message']['content'], end='', flush=True)


# async def main():
    # uvicorn.run(app, host=config.host, port=config.port)
    # await ask_deepseek('Привет', False, True) 
    # ask_deepseek_stream('Почему небо голубое?', False, False)


if __name__ == "__main__":
    uvicorn.run(app, host=config.host, port=config.port)
