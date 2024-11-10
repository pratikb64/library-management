import math
from datetime import datetime

import requests
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Book
from .serializers import BookSerializer


@api_view(["GET", "POST"])
def getAndCreateBooks(request):
    try:
        if request.method == "GET":
            books = Book.objects.all()
            total_count = books.count()

            if "title" in request.GET:
                books = books.filter(title__icontains=request.GET["title"])

            if "author" in request.GET:
                books = books.filter(authors__icontains=request.GET["author"])

            limit = min(int(request.GET.get("limit", 20)), 100)
            page = int(request.GET.get("page", 1))
            offset = (page - 1) * limit

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
