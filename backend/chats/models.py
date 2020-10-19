from django.db import models

class Chat(models.Model):
    dt = models.DateTimeField()
    user1 = models.ForeignKey(
        'users.CustomUser',
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="first_user"
    )
    user1_sk_sym = models.CharField(max_length=500)
    user2 = models.ForeignKey(
        'users.CustomUser',
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="second_user"
    )
    user2_sk_sym = models.CharField(max_length=500)
    last_message_dt = models.DateTimeField()

    def __str__(self):
        return 'Chat {}'.format(self.id)