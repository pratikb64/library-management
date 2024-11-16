from datetime import datetime, timedelta

from books.models import Book
from django.db.models import Sum
from members.models import Member
from rest_framework.decorators import api_view
from rest_framework.response import Response
from transactions.models import Transaction


@api_view(["GET"])
def getStats(request):
    books_count = Book.objects.count()
    members_count = Member.objects.count()
    issued_books_count = Transaction.objects.filter(status="issued").count()
    recent_transactions = Transaction.objects.select_related("book", "member").order_by(
        "-issue_date"
    )[:8]
    thirty_days_ago = datetime.now() - timedelta(days=30)

    recent_transactions_data = [
        {
            "id": transaction.id,
            "book": transaction.book.title,
            "member": {
                "name": transaction.member.first_name
                + " "
                + transaction.member.last_name,
                "email": transaction.member.email,
            },
            "status": transaction.status,
        }
        for transaction in recent_transactions
    ]

    fee_collected_last_30_days = Transaction.objects.filter(
        return_date__gte=thirty_days_ago
    ).aggregate(fee_collected=Sum("fee_charged"))["fee_collected"]

    recently_joined_members = Member.objects.filter(
        joining_date__gte=thirty_days_ago
    ).order_by("-joining_date")[:8]

    recently_joined_members_data = [
        {
            "id": member.id,
            "first_name": member.first_name,
            "last_name": member.last_name,
            "email": member.email,
            "joining_date": member.joining_date,
        }
        for member in recently_joined_members
    ]

    data = {
        "books_count": books_count,
        "members_count": members_count,
        "issued_books_count": issued_books_count,
        "fee_collected_last_30_days": fee_collected_last_30_days,
        "recently_joined_members": recently_joined_members_data,
        "recent_transactions": recent_transactions_data,
    }
    return Response(
        {"success": True, "message": "Stats fetched successfully", "data": data}
    )
