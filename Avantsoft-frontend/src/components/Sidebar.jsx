import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Users, BarChart2, Menu, X } from "lucide-react";
import logo from "../img/logo.png";

export default function Sidebar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleNavigate = () => {
    if (window.innerWidth < 768) setMenuAberto(false);
  };

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      location.pathname === path
        ? "bg-gray-100 text-avant-primary font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white shadow">
        <img src={logo} alt="Logo" className="w-32 h-auto" />
        <button onClick={() => setMenuAberto(!menuAberto)} className="text-gray-800">
          {menuAberto ? <X /> : <Menu />}
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 h-full z-40 bg-white w-64 transform transition-transform duration-300 ease-in-out
        ${menuAberto ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex`}
      >
        <div className="flex flex-col h-full p-6 overflow-auto  border-gray-200">
          <div className="mb-10 hidden md:flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-40 h-auto" />
          </div>

          <nav className="flex flex-col gap-4 text-base font-medium">
            <Link to="/clientes" onClick={handleNavigate} className={linkClass("/clientes")}>
              <Users size={18} /> Clientes
            </Link>
            <Link to="/estatisticas" onClick={handleNavigate} className={linkClass("/estatisticas")}>
              <BarChart2 size={18} /> Estatísticas
            </Link>
            <button
              onClick={() => {
                handleLogout();
                handleNavigate();
              }}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut size={18} /> Sair
            </button>
          </nav>

          {/* Rodapé mobile */}
          <div className="mt-auto md:hidden pt-10 text-sm text-center text-gray-400">
            <p>© Avantsoft {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </>
  );
}
