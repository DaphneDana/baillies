from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Department, Job, Application
from .serializers import DepartmentSerializer, JobSerializer, ApplicationSerializer


class DepartmentListView(APIView):
    permission_classes = [AllowAny]  

    def get(self, request):
        departments = Department.objects.all()
        return Response(DepartmentSerializer(departments, many=True).data)


class JobListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = Job.objects.filter(is_active=True)  # only show active jobs to regular users
        return Response(JobSerializer(jobs, many=True).data)


class JobDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            job = Job.objects.get(pk=pk, is_active=True)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(JobSerializer(job).data)


class ApplyJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            job = Job.objects.get(pk=pk, is_active=True)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        # Prevent duplicate applications
        if Application.objects.filter(applicant=request.user, job=job).exists():
            return Response({'error': 'You have already applied for this job'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ApplicationSerializer(data={**request.data, 'job_id': pk})
        if serializer.is_valid():
            serializer.save(applicant=request.user)  # set the logged-in user as applicant
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Each user only sees their own applications
        applications = Application.objects.filter(applicant=request.user)
        return Response(ApplicationSerializer(applications, many=True).data)
