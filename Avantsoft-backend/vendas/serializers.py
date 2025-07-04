from rest_framework import serializers
from .models import Venda

class VendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venda
        fields = ['id', 'cliente', 'data', 'valor']
