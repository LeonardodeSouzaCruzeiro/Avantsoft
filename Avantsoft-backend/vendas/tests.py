from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from clientes.models import Cliente
from vendas.models import Venda
from datetime import date

class VendaTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="teste", password="123")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        self.cliente = Cliente.objects.create(nome="Lucas", email="lucas@ex.com", nascimento="1990-01-01")

    def test_criar_venda(self):
        data = {
            "cliente": self.cliente.id,
            "data": "2024-01-01",
            "valor": "150.00"
        }
        response = self.client.post("/api/vendas/", data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Venda.objects.count(), 1)

    def test_estatisticas_por_dia(self):
        Venda.objects.create(cliente=self.cliente, data="2024-01-01", valor=100)
        Venda.objects.create(cliente=self.cliente, data="2024-01-01", valor=50)
        Venda.objects.create(cliente=self.cliente, data="2024-01-02", valor=200)
        response = self.client.get("/api/estatisticas/vendas-dia/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["total"], 150)

    def test_estatisticas_ranking(self):
        Venda.objects.create(cliente=self.cliente, data="2024-01-01", valor=100)
        Venda.objects.create(cliente=self.cliente, data="2024-01-02", valor=300)
        response = self.client.get("/api/estatisticas/clientes-ranking/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("maior_total", response.data)
