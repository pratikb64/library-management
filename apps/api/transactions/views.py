from datetime import datetime

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Transaction
from .serializers import TransactionSerializer


@api_view(["GET"])
def getAndCreateTransactions(request):
    try:
        transactions = Transaction.objects.select_related("book", "member").all()

        if "member_first_name" in request.GET:
            transactions = transactions.filter(
                member__first_name__icontains=request.GET["member_first_name"]
            )

        if "member_last_name" in request.GET:
            transactions = transactions.filter(
                member__last_name__icontains=request.GET["member_last_name"]
            )

        if "member_id" in request.GET:
            transactions = transactions.filter(member__id=request.GET["member_id"])

        if "book_title" in request.GET:
            transactions = transactions.filter(
                book__title__icontains=request.GET["book_title"]
            )

        if "book_id" in request.GET:
            transactions = transactions.filter(book__id=request.GET["book_id"])

        if "status" in request.GET:
            transactions = transactions.filter(status=request.GET["status"])

        limit = min(int(request.GET.get("limit", 20)), 100)
        page = int(request.GET.get("page", 1))
        offset = (page - 1) * limit

        total_count = transactions.count()

        transactions = transactions[offset : offset + limit]

        serializer = TransactionSerializer(transactions, many=True)

        return Response(
            {
                "success": True,
                "message": "Transactions fetched successfully",
                "total_count": total_count,
                "limit": limit,
                "page": page,
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response(
            {"success": False, "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET", "PATCH", "DELETE"])
def getUpdateDeleteTransactionDetails(request, pk):
    try:
        transaction = get_object_or_404(Transaction, pk=pk)

        if request.method == "GET":
            serializer = TransactionSerializer(transaction, many=False)
            return Response(
                {
                    "success": True,
                    "data": serializer.data,
                    "message": "Transaction found",
                },
                status=status.HTTP_200_OK,
            )

        if request.method == "PATCH":
            data = request.data
            # need this extra step as default django date is not compatible with js date
            data["issue_date"] = datetime.strptime(
                request.data.get("issue_date"), "%m/%d/%Y"
            )
            serializer = TransactionSerializer(
                instance=transaction, data=data, partial=True
            )
            if serializer.is_valid():
                serializer.save(**data)
                return Response(
                    {
                        "success": True,
                        "data": serializer.data,
                        "message": "Transaction updated",
                    },
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"success": False, "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.method == "DELETE":
            transaction.delete()
            return Response(
                {"success": True, "message": "Transaction deleted"},
                status=status.HTTP_200_OK,
            )

    except Exception as e:
        return Response(
            {"success": False, "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
