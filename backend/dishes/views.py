from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Dish
from .serializers import DishSerializer

# Create your views here.
class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'admin'

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    permission_classes = [IsAdminRole]