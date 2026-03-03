from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DishViewSet, CommunityPhotoViewSet

router = DefaultRouter()
router.register(r'dishes', DishViewSet)
router.register(r'community-photos', CommunityPhotoViewSet, basename='community-photo')

urlpatterns = [
    path('', include(router.urls)),
]