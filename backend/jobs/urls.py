from django.urls import path
from .views import DepartmentListView, JobListView, JobDetailView, ApplyJobView, MyApplicationsView
from .admin_views import AdminApplicationListView, AdminApplicationUpdateView, AdminJobListView, AdminJobUpdateView, AdminDepartmentListView


urlpatterns = [
    path('departments/', DepartmentListView.as_view(), name='departments'),
    path('', JobListView.as_view(), name='job-list'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('<int:pk>/apply/', ApplyJobView.as_view(), name='job-apply'),
    path('applications/', MyApplicationsView.as_view(), name='my-applications'),

    # Admin-only endpoints
    path('admin/applications/', AdminApplicationListView.as_view(), name='admin-applications'),
    path('admin/applications/<int:pk>/', AdminApplicationUpdateView.as_view(), name='admin-application-update'),
    path('admin/jobs/', AdminJobListView.as_view(), name='admin-jobs'),
    path('admin/jobs/<int:pk>/', AdminJobUpdateView.as_view(), name='admin-job-update'),
    path('admin/departments/', AdminDepartmentListView.as_view(), name='admin-departments'),
]
