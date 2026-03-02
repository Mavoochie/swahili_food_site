from django.db import models
from dishes.models import Dish
from django.conf import settings

# Create your models here.
class Comment(models.Model):
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} on {self.dish.name}: {self.text[:40]}"

    class Meta:
        ordering = ['-created_at']