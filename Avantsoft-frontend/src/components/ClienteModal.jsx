import React, { useState, useEffect } from "react"
import api from "../api/axios"

export default function ClienteModal({ cliente, onClose }) {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [nascimento, setNascimento] = useState("")
  const [erros, setErros] = useState({})

  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome)
      setEmail(cliente.email)
      setNascimento(cliente.nascimento)
    } else {
      setNome("")
      setEmail("")
      setNascimento("")
    }
    setErros({})
  }, [cliente])

  const salvar = () => {
    const payload = { nome, email, nascimento }

    const req = cliente
      ? api.put(`/clientes/${cliente.id}/`, payload)
      : api.post("/clientes/", payload)

    req
      .then(() => onClose())
      .catch((err) => {
        if (err.response?.data) {
          setErros(err.response.data)
        } else {
          setErros({ geral: "Erro inesperado ao salvar cliente." })
        }
      })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {cliente ? "Editar Cliente" : "Novo Cliente"}
        </h2>

        {erros.geral && (
          <p className="text-red-600 mb-2">{erros.geral}</p>
        )}

        <div className="space-y-4">
          <div>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            {erros.nome && (
              <p className="text-red-500 text-sm">{erros.nome.join(", ")}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {erros.email && (
              <p className="text-red-500 text-sm">{erros.email.join(", ")}</p>
            )}
          </div>

          <div>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
            />
            {erros.nascimento && (
              <p className="text-red-500 text-sm">
                {erros.nascimento.join(", ")}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
