from rest_framework import serializers

from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser

        fields = (
            'dt',
            'pass_hash',
            'public_key',
            'user_data'
        )