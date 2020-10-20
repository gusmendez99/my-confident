from rest_framework import viewsets

from users.models import CustomUser
from users.serializers import CustomUserSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer