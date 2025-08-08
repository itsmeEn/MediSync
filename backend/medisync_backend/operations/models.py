from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import UserProfile, DoctorProfile, NurseProfile, PatientProfile

class Appointment(models.Model):
    APPOINTMENT_TYPE_CHOICES = [
        ('consultation', _('Consultation')),
        ('follow_up', _('Follow-up')),
        ('emergency', _('Emergency')),
        ('routine', _('Routine Check-up')),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', _('Scheduled')),
        ('confirmed', _('Confirmed')),
        ('in_progress', _('In Progress')),
        ('completed', _('Completed')),
        ('cancelled', _('Cancelled')),
    ]

# Appointment Model
    appointment_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='appointments')
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPE_CHOICES)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    reason = models.TextField()
    queue_number = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'appointments'
        ordering = ['appointment_date', 'appointment_time']
    
    def __str__(self):
        return f"Appointment {self.appointment_id} - {self.patient.patient_name} with Dr. {self.doctor.doctor_name}"

# Queue Management Model
class QueueManagement(models.Model):
    QUEUE_TYPE_CHOICES = [
        ('appointment', _('Appointment')),
        ('walk_in', _('Walk-in')),
        ('emergency', _('Emergency')),
    ]
    
    STATUS_CHOICES = [
        ('waiting', _('Waiting')),
        ('in_progress', _('In Progress')),
        ('completed', _('Completed')),
        ('cancelled', _('Cancelled')),
    ]
    
    queue_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='queue_entries')
    queue_type = models.CharField(max_length=20, choices=QUEUE_TYPE_CHOICES)
    queue_date = models.DateField()
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
    patient_serving = models.IntegerField(default=0)
    total_patients = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'queue_management'
        ordering = ['queue_date', 'created_at']
    
    def __str__(self):
        return f"Queue {self.queue_id} - {self.patient.patient_name}"

# Clinic Inventory Model
class ClinicInventory(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    nurse = models.ForeignKey(NurseProfile, on_delete=models.CASCADE, related_name='inventory_items')
    item_name = models.CharField(max_length=100)
    current_stock = models.IntegerField()
    minimum_stock = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField()
    batch_number = models.CharField(max_length=50)
    supplier = models.CharField(max_length=100)
    last_restocked = models.DateTimeField()
    usage_pattern = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'clinic_inventory'
        ordering = ['item_name']
    
    def __str__(self):
        return f"{self.item_name} - Stock: {self.current_stock}"


# Medical Record Model
class MedicalRecord(models.Model):
    record_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='medical_records')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='medical_records')
    record_date = models.DateField()
    diagnosis = models.TextField()
    treatment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'medical_records'
        ordering = ['record_date']
    
    def __str__(self):
        return f"Medical Record {self.record_id} - {self.patient.patient_name}"

# Medical Prescription Model