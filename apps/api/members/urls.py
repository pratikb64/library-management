from django.urls import path

from . import views

urlpatterns = [
    path("", views.getAndCreateMembers, name="getAndCreateMembers"),
    path(
        "/<int:pk>",
        views.getUpdateDeleteMemberDetails,
        name="getUpdateDeleteMemberDetails",
    ),
]
