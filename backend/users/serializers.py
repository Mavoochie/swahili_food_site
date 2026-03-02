from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'read_only': True},  # Users cannot self-assign admin role
        }

    def create(self, validated_data):
        # Always register new users as 'user' role — only superuser can make admins
        validated_data['role'] = 'user'
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)