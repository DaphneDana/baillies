from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token  # built-in login view — returns a token
from .views import RegisterView, MeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', obtain_auth_token, name='login'),  # accepts {username, password}, returns {token}
    path('me/', MeView.as_view(), name='me'),
]
