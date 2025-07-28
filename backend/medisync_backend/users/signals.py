from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from rest_framework.authtoken.models import Token       
from .models import UserProfile

@receiver(post_save, sender=UserProfile)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    """
    Create an auth token for the user when a UserProfile instance is created.
    """
    if created:
        Token.objects.create(user=instance)