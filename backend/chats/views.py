from rest_framework import viewsets

from chats.models import Chat
from chats.serializers import ChatSerializer

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer