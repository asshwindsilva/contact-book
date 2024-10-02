from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import User
from django.conf import settings

class OTP(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='otp_set')
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=False)  # Activated after OTP verification
    otp = models.CharField(max_length=6, blank=True, null=True)  # OTP for email verification

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']

    objects = CustomUserManager()  # Using the custom manager

    def save(self, *args, **kwargs):
        if not self.password:
            self.set_unusable_password()  # Mark password as unusable if not provided
        super(CustomUser, self).save(*args, **kwargs)

    def __str__(self):
        return self.email


class Contact(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='contacts')
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)

class Spam(models.Model):
    phone = models.CharField(max_length=15, unique=True)
    marked_spam_by = models.ManyToManyField(CustomUser, related_name='marked_spam')
    spam_count = models.IntegerField(default=0)  # Number of users marking this number as spam

    @property
    def spam_likelihood(self):
        total_users = CustomUser.objects.count()
        return (self.spam_count / total_users) * 100  # Spam likelihood as a percentage

