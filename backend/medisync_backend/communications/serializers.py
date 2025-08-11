from rest_framework import serializers
from .models import (
    MedicalRecordRequest, 
    Communication, 
    CommunicationParticipant, 
    Message, 
    MessageRecipient, 
    Notification
)
from users.models import UserProfile, DoctorProfile, NurseProfile, PatientProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model."""
    class Meta:
        model = UserProfile
        fields = ['user_id', 'username', 'email', 'full_name', 'role']


class DoctorProfileSerializer(serializers.ModelSerializer):
    """Serializer for DoctorProfile model."""
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = DoctorProfile
        fields = ['id', 'user', 'doctor_name', 'specialization', 'license_number']


class PatientProfileSerializer(serializers.ModelSerializer):
    """Serializer for PatientProfile model."""
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = PatientProfile
        fields = ['id', 'user', 'patient_name', 'type']


class MedicalRecordRequestSerializer(serializers.ModelSerializer):
    """Serializer for MedicalRecordRequest model."""
    patient = PatientProfileSerializer(read_only=True)
    doctor = DoctorProfileSerializer(read_only=True)
    patient_id = serializers.IntegerField(write_only=True)
    doctor_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = MedicalRecordRequest
        fields = [
            'request_id', 'patient', 'doctor', 'patient_id', 'doctor_id',
            'request_type', 'specific_records', 'reason_for_request',
            'urgency_level', 'preferred_delivery_method', 'status',
            'admin_notes', 'doctor_notes', 'requested_date', 'processed_date',
            'completed_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['request_id', 'requested_date', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        patient_id = validated_data.pop('patient_id')
        doctor_id = validated_data.pop('doctor_id')
        
        try:
            patient = PatientProfile.objects.get(id=patient_id)
            doctor = DoctorProfile.objects.get(id=doctor_id)
        except (PatientProfile.DoesNotExist, DoctorProfile.DoesNotExist):
            raise serializers.ValidationError("Invalid patient or doctor ID")
        
        validated_data['patient'] = patient
        validated_data['doctor'] = doctor
        
        return super().create(validated_data)


class CommunicationParticipantSerializer(serializers.ModelSerializer):
    """Serializer for CommunicationParticipant model."""
    user = UserProfileSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = CommunicationParticipant
        fields = ['id', 'communication', 'user', 'user_id', 'role', 'joined_at', 'left_at', 'is_active']
        read_only_fields = ['joined_at']


class CommunicationSerializer(serializers.ModelSerializer):
    """Serializer for Communication model."""
    initiator = UserProfileSerializer(read_only=True)
    participants = UserProfileSerializer(many=True, read_only=True)
    participant_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Communication
        fields = [
            'communication_id', 'communication_type', 'subject', 'description',
            'status', 'initiator', 'participants', 'participant_ids',
            'related_appointment', 'related_record_request', 'priority',
            'created_at', 'updated_at', 'resolved_at'
        ]
        read_only_fields = ['communication_id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        participant_ids = validated_data.pop('participant_ids', [])
        communication = super().create(validated_data)
        
        # Add participants
        for user_id in participant_ids:
            try:
                user = UserProfile.objects.get(user_id=user_id)
                CommunicationParticipant.objects.create(
                    communication=communication,
                    user=user,
                    role='participant'
                )
            except UserProfile.DoesNotExist:
                continue
        
        return communication


class MessageRecipientSerializer(serializers.ModelSerializer):
    """Serializer for MessageRecipient model."""
    recipient = UserProfileSerializer(read_only=True)
    recipient_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = MessageRecipient
        fields = ['id', 'message', 'recipient', 'recipient_id', 'is_read', 'read_at', 'delivered_at']
        read_only_fields = ['delivered_at']


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Message model."""
    sender = UserProfileSerializer(read_only=True)
    recipients = MessageRecipientSerializer(many=True, read_only=True)
    recipient_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    reply_to_content = serializers.CharField(read_only=True, source='reply_to.content')
    
    class Meta:
        model = Message
        fields = [
            'message_id', 'communication', 'sender', 'message_type', 'content',
            'attachment', 'attachment_name', 'attachment_size', 'recipients',
            'recipient_ids', 'is_read', 'read_at', 'is_edited', 'edited_at',
            'reply_to', 'reply_to_content', 'created_at', 'updated_at'
        ]
        read_only_fields = ['message_id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        recipient_ids = validated_data.pop('recipient_ids', [])
        message = super().create(validated_data)
        
        # Create message recipients
        for user_id in recipient_ids:
            try:
                user = UserProfile.objects.get(user_id=user_id)
                MessageRecipient.objects.create(
                    message=message,
                    recipient=user
                )
            except UserProfile.DoesNotExist:
                continue
        
        return message


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model."""
    recipient = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'notification_id', 'recipient', 'notification_type', 'title',
            'message', 'priority', 'related_communication', 'related_message',
            'related_record_request', 'is_read', 'read_at', 'is_sent',
            'sent_at', 'created_at'
        ]
        read_only_fields = ['notification_id', 'created_at']


# Nested serializers for detailed views
class CommunicationDetailSerializer(CommunicationSerializer):
    """Detailed serializer for Communication with messages."""
    messages = MessageSerializer(many=True, read_only=True)
    participants_detail = CommunicationParticipantSerializer(many=True, read_only=True, source='communicationparticipant_set')
    
    class Meta(CommunicationSerializer.Meta):
        fields = CommunicationSerializer.Meta.fields + ['messages', 'participants_detail']


class MessageDetailSerializer(MessageSerializer):
    """Detailed serializer for Message with recipients."""
    recipients_detail = MessageRecipientSerializer(many=True, read_only=True)
    
    class Meta(MessageSerializer.Meta):
        fields = MessageSerializer.Meta.fields + ['recipients_detail']


# Summary serializers for list views
class MedicalRecordRequestSummarySerializer(serializers.ModelSerializer):
    """Summary serializer for MedicalRecordRequest list view."""
    patient_name = serializers.CharField(source='patient.patient_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.doctor_name', read_only=True)
    
    class Meta:
        model = MedicalRecordRequest
        fields = [
            'request_id', 'patient_name', 'doctor_name', 'request_type',
            'status', 'urgency_level', 'requested_date'
        ]


class CommunicationSummarySerializer(serializers.ModelSerializer):
    """Summary serializer for Communication list view."""
    initiator_name = serializers.CharField(source='initiator.full_name', read_only=True)
    participant_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = Communication
        fields = [
            'communication_id', 'subject', 'communication_type', 'initiator_name',
            'status', 'priority', 'participant_count', 'last_message', 'updated_at'
        ]
    
    def get_participant_count(self, obj):
        return obj.participants.count()
    
    def get_last_message(self, obj):
        last_message = obj.messages.last()
        if last_message:
            return {
                'content': last_message.content[:100] + '...' if len(last_message.content) > 100 else last_message.content,
                'sender': last_message.sender.full_name,
                'created_at': last_message.created_at
            }
        return None


class MessageSummarySerializer(serializers.ModelSerializer):
    """Summary serializer for Message list view."""
    sender_name = serializers.CharField(source='sender.full_name', read_only=True)
    communication_subject = serializers.CharField(source='communication.subject', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'message_id', 'sender_name', 'communication_subject', 'message_type',
            'content', 'is_read', 'created_at'
        ] 