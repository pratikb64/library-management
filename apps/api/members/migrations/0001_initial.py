# Generated by Django 5.1.2 on 2024-11-11 12:26

import members.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Member',
            fields=[
                ('id', models.IntegerField(default=members.models.generate_random_id, editable=False, primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('joining_date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
