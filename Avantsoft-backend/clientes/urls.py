from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', obtain_auth_token, name='api_token_auth'),
]


