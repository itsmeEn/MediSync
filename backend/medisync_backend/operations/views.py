# operations/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import models
from .models import Appointment, QueueManagement, ClinicInventory
from .serializers import AppointmentSerializer, QueueManagementSerializer, ClinicInventorySerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Appointment.objects.filter(patient__user=user)
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor__user=user)
        return Appointment.objects.all()
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'confirmed'
        appointment.save()
        return Response({'status': 'appointment confirmed'})
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'cancelled'
        appointment.save()
        return Response({'status': 'appointment cancelled'})
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent appointments for the authenticated user"""
        from django.utils import timezone
        from datetime import timedelta
        
        # Get appointments from the last 7 days
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=7)
        
        user = self.request.user
        if user.role == 'patient':
            appointments = Appointment.objects.filter(
                patient__user=user,
                appointment_date__gte=start_date,
                appointment_date__lte=end_date
            ).order_by('-appointment_date', '-appointment_time')[:10]
        elif user.role == 'doctor':
            appointments = Appointment.objects.filter(
                doctor__user=user,
                appointment_date__gte=start_date,
                appointment_date__lte=end_date
            ).order_by('-appointment_date', '-appointment_time')[:10]
        else:
            appointments = Appointment.objects.filter(
                appointment_date__gte=start_date,
                appointment_date__lte=end_date
            ).order_by('-appointment_date', '-appointment_time')[:10]
        
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's appointments count for the authenticated user"""
        from django.utils import timezone
        
        today = timezone.now().date()
        
        user = self.request.user
        if user.role == 'patient':
            count = Appointment.objects.filter(
                patient__user=user,
                appointment_date=today
            ).count()
        elif user.role == 'doctor':
            count = Appointment.objects.filter(
                doctor__user=user,
                appointment_date=today
            ).count()
        else:
            count = Appointment.objects.filter(
                appointment_date=today
            ).count()
        
        return Response({'count': count})

class QueueManagementViewSet(viewsets.ModelViewSet):
    queryset = QueueManagement.objects.all()
    serializer_class = QueueManagementSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def current_queue(self, request):
        today = timezone.now().date()
        queue = QueueManagement.objects.filter(
            queue_date=today,
            status='waiting'
        ).order_by('created_at')
        serializer = self.get_serializer(queue, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def start_service(self, request, pk=None):
        queue_entry = self.get_object()
        queue_entry.status = 'in_progress'
        queue_entry.started_at = timezone.now()
        queue_entry.save()
        return Response({'status': 'service started'})
    
    @action(detail=True, methods=['post'])
    def complete_service(self, request, pk=None):
        queue_entry = self.get_object()
        queue_entry.status = 'completed'
        queue_entry.ended_at = timezone.now()
        queue_entry.save()
        return Response({'status': 'service completed'})
    
    @action(detail=False, methods=['get'])
    def total(self, request):
        """Get total number of patients in queue"""
        from users.models import PatientProfile
        
        user = self.request.user
        if user.role == 'doctor':
            # Count patients assigned to this doctor
            count = PatientProfile.objects.filter(
                appointments__doctor__user=user
            ).distinct().count()
        else:
            # Count all patients
            count = PatientProfile.objects.count()
        
        return Response({'count': count})

class ClinicInventoryViewSet(viewsets.ModelViewSet):
    queryset = ClinicInventory.objects.all()
    serializer_class = ClinicInventorySerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        low_stock_items = ClinicInventory.objects.filter(
            current_stock__lte=models.F('minimum_stock')
        )
        serializer = self.get_serializer(low_stock_items, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def restock(self, request, pk=None):
        inventory_item = self.get_object()
        quantity = request.data.get('quantity', 0)
        inventory_item.current_stock += int(quantity)
        inventory_item.last_restocked = timezone.now()
        inventory_item.save()
        return Response({'status': 'restocked', 'new_stock': inventory_item.current_stock})