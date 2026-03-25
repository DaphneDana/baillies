from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_job_seeker = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.email
