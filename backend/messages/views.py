from rest_framework import viewsets

from messages.models import Message
from messages.serializers import MsgSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MsgSerializer