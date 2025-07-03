from django.contrib import admin
from .models import Cliente  

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'data_nascimento')
    search_fields = ('nome', 'email')

