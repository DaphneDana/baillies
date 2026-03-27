from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),  # /api/auth/login/, /api/auth/register/, etc.
    path('api/jobs/', include('jobs.urls')),       # /api/jobs/, /api/jobs/5/, etc.
]
