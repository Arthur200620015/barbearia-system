from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClienteCreate(BaseModel):
    nome: str
    servico: str
    data: str
    horario: str
    status: str = "Agendado"

class ClienteUpdate(BaseModel):
    nome: str
    servico: str
    data: str
    horario: str
    status: str

class Login(BaseModel):
    usuario: str
    senha: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"msg": "API Barbearia Online"}

@app.post("/login")
def login(dados: Login):
    if dados.usuario == "admin" and dados.senha == "1234":
        return {"status": "ok", "mensagem": "Login realizado com sucesso"}
    raise HTTPException(status_code=401, detail="Usuário ou senha inválidos")

@app.post("/clientes")
def criar_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    novo_cliente = models.Cliente(
        nome=cliente.nome,
        servico=cliente.servico,
        data=cliente.data,
        horario=cliente.horario,
        status=cliente.status
    )
    db.add(novo_cliente)
    db.commit()
    db.refresh(novo_cliente)
    return novo_cliente

@app.get("/clientes")
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(models.Cliente).all()

@app.put("/clientes/{cliente_id}")
def editar_cliente(cliente_id: int, cliente: ClienteUpdate, db: Session = Depends(get_db)):
    cliente_db = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()

    if not cliente_db:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    cliente_db.nome = cliente.nome
    cliente_db.servico = cliente.servico
    cliente_db.data = cliente.data
    cliente_db.horario = cliente.horario
    cliente_db.status = cliente.status

    db.commit()
    db.refresh(cliente_db)
    return cliente_db

@app.delete("/clientes/{cliente_id}")
def deletar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente_db = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()

    if not cliente_db:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    db.delete(cliente_db)
    db.commit()

    return {"mensagem": "Cliente excluído com sucesso"}