from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import FileExtensionValidator
from users.models import UserProfile, DoctorProfile, NurseProfile, PatientProfile


class MedicalRecordRequest(models.Model):
    """
    Model for patients to request their medical records from doctors.
    """
    REQUEST_TYPE_CHOICES = [
        ('complete_record', _('Complete Medical Record')),
        ('lab_results', _('Laboratory Results')),
        ('prescriptions', _('Prescriptions')),
        ('diagnosis', _('Diagnosis Reports')),
        ('treatment_plan', _('Treatment Plans')),
        ('vaccination_record', _('Vaccination Records')),
        ('other', _('Other')),
    ]
    
    STATUS_CHOICES = [
        ('pending', _('Pending')),
        ('approved', _('Approved')),
        ('rejected', _('Rejected')),
        ('processing', _('Processing')),
        ('completed', _('Completed')),
        ('cancelled', _('Cancelled')),
    ]
    
    request_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='medical_record_requests')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='received_record_requests')
    request_type = models.CharField(max_length=30, choices=REQUEST_TYPE_CHOICES, verbose_name=_('Request Type'))
    specific_records = models.TextField(blank=True, null=True, verbose_name=_('Specific Records Requested'))
    reason_for_request = models.TextField(verbose_name=_('Reason for Request'))
    urgency_level = models.CharField(
        max_length=20, 
        choices=[
            ('low', _('Low')),
            ('medium', _('Medium')),
            ('high', _('High')),
            ('urgent', _('Urgent')),
        ],
        default='medium',
        verbose_name=_('Urgency Level')
    )
    preferred_delivery_method = models.CharField(
        max_length=20,
        choices=[
            ('email', _('Email')),
            ('portal', _('Patient Portal')),
            ('physical_copy', _('Physical Copy')),
            ('fax', _('Fax')),
        ],
        default='portal',
        verbose_name=_('Preferred Delivery Method')
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True, verbose_name=_('Administrative Notes'))
    doctor_notes = models.TextField(blank=True, null=True, verbose_name=_('Doctor Notes'))
    requested_date = models.DateTimeField(auto_now_add=True)
    processed_date = models.DateTimeField(null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medical_record_requests'
        ordering = ['-requested_date']
        verbose_name = _('Medical Record Request')
        verbose_name_plural = _('Medical Record Requests')
    
    def __str__(self):
        return f"Record Request {self.request_id} - {self.patient.patient_name} to Dr. {self.doctor.doctor_name}"


class Communication(models.Model):
    """
    Model for general communication threads between healthcare providers and patients.
    """
    COMMUNICATION_TYPE_CHOICES = [
        ('patient_doctor', _('Patient-Doctor')),
        ('patient_nurse', _('Patient-Nurse')),
        ('doctor_nurse', _('Doctor-Nurse')),
        ('doctor_doctor', _('Doctor-Doctor')),
        ('nurse_nurse', _('Nurse-Nurse')),
        ('general', _('General')),
    ]
    
    STATUS_CHOICES = [
        ('active', _('Active')),
        ('resolved', _('Resolved')),
        ('closed', _('Closed')),
        ('archived', _('Archived')),
    ]
    
    communication_id = models.AutoField(primary_key=True)
    communication_type = models.CharField(max_length=20, choices=COMMUNICATION_TYPE_CHOICES, verbose_name=_('Communication Type'))
    subject = models.CharField(max_length=200, verbose_name=_('Subject'))
    description = models.TextField(blank=True, null=True, verbose_name=_('Description'))
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Participants
    initiator = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='initiated_communications')
    participants = models.ManyToManyField(UserProfile, through='CommunicationParticipant', related_name='participated_communications')
    
    # Related entities
    related_appointment = models.ForeignKey('operations.Appointment', on_delete=models.SET_NULL, null=True, blank=True, related_name='communications')
    related_record_request = models.ForeignKey(MedicalRecordRequest, on_delete=models.SET_NULL, null=True, blank=True, related_name='communications')
    
    priority = models.CharField(
        max_length=20,
        choices=[
            ('low', _('Low')),
            ('normal', _('Normal')),
            ('high', _('High')),
            ('urgent', _('Urgent')),
        ],
        default='normal',
        verbose_name=_('Priority')
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'communications'
        ordering = ['-updated_at']
        verbose_name = _('Communication')
        verbose_name_plural = _('Communications')
    
    def __str__(self):
        return f"Communication {self.communication_id} - {self.subject}"


class CommunicationParticipant(models.Model):
    """
    Through model for managing participants in communications.
    """
    ROLE_CHOICES = [
        ('initiator', _('Initiator')),
        ('participant', _('Participant')),
        ('cc', _('CC')),
        ('bcc', _('BCC')),
    ]
    
    communication = models.ForeignKey(Communication, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='participant')
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'communication_participants'
        unique_together = ['communication', 'user']
    
    def __str__(self):
        return f"{self.user.username} in {self.communication.subject}"


class Message(models.Model):
    """
    Model for individual messages within communications.
    """
    MESSAGE_TYPE_CHOICES = [
        ('text', _('Text')),
        ('file', _('File')),
        ('image', _('Image')),
        ('voice', _('Voice')),
        ('video', _('Video')),
        ('system', _('System Message')),
    ]
    
    message_id = models.AutoField(primary_key=True)
    communication = models.ForeignKey(Communication, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_messages')
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPE_CHOICES, default='text')
    content = models.TextField(verbose_name=_('Message Content'))
    
    # File attachment
    attachment = models.FileField(
        upload_to='communication_attachments/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'mp3', 'mp4', 'txt'])]
    )
    attachment_name = models.CharField(max_length=255, blank=True, null=True)
    attachment_size = models.IntegerField(blank=True, null=True)  # Size in bytes
    
    # Message status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    is_edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(null=True, blank=True)
    
    # Reply functionality
    reply_to = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='replies')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'messages'
        ordering = ['created_at']
        verbose_name = _('Message')
        verbose_name_plural = _('Messages')
    
    def __str__(self):
        return f"Message {self.message_id} from {self.sender.username}"


class MessageRecipient(models.Model):
    """
    Model to track message recipients and their read status.
    """
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='recipients')
    recipient = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_messages')
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'message_recipients'
        unique_together = ['message', 'recipient']
    
    def __str__(self):
        return f"{self.recipient.username} - {self.message.content[:50]}"


class Notification(models.Model):
    """
    Model for system notifications related to communications and medical record requests.
    """
    NOTIFICATION_TYPE_CHOICES = [
        ('record_request', _('Medical Record Request')),
        ('message', _('New Message')),
        ('communication', _('New Communication')),
        ('status_update', _('Status Update')),
        ('reminder', _('Reminder')),
        ('system', _('System Notification')),
    ]
    
    PRIORITY_CHOICES = [
        ('low', _('Low')),
        ('normal', _('Normal')),
        ('high', _('High')),
        ('urgent', _('Urgent')),
    ]
    
    notification_id = models.AutoField(primary_key=True)
    recipient = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    
    # Related objects
    related_communication = models.ForeignKey(Communication, on_delete=models.CASCADE, null=True, blank=True)
    related_message = models.ForeignKey(Message, on_delete=models.CASCADE, null=True, blank=True)
    related_record_request = models.ForeignKey(MedicalRecordRequest, on_delete=models.CASCADE, null=True, blank=True)
    
    # Notification status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        verbose_name = _('Notification')
        verbose_name_plural = _('Notifications')
    
    def __str__(self):
        return f"Notification {self.notification_id} - {self.title}"

