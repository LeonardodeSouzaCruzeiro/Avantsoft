from django.db import models
from clientes.models import Cliente

class Venda(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='vendas')
    data = models.DateField()
    valor = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.cliente.nome} - {self.valor} em {self.data}"