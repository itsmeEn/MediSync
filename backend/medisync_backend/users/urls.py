from django.urls import path
from .views import (
    UserLoginSerializer,
    UserRegistrationSerializer,
    UserProfileViewDetail,
    UserProfileUpdateView,
    UserProfileListView,
    UserProfileDetailView,
    VerificationDocumentUploadView, 
)

urlpatterns = [
    path('login/', UserLoginSerializer.as_view(), name='user-login'),
    path('register/', UserRegistrationSerializer.as_view(), name='user-register'),
    path('profile/', UserProfileViewDetail.as_view(), name='user-profile-detail'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='user-profile-update'),
    path('profiles/', UserProfileListView.as_view(), name='user-profile-list'),
    path('profile/<int:user_id>/', UserProfileDetailView.as_view(), name='user-profile-detail-by-id'),
    path('profile/upload-verification/', VerificationDocumentUploadView.as_view(), name='verification-document-upload'),
]
# This file defines the URL patterns for user-related views in the MediSync backend.
# It includes paths for user login, registration, profile detail, profile update,
# listing all user profiles, retrieving a specific user profile by user_id, and uploading
# a verification document for the user.
# Each path is associated with a specific view that handles the request and response logic.
# The views are implemented in the views.py file of the users app.
# The urlpatterns list is used by Django to route incoming requests to the appropriate view based on the URL.
# The name parameter in each path allows for easy reference to the URL in templates and other parts of the application.
# The views use Django's generic class-based views to handle common operations like retrieving, updating, and listing user profiles.
# The VerificationDocumentUploadView allows users to upload documents for verification purposes, which is essential for user authentication and security.
# The UserProfile model is extended from Django's AbstractUser model to include additional fields like role, phone number, date of birth,   