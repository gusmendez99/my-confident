from rest_framework import serializers

from .models import Chat
from users.serializers import CustomUserSerializer

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        user1_sk_sym = CustomUserSerializer(many=False, read_only=True)
        user2_sk_sym = CustomUserSerializer(many=False, read_only=True)

        fields = (
            'id',
            'dt',
            'user1_sk_sym',
            'user2_sk_sym',
            'last_message_dt'
        )

