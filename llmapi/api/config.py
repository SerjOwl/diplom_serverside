class Config:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Config, cls).__new__(cls)
            cls._instance.port = 8000
            cls._instance.host = "127.0.0.1"
            cls._instance.deepseek_model = 'deepseek-r1:14b'
            cls._instance.url = "https://localhost:7171/api/NeuroLogs"

        return cls._instance

