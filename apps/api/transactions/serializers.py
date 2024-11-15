from books.models import Book
from books.serializers import BookSerializer
from members.models import Member
from members.serializers import MemberSerializer
from rest_framework import serializers

from transactions.models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())
    member = serializers.PrimaryKeyRelatedField(queryset=Member.objects.all())

    class Meta:
        model = Transaction
        fields = "__all__"
        read_only_fields = ["id"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation["book"] = BookSerializer(instance.book).data
        representation["member"] = MemberSerializer(instance.member).data

        return representation
