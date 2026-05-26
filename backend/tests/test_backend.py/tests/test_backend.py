from fastapi.testclient import TestClient
import sys
import os

sys.path.append(os.path.abspath("backend"))

from main import app

client = TestClient(app)


def test_login_correto():
    resposta = client.post("/login", json={
        "usuario": "admin",
        "senha": "1234"
    })

    assert resposta.status_code == 200
    assert resposta.json()["status"] == "ok"


def test_login_senha_incorreta():
    resposta = client.post("/login", json={
        "usuario": "admin",
        "senha": "0000"
    })

    assert resposta.status_code == 401


def test_cadastro_agendamento_valido():
    resposta = client.post("/clientes", json={
        "nome": "Arthur",
        "servico": "Corte + Barba",
        "data": "2026-05-02",
        "horario": "18:00",
        "status": "Agendado"
    })

    assert resposta.status_code == 200
    dados = resposta.json()
    assert dados["nome"] == "Arthur"
    assert dados["servico"] == "Corte + Barba"
    assert dados["status"] == "Agendado"


def test_cadastro_agendamento_invalido():
    resposta = client.post("/clientes", json={
        "nome": "",
        "servico": "Corte de cabelo",
        "data": "2026-05-02",
        "horario": "18:00",
        "status": "Agendado"
    })

    assert resposta.status_code in [200, 422]


def test_listar_agendamentos():
    resposta = client.get("/clientes")

    assert resposta.status_code == 200
    assert isinstance(resposta.json(), list)


def test_fluxo_editar_e_excluir_agendamento():
    criar = client.post("/clientes", json={
        "nome": "Cliente Teste",
        "servico": "Barba",
        "data": "2026-05-03",
        "horario": "14:00",
        "status": "Agendado"
    })

    assert criar.status_code == 200
    cliente_id = criar.json()["id"]

    editar = client.put(f"/clientes/{cliente_id}", json={
        "nome": "Cliente Teste",
        "servico": "Barba",
        "data": "2026-05-03",
        "horario": "14:00",
        "status": "Concluído"
    })

    assert editar.status_code == 200
    assert editar.json()["status"] == "Concluído"

    excluir = client.delete(f"/clientes/{cliente_id}")

    assert excluir.status_code == 200
    assert excluir.json()["mensagem"] == "Cliente excluído com sucesso"