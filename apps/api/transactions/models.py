import random

from books.models import Book
from django.db import models
from members.models import Member


def generate_random_id(length=8):
    return random.randint(10 ** (length - 1), 10**length - 1)


class Transaction(models.Model):
    class Status(models.TextChoices):
        ISSUE = "issued", "issued"
        RETURN = "returned", "returned"

    id = models.IntegerField(
        primary_key=True,
        default=generate_random_id,
        editable=False,
    )

    issue_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, default=None)
    status = models.CharField(max_length=10, choices=Status.choices)
    fee_charged = models.FloatField(default=0)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    member = models.ForeignKey(Member, on_delete=models.CASCADE)

    def __str__(self):
        if self.status == self.Status.ISSUE:
            prep = "to"
        else:
            prep = "by"
        return f"{self.book.title} {self.status} {prep} {self.member.first_name} {self.member.last_name} "
