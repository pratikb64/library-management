from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/books", include("books.urls")),
    path("api/members", include("members.urls")),
    path("api/transactions", include("transactions.urls")),
    path("api/stats", include("stats.urls")),
]
