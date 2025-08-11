from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from .models import (
    MedicalRecordRequest, 
    Communication, 
    CommunicationParticipant, 
    Message, 
    MessageRecipient, 
    Notification
)
from .serializers import (
    MedicalRecordRequestSerializer,
    MedicalRecordRequestSummarySerializer,
    CommunicationSerializer,
    CommunicationDetailSerializer,
    CommunicationSummarySerializer,
    CommunicationParticipantSerializer,
    MessageSerializer,
    MessageDetailSerializer,
    MessageSummarySerializer,
    MessageRecipientSerializer,
    NotificationSerializer
)
from users.models import UserProfile, DoctorProfile, NurseProfile, PatientProfile


class IsOwnerOrStaff(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or staff to access it.
    """
    def has_object_permission(self, request, view, obj):
        # Staff can access everything
        if request.user.is_staff:
            return True
        
        # Check if user is the owner or participant
        if hasattr(obj, 'patient') and hasattr(obj, 'doctor'):
            # For MedicalRecordRequest
            return (obj.patient.user == request.user or 
                   obj.doctor.user == request.user)
        elif hasattr(obj, 'initiator'):
            # For Communication
            return (obj.initiator == request.user or 
                   obj.participants.filter(user_id=request.user.user_id).exists())
        elif hasattr(obj, 'sender'):
            # For Message
            return (obj.sender == request.user or 
                   obj.recipients.filter(recipient=request.user).exists())
        elif hasattr(obj, 'recipient'):
            # For Notification
            return obj.recipient == request.user
        
        return False


class MedicalRecordRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing medical record requests.
    """
    queryset = MedicalRecordRequest.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return MedicalRecordRequestSummarySerializer
        return MedicalRecordRequestSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return MedicalRecordRequest.objects.all()
        
        # Filter based on user role
        if user.role == 'patient':
            return MedicalRecordRequest.objects.filter(patient__user=user)
        elif user.role == 'doctor':
            return MedicalRecordRequest.objects.filter(doctor__user=user)
        elif user.role == 'nurse':
            # Nurses can see requests for doctors they work with
            return MedicalRecordRequest.objects.filter(doctor__user__role='doctor')
        
        return MedicalRecordRequest.objects.none()
    
    def perform_create(self, serializer):
        serializer.save()
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a medical record request."""
        record_request = self.get_object()
        record_request.status = 'approved'
        record_request.processed_date = timezone.now()
        record_request.save()
        
        # Create notification
        Notification.objects.create(
            recipient=record_request.patient.user,
            notification_type='record_request',
            title='Medical Record Request Approved',
            message=f'Your request for {record_request.get_request_type_display()} has been approved.',
            related_record_request=record_request,
            priority='normal'
        )
        
        return Response({'status': 'approved'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a medical record request."""
        record_request = self.get_object()
        record_request.status = 'rejected'
        record_request.processed_date = timezone.now()
        record_request.save()
        
        # Create notification
        Notification.objects.create(
            recipient=record_request.patient.user,
            notification_type='record_request',
            title='Medical Record Request Rejected',
            message=f'Your request for {record_request.get_request_type_display()} has been rejected.',
            related_record_request=record_request,
            priority='normal'
        )
        
        return Response({'status': 'rejected'})
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark a medical record request as completed."""
        record_request = self.get_object()
        record_request.status = 'completed'
        record_request.completed_date = timezone.now()
        record_request.save()
        
        # Create notification
        Notification.objects.create(
            recipient=record_request.patient.user,
            notification_type='record_request',
            title='Medical Records Ready',
            message=f'Your {record_request.get_request_type_display()} is ready for download.',
            related_record_request=record_request,
            priority='high'
        )
        
        return Response({'status': 'completed'})


class CommunicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing communications.
    """
    queryset = Communication.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CommunicationDetailSerializer
        elif self.action == 'list':
            return CommunicationSummarySerializer
        return CommunicationSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Communication.objects.all()
        
        # Filter communications where user is initiator or participant
        return Communication.objects.filter(
            Q(initiator=user) | Q(participants=user)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(initiator=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_participant(self, request, pk=None):
        """Add a participant to a communication."""
        communication = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = UserProfile.objects.get(user_id=user_id)
            CommunicationParticipant.objects.get_or_create(
                communication=communication,
                user=user,
                defaults={'role': 'participant'}
            )
            return Response({'status': 'participant added'})
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def remove_participant(self, request, pk=None):
        """Remove a participant from a communication."""
        communication = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            participant = CommunicationParticipant.objects.get(
                communication=communication,
                user_id=user_id
            )
            participant.is_active = False
            participant.left_at = timezone.now()
            participant.save()
            return Response({'status': 'participant removed'})
        except CommunicationParticipant.DoesNotExist:
            return Response(
                {'error': 'Participant not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolve a communication."""
        communication = self.get_object()
        communication.status = 'resolved'
        communication.resolved_at = timezone.now()
        communication.save()
        
        # Notify all participants
        for participant in communication.participants.all():
            Notification.objects.create(
                recipient=participant,
                notification_type='communication',
                title='Communication Resolved',
                message=f'The communication "{communication.subject}" has been resolved.',
                related_communication=communication,
                priority='normal'
            )
        
        return Response({'status': 'resolved'})


class MessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing messages.
    """
    queryset = Message.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MessageDetailSerializer
        elif self.action == 'list':
            return MessageSummarySerializer
        return MessageSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Message.objects.all()
        
        # Filter messages where user is sender or recipient
        return Message.objects.filter(
            Q(sender=user) | Q(recipients__recipient=user)
        ).distinct()
    
    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)
        
        # Create notifications for recipients
        for recipient in message.recipients.all():
            Notification.objects.create(
                recipient=recipient.recipient,
                notification_type='message',
                title='New Message',
                message=f'You have a new message in "{message.communication.subject}"',
                related_message=message,
                priority='normal'
            )
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a message as read."""
        message = self.get_object()
        user = request.user
        
        # Mark message as read for the user
        message.is_read = True
        message.read_at = timezone.now()
        message.save()
        
        # Update message recipient status
        try:
            recipient = MessageRecipient.objects.get(
                message=message,
                recipient=user
            )
            recipient.is_read = True
            recipient.read_at = timezone.now()
            recipient.save()
        except MessageRecipient.DoesNotExist:
            pass
        
        return Response({'status': 'marked as read'})
    
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """Reply to a message."""
        original_message = self.get_object()
        content = request.data.get('content')
        
        if not content:
            return Response(
                {'error': 'Content is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create reply message
        reply_message = Message.objects.create(
            communication=original_message.communication,
            sender=request.user,
            content=content,
            reply_to=original_message
        )
        
        # Add recipients (same as original message)
        for recipient in original_message.recipients.all():
            MessageRecipient.objects.create(
                message=reply_message,
                recipient=recipient.recipient
            )
        
        # Create notifications
        for recipient in reply_message.recipients.all():
            Notification.objects.create(
                recipient=recipient.recipient,
                notification_type='message',
                title='Reply to Message',
                message=f'You have a reply to your message in "{reply_message.communication.subject}"',
                related_message=reply_message,
                priority='normal'
            )
        
        return Response(MessageSerializer(reply_message).data)
    
    @action(detail=False, methods=['get'])
    def total(self, request):
        """Get total number of messages for the authenticated user"""
        user = self.request.user
        
        # Count messages where user is sender or recipient
        count = Message.objects.filter(
            Q(sender=user) | Q(recipients__recipient=user)
        ).distinct().count()
        
        return Response({'count': count})


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for managing notifications (read-only).
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a notification as read."""
        notification = self.get_object()
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        return Response({'status': 'marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read."""
        self.get_queryset().update(
            is_read=True,
            read_at=timezone.now()
        )
        return Response({'status': 'all marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications."""
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'unread_count': count})


# Additional utility views
class CommunicationParticipantViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing communication participants.
    """
    queryset = CommunicationParticipant.objects.all()
    serializer_class = CommunicationParticipantSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]


class MessageRecipientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing message recipients.
    """
    queryset = MessageRecipient.objects.all()
    serializer_class = MessageRecipientSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]
