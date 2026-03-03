from rest_framework import serializers
from .models import Dish, CommunityPhoto

class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'name', 'description', 'price', 'image', 'created_at']

class CommunityPhotoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = CommunityPhoto
        fields = ['id', 'dish', 'username', 'photo', 'caption', 'created_at']
        read_only_fields = ['user', 'created_at']