from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Comment
from .serializers import CommentSerializer

# Create your views here.
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = Comment.objects.all()
        dish_id = self.request.query_params.get('dish')
        if dish_id:
            queryset = queryset.filter(dish_id=dish_id)
        return queryset

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        if instance.user != self.request.user and self.request.user.role != 'admin':
            raise PermissionDenied("You can only delete your own comments.")
        instance.delete()