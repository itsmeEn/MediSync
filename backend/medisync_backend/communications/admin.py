from django.contrib import admin
from .models import (
    MedicalRecordRequest, 
    Communication, 
    CommunicationParticipant, 
    Message, 
    MessageRecipient, 
    Notification
)


@admin.register(MedicalRecordRequest)
class MedicalRecordRequestAdmin(admin.ModelAdmin):
    list_display = ['request_id', 'patient', 'doctor', 'request_type', 'status', 'urgency_level', 'requested_date']
    list_filter = ['status', 'request_type', 'urgency_level', 'preferred_delivery_method', 'requested_date']
    search_fields = ['patient__patient_name', 'doctor__doctor_name', 'reason_for_request']
    readonly_fields = ['request_id', 'requested_date', 'created_at', 'updated_at']
    date_hierarchy = 'requested_date'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('request_id', 'patient', 'doctor', 'request_type', 'specific_records')
        }),
        ('Request Details', {
            'fields': ('reason_for_request', 'urgency_level', 'preferred_delivery_method')
        }),
        ('Status & Processing', {
            'fields': ('status', 'admin_notes', 'doctor_notes', 'processed_date', 'completed_date')
        }),
        ('Timestamps', {
            'fields': ('requested_date', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class CommunicationParticipantInline(admin.TabularInline):
    model = CommunicationParticipant
    extra = 1
    autocomplete_fields = ['user']


@admin.register(Communication)
class CommunicationAdmin(admin.ModelAdmin):
    list_display = ['communication_id', 'subject', 'communication_type', 'initiator', 'status', 'priority', 'created_at']
    list_filter = ['communication_type', 'status', 'priority', 'created_at']
    search_fields = ['subject', 'description', 'initiator__username']
    readonly_fields = ['communication_id', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    inlines = [CommunicationParticipantInline]
    autocomplete_fields = ['initiator', 'related_record_request']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('communication_id', 'communication_type', 'subject', 'description')
        }),
        ('Participants', {
            'fields': ('initiator',)
        }),
        ('Related Entities', {
            'fields': ('related_record_request',),
            'classes': ('collapse',)
        }),
        ('Status & Priority', {
            'fields': ('status', 'priority', 'resolved_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CommunicationParticipant)
class CommunicationParticipantAdmin(admin.ModelAdmin):
    list_display = ['communication', 'user', 'role', 'joined_at', 'is_active']
    list_filter = ['role', 'is_active', 'joined_at']
    search_fields = ['communication__subject', 'user__username']
    readonly_fields = ['joined_at']


class MessageRecipientInline(admin.TabularInline):
    model = MessageRecipient
    extra = 1
    autocomplete_fields = ['recipient']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['message_id', 'communication', 'sender', 'message_type', 'is_read', 'created_at']
    list_filter = ['message_type', 'is_read', 'is_edited', 'created_at']
    search_fields = ['content', 'sender__username', 'communication__subject']
    readonly_fields = ['message_id', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    inlines = [MessageRecipientInline]
    autocomplete_fields = ['sender', 'communication', 'reply_to']
    
    fieldsets = (
        ('Message Information', {
            'fields': ('message_id', 'communication', 'sender', 'message_type', 'content')
        }),
        ('Attachment', {
            'fields': ('attachment', 'attachment_name', 'attachment_size'),
            'classes': ('collapse',)
        }),
        ('Message Status', {
            'fields': ('is_read', 'read_at', 'is_edited', 'edited_at')
        }),
        ('Reply Information', {
            'fields': ('reply_to',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(MessageRecipient)
class MessageRecipientAdmin(admin.ModelAdmin):
    list_display = ['message', 'recipient', 'is_read', 'delivered_at', 'read_at']
    list_filter = ['is_read', 'delivered_at']
    search_fields = ['message__content', 'recipient__username']
    readonly_fields = ['delivered_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['notification_id', 'recipient', 'notification_type', 'title', 'priority', 'is_read', 'created_at']
    list_filter = ['notification_type', 'priority', 'is_read', 'is_sent', 'created_at']
    search_fields = ['title', 'message', 'recipient__username']
    readonly_fields = ['notification_id', 'created_at']
    date_hierarchy = 'created_at'
    autocomplete_fields = ['recipient', 'related_communication', 'related_message', 'related_record_request']
    
    fieldsets = (
        ('Notification Information', {
            'fields': ('notification_id', 'recipient', 'notification_type', 'title', 'message', 'priority')
        }),
        ('Related Objects', {
            'fields': ('related_communication', 'related_message', 'related_record_request'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_read', 'read_at', 'is_sent', 'sent_at')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
