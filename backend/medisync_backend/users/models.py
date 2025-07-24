from django.db import models
from django.contrib.auth.models import AbstractUser
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token
from django.core.exceptions import ValidationError
#create an auth token.
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

#import validators
from .validators import validate_user_document

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
    first_name = models.CharField(max_length=30, blank=True, null=True, verbose_name=_('First Name'))
    last_name = models.CharField(max_length=30, blank=True, null=True, verbose_name=_('Last Name'))
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
    
    
    class Meta:
        verbose_name = _('User Profile')
        verbose_name_plural = _('User Profiles')
        ordering = ['-created_at']
        
    def get_absolute_url(self):
        return reverse('user_profile', kwargs={'username': self.username})

    def __str__(self):
        return self.username
    
@receiver(post_save, sender=UserProfile)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    """
    Create an auth token for the user when a UserProfile instance is created.
    """
    if created:
        Token.objects.create(user=instance)