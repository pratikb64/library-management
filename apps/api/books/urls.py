from django.urls import path

from . import views

urlpatterns = [
    path("", views.getAndCreateBooks, name="getAndCreateBooks"),
    path(
        "/<int:pk>", views.getUpdateDeleteBookDetails, name="getUpdateDeleteBookDetails"
    ),
    path("/import", views.importBooks, name="importBooks"),
]
