import random

from django.db import models


def generate_random_id(length=8):
    return random.randint(10 ** (length - 1), 10**length - 1)


class Member(models.Model):
    id = models.IntegerField(
        primary_key=True,
        default=generate_random_id,
        editable=False,
    )
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField()
    joining_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.first_name + " " + self.last_name
