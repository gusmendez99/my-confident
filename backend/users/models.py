from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    dt = models.DateTimeField(auto_now=True)
    pass_hash = models.CharField(max_length=60)
    public_key = models.CharField(max_length=256)
    user_data = models.TextField()

    def __str__(self):
        return self.user_data

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        permissions = (
            ('disable_user', "Can disable user"),
        )
    