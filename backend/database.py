from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import time

DATABASE_URL = "postgresql://user:password@db:5432/barbearia"

# tenta conectar várias vezes até o banco subir
for i in range(10):
    try:
        engine = create_engine(DATABASE_URL)
        connection = engine.connect()
        print("Banco conectado!")
        break
    except Exception as e:
        print("Aguardando banco iniciar...")
        time.sleep(3)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()