from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # accepted on input, never returned in response

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_job_seeker', 'is_admin']

    def create(self, validated_data):
        # create_user() hashes the password 
        return User.objects.create_user(**validated_data)
