from django.db import models

class Message(models.Model):
    dt = models.DateTimeField()
    text = models.CharField(max_length=500)
    sender = models.ForeignKey(
        'users.CustomUser',
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="sender"
        )
    receiver =  models.ForeignKey(
        'users.CustomUser',
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="receiver"
    )
    chat = models.ForeignKey(
        'chats.Chat',
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )

    def __str__(self):
        return 'Message {}'.format(self.text)