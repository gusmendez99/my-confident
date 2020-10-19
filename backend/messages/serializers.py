from rest_framework import serializers

from .models import Message
from users.serializers import CustomUserSerializer
from chats.serializers import ChatSerializer

class MsgSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        sender = CustomUserSerializer(many=False, read_only=True)
        receiver = CustomUserSerializer(many=False, read_only=True)
        fields = (
            'id',
            'dt',
            'text',
            'sender',
            'receiver',
            'chat'
        )