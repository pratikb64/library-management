from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Member
from .serializers import MemberSerializer


@api_view(["GET", "POST"])
def getAndCreateMembers(request):
    try:
        if request.method == "GET":
            members = Member.objects.all()

            if "first_name" in request.GET:
                members = members.filter(
                    first_name__icontains=request.GET["first_name"]
                )

            if "last_name" in request.GET:
                members = members.filter(last_name__icontains=request.GET["last_name"])

            if "email" in request.GET:
                members = members.filter(email__icontains=request.GET["email"])

            limit = min(int(request.GET.get("limit", 20)), 100)
            page = int(request.GET.get("page", 1))
            offset = (page - 1) * limit

            total_count = members.count()

            members = members[offset : offset + limit]

            serializer = MemberSerializer(members, many=True)

            return Response(
                {
                    "success": True,
                    "message": "Members fetched successfully",
                    "total_count": total_count,
                    "limit": limit,
                    "page": page,
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        if request.method == "POST":
            serializer = MemberSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "success": True,
                        "data": serializer.data,
                        "message": "Member created",
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
def getUpdateDeleteMemberDetails(request, pk):
    try:
        member = get_object_or_404(Member, pk=pk)

        if request.method == "GET":
            serializer = MemberSerializer(member, many=False)
            return Response(
                {"success": True, "data": serializer.data, "message": "Member found"},
                status=status.HTTP_200_OK,
            )

        if request.method == "PATCH":
            serializer = MemberSerializer(
                instance=member, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "success": True,
                        "data": serializer.data,
                        "message": "Member updated",
                    },
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"success": False, "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.method == "DELETE":
            member.delete()
            return Response(
                {"success": True, "message": "Member deleted"},
                status=status.HTTP_200_OK,
            )

    except Exception as e:
        return Response(
            {"success": False, "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
