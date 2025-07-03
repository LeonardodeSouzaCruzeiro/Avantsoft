import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import api from "../api/axios";

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"];
const COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
const DIAS = Array.from({ length: 15 }, (_, i) => `2025-06-${String(i + 1).padStart(2, "0")}`);

export default function EstatisticasPage() {
  const [dadosClientes, setDadosClientes] = useState([]);
  const [dadosVendas, setDadosVendas] = useState([]);
  const [vendasPorDia, setVendasPorDia] = useState([]);
  const [vendasPorCliente, setVendasPorCliente] = useState([]);
  const [destaques, setDestaques] = useState({});

  useEffect(() => {
    api.get("/clientes/")
      .then((res) => {
        const clientes = res.data;

        const distribuidos = distribuirClientesPorMes(clientes);
        setDadosClientes(distribuidos);

        const vendasMensais = distribuidos.map((mes) => ({
          mes: mes.mes,
          valor: mes.clientes.reduce((total) => total + Math.floor(Math.random() * 400 + 100), 0),
        }));
        setDadosVendas(vendasMensais);

        const vendasDetalhadas = simularVendasPorCliente(clientes);
        setVendasPorCliente(vendasDetalhadas);

        const vendasDia = DIAS.map((dia) => ({
          dia,
          total: vendasDetalhadas.reduce((total, cliente) => {
            const vendasDiaCliente = cliente.vendas.filter((v) => v.dia === dia);
            return total + vendasDiaCliente.reduce((s, v) => s + v.valor, 0);
          }, 0),
        }));
        setVendasPorDia(vendasDia);

        const maiores = calcularDestaques(vendasDetalhadas);
        setDestaques(maiores);
      })
      .catch((err) => console.error("Erro ao carregar clientes", err));
  }, []);

  const distribuirClientesPorMes = (clientes) => {
    const base = MESES.map((mes) => ({ mes, clientes: [] }));
    clientes.forEach((cliente) => {
      const mesIndex = Math.floor(Math.random() * MESES.length);
      base[mesIndex].clientes.push(cliente.nome);
    });
    return base.map((dado) => ({
      mes: dado.mes,
      clientes: dado.clientes,
      quantidade: dado.clientes.length,
    }));
  };

  const simularVendasPorCliente = (clientes) => {
    return clientes.map((cliente) => {
      const numVendas = Math.floor(Math.random() * 10) + 1;
      const vendas = Array.from({ length: numVendas }).map(() => {
        const dia = DIAS[Math.floor(Math.random() * DIAS.length)];
        const valor = Math.floor(Math.random() * 400) + 100;
        return { dia, valor };
      });
      return { nome: cliente.nome, vendas };
    });
  };

  const calcularDestaques = (vendasClientes) => {
    let maiorVolume = { nome: "", total: 0 };
    let maiorMedia = { nome: "", media: 0 };
    let maiorFrequencia = { nome: "", freq: 0 };

    vendasClientes.forEach((cliente) => {
      const total = cliente.vendas.reduce((sum, v) => sum + v.valor, 0);
      const media = total / cliente.vendas.length;
      const freq = cliente.vendas.length;

      if (total > maiorVolume.total) {
        maiorVolume = { nome: cliente.nome, total };
      }
      if (media > maiorMedia.media) {
        maiorMedia = { nome: cliente.nome, media };
      }
      if (freq > maiorFrequencia.freq) {
        maiorFrequencia = { nome: cliente.nome, freq };
      }
    });

    return { maiorVolume, maiorMedia, maiorFrequencia };
  };

  return (
    <div className="space-y-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold">📈 Estatísticas Gerais</h2>

      {/* Destaques */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow text-sm">
        <p><strong>🔥 Maior volume de vendas:</strong> {destaques.maiorVolume?.nome} (R$ {destaques.maiorVolume?.total?.toLocaleString()})</p>
        <p><strong>📊 Maior média por venda:</strong> {destaques.maiorMedia?.nome} (R$ {destaques.maiorMedia?.media?.toFixed(2)})</p>
        <p><strong>🛍️ Maior frequência de compras:</strong> {destaques.maiorFrequencia?.nome} ({destaques.maiorFrequencia?.freq} vendas)</p>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Clientes por Mês */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Clientes por Mês</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosClientes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pizza de Distribuição */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Distribuição Percentual de Clientes</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosClientes}
                  dataKey="quantidade"
                  nameKey="mes"
                  outerRadius={80}
                  label
                >
                  {dadosClientes.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendas por Mês */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Simulação de Vendas por Mês (R$)</h3>
          <div className="w-full h-[300px] overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosVendas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(v) => `R$ ${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendas por Dia */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Vendas por Dia (Simulado)</h3>
          <div className="w-full h-[300px] overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vendasPorDia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip formatter={(v) => `R$ ${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
