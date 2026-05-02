import React, { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"

const API = "http://localhost:8000"

function App() {
  const [logado, setLogado] = useState(false)
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const [clientes, setClientes] = useState([])
  const [editando, setEditando] = useState(null)
  const [pesquisa, setPesquisa] = useState("")
  const [mensagem, setMensagem] = useState("")

  const [form, setForm] = useState({
    nome: "",
    servico: "Corte de cabelo",
    data: "",
    horario: "",
    status: "Agendado",
  })

  function carregarClientes() {
    fetch(`${API}/clientes`)
      .then((res) => res.json())
      .then((data) => setClientes(data))
  }

  useEffect(() => {
    if (logado) carregarClientes()
  }, [logado])

  function login(e) {
    e.preventDefault()

    fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Login inválido")
        return res.json()
      })
      .then(() => setLogado(true))
      .catch(() => alert("Usuário ou senha inválidos"))
  }

  function salvarCliente(e) {
    e.preventDefault()

    const url = editando ? `${API}/clientes/${editando}` : `${API}/clientes`
    const metodo = editando ? "PUT" : "POST"

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then(() => {
      setMensagem(editando ? "Agendamento atualizado!" : "Agendamento cadastrado!")
      setEditando(null)
      setForm({
        nome: "",
        servico: "Corte de cabelo",
        data: "",
        horario: "",
        status: "Agendado",
      })
      carregarClientes()
      setTimeout(() => setMensagem(""), 3000)
    })
  }

  function editarCliente(cliente) {
    setEditando(cliente.id)
    setForm({
      nome: cliente.nome,
      servico: cliente.servico,
      data: cliente.data,
      horario: cliente.horario,
      status: cliente.status,
    })
  }

  function excluirCliente(id) {
    if (!confirm("Deseja excluir este agendamento?")) return

    fetch(`${API}/clientes/${id}`, {
      method: "DELETE",
    }).then(() => carregarClientes())
  }

  const filtrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(pesquisa.toLowerCase())
  )

  const concluidos = clientes.filter((c) => c.status === "Concluído").length
  const cancelados = clientes.filter((c) => c.status === "Cancelado").length
  const agendados = clientes.filter((c) => c.status === "Agendado").length

  if (!logado) {
    return (
      <div style={styles.loginPage}>
        <form onSubmit={login} style={styles.loginCard}>
          <h1 style={styles.logo}>💈 Barbearia Pro</h1>
          <p style={styles.subtitle}>Painel administrativo</p>

          <input
            style={styles.input}
            placeholder="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button style={styles.goldButton}>Entrar</button>

          <p style={styles.hint}>Usuário: admin | Senha: 1234</p>
        </form>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>💈 Barbearia Pro</h1>
            <p style={styles.subtitleDark}>Gestão de clientes e agendamentos</p>
          </div>

          <button style={styles.logout} onClick={() => setLogado(false)}>
            Sair
          </button>
        </header>

        <section style={styles.cards}>
          <div style={styles.card}>
            <h2>{clientes.length}</h2>
            <p>Total</p>
          </div>
          <div style={styles.card}>
            <h2>{agendados}</h2>
            <p>Agendados</p>
          </div>
          <div style={styles.card}>
            <h2>{concluidos}</h2>
            <p>Concluídos</p>
          </div>
          <div style={styles.card}>
            <h2>{cancelados}</h2>
            <p>Cancelados</p>
          </div>
        </section>

        <section style={styles.formCard}>
          <h2>{editando ? "✏️ Editar Agendamento" : "➕ Novo Agendamento"}</h2>

          {mensagem && <p style={styles.success}>{mensagem}</p>}

          <form onSubmit={salvarCliente} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Nome do cliente"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />

            <select
              style={styles.input}
              value={form.servico}
              onChange={(e) => setForm({ ...form, servico: e.target.value })}
            >
              <option>Corte de cabelo</option>
              <option>Barba</option>
              <option>Corte + Barba</option>
              <option>Sobrancelha</option>
              <option>Tratamento capilar</option>
            </select>

            <input
              style={styles.input}
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              required
            />

            <input
              style={styles.input}
              type="time"
              value={form.horario}
              onChange={(e) => setForm({ ...form, horario: e.target.value })}
              required
            />

            <select
              style={styles.input}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Agendado</option>
              <option>Concluído</option>
              <option>Cancelado</option>
            </select>

            <button style={styles.goldButton}>
              {editando ? "Salvar" : "Cadastrar"}
            </button>
          </form>
        </section>

        <section style={styles.listCard}>
          <div style={styles.listHeader}>
            <h2>📅 Agenda</h2>
            <input
              style={styles.search}
              placeholder="Pesquisar cliente..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>

          {filtrados.length === 0 ? (
            <p>Nenhum agendamento encontrado.</p>
          ) : (
            filtrados.map((cliente) => (
              <div key={cliente.id} style={styles.clientCard}>
                <div>
                  <h3>{cliente.nome}</h3>
                  <p>✂️ {cliente.servico}</p>
                  <p>📆 {cliente.data}</p>
                  <p>🕒 {cliente.horario}</p>
                </div>

                <div style={styles.actions}>
                  <span style={badgeStyle(cliente.status)}>{cliente.status}</span>
                  <button style={styles.edit} onClick={() => editarCliente(cliente)}>
                    Editar
                  </button>
                  <button style={styles.delete} onClick={() => excluirCliente(cliente.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  )
}

function badgeStyle(status) {
  let bg = "#2563eb"
  if (status === "Concluído") bg = "#16a34a"
  if (status === "Cancelado") bg = "#dc2626"

  return {
    background: bg,
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "bold",
  }
}

const styles = {
  loginPage: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #111827)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  loginCard: {
    background: "#fff",
    padding: "40px",
    borderRadius: "24px",
    width: "360px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  logo: {
    margin: 0,
    color: "#111827",
  },
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #1e293b)",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    background: "#fff",
    padding: "30px",
    borderRadius: "22px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "36px",
    color: "#111827",
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: "20px",
  },
  subtitleDark: {
    color: "#6b7280",
  },
  hint: {
    fontSize: "13px",
    color: "#6b7280",
    textAlign: "center",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
  },
  formCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
    marginBottom: "20px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
  },
  goldButton: {
    background: "#d4af37",
    color: "#111827",
    border: "none",
    padding: "14px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  logout: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
  },
  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "10px",
  },
  listCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  search: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    width: "280px",
  },
  clientCard: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  edit: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  delete: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "10px",
    cursor: "pointer",
  },
}

createRoot(document.getElementById("root")).render(<App />)