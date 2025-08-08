# operations/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, QueueManagementViewSet, ClinicInventoryViewSet

router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet)
router.register(r'queue', QueueManagementViewSet)
router.register(r'inventory', ClinicInventoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
