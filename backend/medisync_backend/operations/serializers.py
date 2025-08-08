# operations/serializers.py
from rest_framework import serializers
from .models import Appointment, QueueManagement, ClinicInventory

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.patient_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.doctor_name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('appointment_id', 'created_at', 'updated_at')

class QueueManagementSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.patient_name', read_only=True)
    
    class Meta:
        model = QueueManagement
        fields = '__all__'
        read_only_fields = ('queue_id', 'created_at', 'updated_at')

class ClinicInventorySerializer(serializers.ModelSerializer):
    nurse_name = serializers.CharField(source='nurse.nurse_name', read_only=True)
    
    class Meta:
        model = ClinicInventory
        fields = '__all__'
        read_only_fields = ('inventory_id', 'created_at', 'updated_at')
