from django.db import models
from django.conf import settings


class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Job(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField()
    # ForeignKey = many jobs belong to one department; CASCADE deletes jobs if department is deleted
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='jobs')
    is_active = models.BooleanField(default=True)  # admins can hide a job without deleting it
    closing_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return self.title


class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    cover_letter = models.TextField(blank=True)  # optional
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('applicant', 'job')  # prevents applying to the same job twice

    def __str__(self):
        return f"{self.applicant.email} -> {self.job.title}"
