from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from clientes.models import Cliente
from vendas.models import Venda
from datetime import date

class ClienteTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="teste", password="123")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_criar_cliente(self):
        data = {
            "nome": "João",
            "email": "joao@example.com",
            "nascimento": "1990-01-01"
        }
        response = self.client.post("/api/clientes/", data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Cliente.objects.count(), 1)

    def test_filtro_por_nome(self):
        Cliente.objects.create(nome="Ana", email="ana@x.com", nascimento="1991-02-01")
        Cliente.objects.create(nome="Carlos", email="carlos@x.com", nascimento="1992-03-01")
        response = self.client.get("/api/clientes/?search=ana")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["nome"], "Ana")
