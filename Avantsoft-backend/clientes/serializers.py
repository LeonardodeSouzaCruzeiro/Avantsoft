from rest_framework import serializers
from .models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    nascimento = serializers.DateField(source='data_nascimento')
    class Meta:
        model = Cliente
        fields = ['id', 'nome', 'email', 'nascimento']