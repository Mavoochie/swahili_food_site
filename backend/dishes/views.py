from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Dish, CommunityPhoto
from .serializers import DishSerializer, CommunityPhotoSerializer

class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'admin'

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    permission_classes = [IsAdminRole]
    parser_classes = [MultiPartParser, FormParser]  # ← handles image uploads

class CommunityPhotoViewSet(viewsets.ModelViewSet):
    serializer_class = CommunityPhotoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        dish_id = self.request.query_params.get('dish')
        if dish_id:
            return CommunityPhoto.objects.filter(dish_id=dish_id)
        return CommunityPhoto.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        from rest_framework.exceptions import PermissionDenied
        if instance.user != self.request.user and self.request.user.role != 'admin':
            raise PermissionDenied("You can only delete your own photos.")
        instance.delete()