from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendaViewSet, estatisticas_vendas_por_dia, estatisticas_clientes
from rest_framework.authtoken.views import obtain_auth_token


router = DefaultRouter()
router.register(r'vendas', VendaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('estatisticas/vendas-dia/', estatisticas_vendas_por_dia),
    path('estatisticas/clientes-ranking/', estatisticas_clientes),
    path('token/', obtain_auth_token, name='api_token_auth'),
]
