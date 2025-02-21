from ollama import chat
from ollama import ChatResponse
from fastapi import FastAPI
import requests
import json
import re

system_prompt = 'You are a module of an application called SkyAI. You must answer only in russian language.'

app = FastAPI()

@app.get("/get-message")
async def hello(name):
    return {'Message': name}

@app.get("/get-answer-from-deepseek")
async def ask_deepseek(input_content : str, deep_think : bool, print_log : bool):
    response: ChatResponse = chat(
        model='deepseek-r1:14b', 
        messages=[
        {'role' : 'system', 'content' : system_prompt},
        {'role': 'user','content': input_content}
        ]
    )
    response_text = response['message']['content']
    if print_log: print(response_text)
    # Extract everything inside <think>...</think> - this is the Deep Think
    think_texts = re.findall(r'<think>(.*?)</think>', response_text, flags=re.DOTALL)
    # Join extracted sections (optional, if multiple <think> sections exist)
    think_texts = "\n\n".join(think_texts).strip()
    # Exclude the Deep Think, and return the response
    clean_response= re.sub(r'<think>.*?</think>', '', response_text, flags=re.DOTALL).strip()

    # Return either the context, or a tuple with the context and deep think
    return clean_response if not deep_think else (clean_response, think_texts)

def ask_deepseek_stream(input_content, deep_think = False, print_log = True):
    stream: ChatResponse = chat(
        model='deepseek-r1:14b', 
        messages=[
        {'role' : 'system', 'content' : system_prompt},
        {'role': 'user','content': input_content}
        ],
        stream = True,
    )
    for chunk in stream:
        print(chunk['message']['content'], end='', flush=True)

# ask_deepseek_stream('Почему небо голубое?', False, False)

# ask_deepseek('Привет', False, True)