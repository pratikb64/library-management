from django.urls import path

from . import views

urlpatterns = [
    path("", views.getAndCreateTransactions, name="getAndCreateTransactions"),
    path(
        "/<int:pk>",
        views.getUpdateDeleteTransactionDetails,
        name="getUpdateTransactionDetails",
    ),
]
