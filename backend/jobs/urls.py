from django.urls import path
from .views import DepartmentListView, JobListView, JobDetailView, ApplyJobView, MyApplicationsView

urlpatterns = [
    path('departments/', DepartmentListView.as_view(), name='departments'),
    path('', JobListView.as_view(), name='job-list'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('<int:pk>/apply/', ApplyJobView.as_view(), name='job-apply'),
    path('applications/', MyApplicationsView.as_view(), name='my-applications'),
]
