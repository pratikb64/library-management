import math
from datetime import datetime

import requests
from django.shortcuts import get_object_or_404
from members.models import Member
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer

from .models import Book
from .serializers import BookSerializer


@api_view(["GET", "POST"])
def getAndCreateBooks(request):
    try:
        if request.method == "GET":
            books = Book.objects.all()

            if "title" in request.GET:
                books = books.filter(title__icontains=request.GET["title"])

            if "author" in request.GET:
                books = books.filter(authors__icontains=request.GET["author"])

            limit = min(int(request.GET.get("limit", 20)), 100)
            page = int(request.GET.get("page", 1))
            offset = (page - 1) * limit

            total_count = books.count()

            books = books[offset : offset + limit]

            serializer = BookSerializer(books, many=True)

            return Response(
                {
                    "success": True,
                    "message": "Books fetched successfully",
                    "total_count": total_count,
                    "limit": limit,
                    "page": page,
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        if request.method == "POST":
            serializer = BookSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "success": True,
                        "data": serializer.data,
                        "message": "Book created",
                    },
                    status=status.HTTP_201_CREATED,
                )
            return Response(
                {"success": False, "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Exception as e:
        return Response(
            {"success": False, "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET", "PATCH", "DELETE"])
def getUpdateDeleteBookDetails(request, pk):
    try:
        book = get_object_or_404(Book, pk=pk)

        if request.method == "GET":
            serializer = BookSerializer(book, many=False)
            return Response(
                {"success": True, "data": serializer.data, "message": "Book found"},
                status=status.HTTP_200_OK,
            )

        if request.method == "PATCH":
            serializer = BookSerializer(instance=book, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "success": True,
                        "data": serializer.data,
                        "message": "Book updated",
                    },
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"success": False, "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.method == "DELETE":
            book.delete()
            return Response(
                {"success": True, "message": "Book deleted"},
                status=status.HTTP_200_OK,
            )

    except Exception as e:
        return Response(
            {"success": False, "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def importBooks(request):
    try:
        no_of_books = int(request.data.get("no_of_books", 0))
        title = request.data.get("title", None)

        if no_of_books <= 0:
            return Response(
                {"success": False, "error": "Invalid number of books to import"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        page = 1
        while page != math.ceil(no_of_books / 20) + 1:
            params = {"page": page}
            if title:
                params["title"] = title

            response = requests.get(
                "https://frappe.io/api/method/frappe-library", params=params
            )

            books = response.json().get("message", [])

            if not books:
                break

            Book.objects.bulk_create(
                [
                    Book(
                        id=book.get("bookID"),
                        title=book.get("title"),
                        authors=book.get("authors"),
                        average_rating=book.get("average_rating"),
                        isbn=book.get("isbn"),
                        isbn13=book.get("isbn13"),
                        language_code=book.get("language_code"),
                        num_pages=book.get("  num_pages"),
                        ratings_count=book.get("ratings_count"),
                        text_reviews_count=book.get("text_reviews_count"),
                        rent_fee=5,
                        publication_date=datetime.strptime(
                            book.get("publication_date"), "%m/%d/%Y"
                        ).strftime("%Y-%m-%d"),
                        publisher=book.get("publisher"),
                    )
                    for book in books
                ],
                ignore_conflicts=True,
            )

            page += 1

        return Response(
            {"success": True, "message": "Books imported"},
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        print(e)
        return Response(
            {"success": False, "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def issueBook(request):
    try:
        book = get_object_or_404(Book, pk=request.data.get("book_id"))
        member = get_object_or_404(Member, pk=request.data.get("member_id"))
        transactions = (
            Transaction.objects.filter(member=member, status="issued")
            .select_related("book")
            .only("book__rent_fee", "issue_date", "status")
        )
        total_fee = 0
        if transactions.exists():
            for transaction in transactions:
                issue_date_aware = transaction.issue_date.astimezone()
                fee = (
                    (datetime.now(tz=issue_date_aware.tzinfo) - issue_date_aware).days
                    + 1
                ) * transaction.book.rent_fee
                total_fee += fee

        if total_fee > 500:
            return Response(
                {"success": False, "error": "Total fee exceeds the limit of 500"},
                status=status.HTTP_406_NOT_ACCEPTABLE,
            )

        serializer = TransactionSerializer(
            data={
                "book": book.id,
                "member": member.id,
                "status": "issued",
            }
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "success": True,
                    "data": serializer.data,
                    "message": "Transaction created",
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"success": False, "error": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    except Exception as e:
        return Response(
            {"success": False, "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
