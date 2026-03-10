from django.db import models
from django.conf import settings

class Dish(models.Model):
    name               = models.CharField(max_length=200)
    description        = models.TextField()
    price              = models.DecimalField(max_digits=10, decimal_places=2)
    image              = models.ImageField(upload_to='dishes/', blank=True, null=True)
    cultural_notes     = models.TextField(blank=True, null=True)   
    preparation_steps  = models.TextField(blank=True, null=True)   
    created_at         = models.DateTimeField(auto_now_add=True)
    is_deleted         = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class CommunityPhoto(models.Model):
    dish       = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='community_photos')
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    photo      = models.ImageField(upload_to='community/')
    caption    = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} – {self.dish.name}"

    class Meta:
        ordering = ['-created_at']