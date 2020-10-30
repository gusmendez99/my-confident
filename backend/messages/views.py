from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from messages.models import Message
from messages.serializers import MsgSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MsgSerializer

    @action(detail=True, url_path='messages', methods=['get'])
    def getChatMessages(self, request):
        messages = []
        chat = self.get_object()
        for message in Message.objects.filter(chat = chat):
            messages.append(MsgSerializer(message).data)
            
        return Response(messages)

        
            