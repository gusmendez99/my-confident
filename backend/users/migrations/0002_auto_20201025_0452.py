# Generated by Django 3.1.2 on 2020-10-25 04:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='dt',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
