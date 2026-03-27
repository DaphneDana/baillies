from rest_framework import serializers
from .models import Department, Job, Application


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']


class JobSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)       
    department_id = serializers.PrimaryKeyRelatedField(     # accepts just the ID when creating
        queryset=Department.objects.all(), source='department', write_only=True
    )

    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'requirements', 'department', 'department_id', 'is_active', 'closing_date', 'created_at']


class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(), source='job', write_only=True
    )
    applicant = serializers.StringRelatedField(read_only=True)  # returns the user's __str__ (email)

    class Meta:
        model = Application
        fields = ['id', 'applicant', 'job', 'job_id', 'status', 'cover_letter', 'applied_at']
        read_only_fields = ['status', 'applied_at']  # only admins can change status
