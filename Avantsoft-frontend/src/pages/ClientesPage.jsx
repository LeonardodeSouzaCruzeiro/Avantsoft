import React, { useEffect, useState } from "react"
import api from "../api/axios"
import ClienteModal from "../components/ClienteModal"
import { Pencil, Trash2, Plus } from "lucide-react"

export default function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [filtro, setFiltro] = useState("")
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const itensPorPagina = 6

  const letraFaltante = (nome) => {
    const alfabeto = "abcdefghijklmnopqrstuvwxyz".split("")
    const letrasNoNome = nome.toLowerCase().replace(/[^a-z]/g, "").split("")
    const faltantes = alfabeto.filter((letra) => !letrasNoNome.includes(letra))
    return faltantes.length > 0 ? faltantes[0] : "-"
  }

  const carregarClientes = () => {
    const url = filtro ? `clientes/?search=${filtro}` : "clientes/"
    api
      .get(url)
      .then((res) => {
        setTotalPaginas(Math.ceil(res.data.length / itensPorPagina))
        const inicio = (pagina - 1) * itensPorPagina
        const fim = inicio + itensPorPagina
        setClientes(res.data.slice(inicio, fim))
      })
      .catch(() => alert("Erro ao buscar clientes."))
  }

  useEffect(() => {
    carregarClientes()
  }, [filtro, pagina])

  const abrirModalNovo = () => {
    setClienteSelecionado(null)
    setModalAberto(true)
  }

  const abrirModalEditar = (cliente) => {
    setClienteSelecionado(cliente)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    carregarClientes()
  }

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await api.delete(`clientes/${id}/`)
        setClientes(clientes.filter((cliente) => cliente.id !== id))
      } catch {
        alert("Erro ao excluir cliente.")
      }
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nome ou e-mail..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {clientes.length === 0 ? (
        <p className="text-gray-600">Nenhum cliente encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left bg-white border rounded">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Nascimento</th>
                <th className="px-4 py-2">Letra Faltante</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-800">{c.nome}</td>
                  <td className="px-4 py-2 text-gray-700">{c.email}</td>
                  <td className="px-4 py-2 text-gray-700">{new Date(c.nascimento).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs">
                      {letraFaltante(c.nome)}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => abrirModalEditar(c)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPagina(i + 1)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                pagina === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {modalAberto && (
        <ClienteModal cliente={clienteSelecionado} onClose={fecharModal} />
      )}
    </div>
  )
}
