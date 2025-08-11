from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MedicalRecordRequestViewSet,
    CommunicationViewSet,
    MessageViewSet,
    NotificationViewSet,
    CommunicationParticipantViewSet,
    MessageRecipientViewSet
)

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'medical-record-requests', MedicalRecordRequestViewSet, basename='medical-record-request')
router.register(r'communications', CommunicationViewSet, basename='communication')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'communication-participants', CommunicationParticipantViewSet, basename='communication-participant')
router.register(r'message-recipients', MessageRecipientViewSet, basename='message-recipient')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
] 