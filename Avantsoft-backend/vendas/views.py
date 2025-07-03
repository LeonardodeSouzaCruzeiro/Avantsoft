from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum, Avg
from django.db.models.functions import TruncDate
from .models import Venda
from .serializers import VendaSerializer
from clientes.models import Cliente

class VendaViewSet(viewsets.ModelViewSet):
    queryset = Venda.objects.all().order_by('-data')
    serializer_class = VendaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['cliente__nome', 'cliente__email']

    def get_queryset(self):
        queryset = super().get_queryset()
        cliente_id = self.request.query_params.get('cliente_id')
        if cliente_id:
            queryset = queryset.filter(cliente_id=cliente_id)
        return queryset


# ✅ View para estatísticas por dia
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def estatisticas_vendas_por_dia(request):
    dados = (
        Venda.objects
        .values('data')
        .annotate(total=Sum('valor'))
        .order_by('data')
    )
    return Response(dados)


# ✅ View para ranking dos clientes
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def estatisticas_clientes(request):
    clientes = Cliente.objects.all()
    stats = []

    for c in clientes:
        vendas = c.vendas.all()
        total = sum(v.valor for v in vendas)
        media = vendas.aggregate(media=Avg('valor'))['media'] or 0
        dias = set(v.data for v in vendas)
        stats.append({
            'cliente_id': c.id,
            'nome': c.nome,
            'total': total,
            'media': round(media, 2),
            'frequencia': len(dias),
        })

    if not stats:
        return Response({})

    maior_total = max(stats, key=lambda x: x['total'])
    maior_media = max(stats, key=lambda x: x['media'])
    maior_freq = max(stats, key=lambda x: x['frequencia'])

    return Response({
        'maior_total': maior_total,
        'maior_media': maior_media,
        'maior_frequencia': maior_freq,
    })
