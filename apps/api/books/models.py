import random

from django.db import models


def generate_random_id(length=8):
    return random.randint(10 ** (length - 1), 10**length - 1)


class Book(models.Model):
    id = models.IntegerField(
        primary_key=True,
        default=generate_random_id,
        editable=False,
    )
    title = models.CharField(max_length=1000)
    authors = models.CharField(max_length=1000)
    average_rating = models.FloatField()
    isbn = models.CharField(max_length=20)
    isbn13 = models.CharField(max_length=20)
    language_code = models.CharField(max_length=10)
    num_pages = models.IntegerField()
    ratings_count = models.IntegerField()
    text_reviews_count = models.IntegerField()
    rent_fee = models.FloatField()
    publication_date = models.CharField(max_length=100)
    publisher = models.CharField(max_length=1000)

    def __str__(self):
        return self.title
