from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token
from django.core.exceptions import ValidationError
#create an auth token.
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
import pyrebase
import datetime

#import validators
from .validators import validate_user_document

# Firebase configuration
config = {
    "apiKey": "AIzaSyD6krKiytg0vl99Ltdx5_pDv7AmNLM4WK8",
    "authDomain": "medisync-8d3dc.firebaseapp.com",
    "databaseURL": "https://medisync-8d3dc-default-rtdb.firebaseio.com",
    "projectId": "medisync-8d3dc",
    "storageBucket": "medisync-8d3dc.appspot.com",
    "messagingSenderId": "497187621830",
    "appId": "1:497187621830:web:26accbcc40563e09a5c0c7",
    "measurementId": "G-DJZEVWMJGS"
}

firebase = pyrebase.initialize_app(config)
database = firebase.database()

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
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# UserProfile model to extend the default User model
class UserProfile(AbstractUser):
    """
    Custom user model that extends the default Django User model.
    """
    ROLE_CHOICES = [
        ('admin', _('Admin')),
        ('doctor', _('Doctor')),
        ('patient', _('Patient')),
        ('nurse', _('Nurse')),
    ]
    user_id = models.AutoField(primary_key=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient', verbose_name=_('Role'))
    full_name = models.CharField(max_length=100, default='', verbose_name=_('Full Name'))
    phone_number = models.CharField(max_length=15, blank=True, null=True, verbose_name=_('Phone Number'))
    date_of_birth = models.DateField(blank=True, null=True, verbose_name=_('Date of Birth'))
    gender = models.CharField(max_length=10, blank=True, null=True, verbose_name=_('Gender'))
    address = models.TextField(blank=True, null=True, verbose_name=_('Address'))
    
    #users verification fields
    verification_document = models.FileField(upload_to='verification_documents/', blank=True, null=True, verbose_name=_('Verification Document'))
    verification_status = models.CharField(max_length=20, choices=[('pending', _('Pending')), ('approved', _('Approved')), ('rejected', _('Rejected'))], default='pending', verbose_name=_('Verification Status'))
    is_verified = models.BooleanField(default=False, verbose_name=_('Is Verified'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))
    
    email = models.EmailField(unique=True, verbose_name=_('Email Address'))
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    objects = CustomUserManager()
    
    class Meta:
        verbose_name = _('User Profile')
        verbose_name_plural = _('User Profiles')
        ordering = ['-created_at']
        
    def get_absolute_url(self):
        return reverse('user_profile', kwargs={'username': self.username})

    def __str__(self):
        return self.full_name if self.full_name else self.email
    
    def sync_to_firebase(self):
        """
        Sync user data to Firebase Realtime Database
        """
        try:
            now = datetime.datetime.now(datetime.timezone.utc).isoformat()
            
            # Prepare data for Firebase
            firebase_data = {
                'user_id': self.user_id,
                'email': self.email,
                'full_name': self.full_name,
                'role': self.role,
                'phone_number': self.phone_number or '',
                'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else '',
                'gender': self.gender or '',
                'address': self.address or '',
                'verification_status': self.verification_status,
                'is_verified': self.is_verified,
                'created_at': self.created_at.isoformat() if self.created_at else now,
                'updated_at': now,
            }
            
            # Store in Firebase under 'django_users' to distinguish from Firebase Auth users
            database.child("django_users").child(str(self.user_id)).set(firebase_data)
            
        except Exception as e:
            print(f"Error syncing user {self.user_id} to Firebase: {e}")
    
    def save(self, *args, **kwargs):
        """Override save to sync to Firebase"""
        super().save(*args, **kwargs)
        # Sync to Firebase after saving
        self.sync_to_firebase()

@receiver(post_save, sender=UserProfile)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    """
    Create an auth token for the user when a UserProfile instance is created.
    """
    if created:
        Token.objects.create(user=instance)

# Add these models after your existing UserProfile model

class DoctorProfile(models.Model):
    """
    Extended profile for doctors with medical-specific information.
    """
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='doctor_profile')
    doctor_name = models.CharField(max_length=100, verbose_name=_('Doctor Name'))
    specialization = models.CharField(max_length=100, verbose_name=_('Specialization'))
    license_number = models.CharField(max_length=50, unique=True, verbose_name=_('License Number'))
    availability = models.JSONField(default=dict, verbose_name=_('Availability'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Doctor Profile')
        verbose_name_plural = _('Doctor Profiles')
        db_table = 'doctor_profiles'
    
    def __str__(self):
        return f"Dr. {self.doctor_name}"

class NurseProfile(models.Model):
    """
    Extended profile for nurses with medical-specific information.
    """
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='nurse_profile')
    specialization = models.CharField(max_length=100, verbose_name=_('Specialization'))
    license_number = models.CharField(max_length=50, unique=True, verbose_name=_('License Number'))
    availability = models.JSONField(default=dict, verbose_name=_('Availability'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Nurse Profile')
        verbose_name_plural = _('Nurse Profiles')
        db_table = 'nurse_profiles'
    
    def __str__(self):
        return f"Nurse {self.nurse_name}"

class PatientProfile(models.Model):
    """
    Extended profile for patients with medical-specific information.
    """
    PATIENT_TYPE_CHOICES = [
        ('outpatient', _('Outpatient')),
        ('inpatient', _('Inpatient')),
        ('emergency', _('Emergency')),
    ]
    
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='patient_profile')
    patient_name = models.CharField(max_length=100, verbose_name=_('Patient Name'))
    type = models.CharField(max_length=20, choices=PATIENT_TYPE_CHOICES, default='outpatient', verbose_name=_('Patient Type'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Patient Profile')
        verbose_name_plural = _('Patient Profiles')
        db_table = 'patient_profiles'
    
    def __str__(self):
        return f"Patient {self.patient_name}"