from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.permissions import IsAdminUser
from .models import Application, Job, Department
from .serializers import ApplicationSerializer, JobSerializer, DepartmentSerializer


class AdminApplicationListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        applications = Application.objects.all().order_by('-applied_at')  # newest first
        return Response(ApplicationSerializer(applications, many=True).data)


class AdminApplicationUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['pending', 'reviewed', 'accepted', 'rejected']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        application.status = new_status
        application.save()
        return Response(ApplicationSerializer(application).data)


class AdminJobListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        jobs = Job.objects.all().order_by('-created_at')  # admins see all jobs including inactive
        return Response(JobSerializer(jobs, many=True).data)

    def post(self, request):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminJobUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        # partial=True allows updating only the fields sent (e.g. just is_active)
        serializer = JobSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminDepartmentListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        departments = Department.objects.all()
        return Response(DepartmentSerializer(departments, many=True).data)

    def post(self, request):
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
