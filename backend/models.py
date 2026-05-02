from sqlalchemy import Column, Integer, String
from database import Base

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    servico = Column(String, nullable=False)
    data = Column(String, nullable=False)
    horario = Column(String, nullable=False)
    status = Column(String, default="Agendado")