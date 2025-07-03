// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ClientesPage from "./pages/ClientesPage";
import EstatisticasPage from "./pages/EstatisticasPage";
import LayoutAutenticado from "./components/LayoutAutenticado";

const isAuthenticated = () => !!localStorage.getItem("accessToken");

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/clientes"
          element={
            isAuthenticated() ? (
              <LayoutAutenticado>
                <ClientesPage />
              </LayoutAutenticado>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        <Route
          path="/estatisticas"
          element={
            isAuthenticated() ? (
              <LayoutAutenticado>
                <EstatisticasPage />
              </LayoutAutenticado>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        <Route
          path="*"
          element={<Navigate to={isAuthenticated() ? "/clientes" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}
