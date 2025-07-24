from django.contrib import admin
from .models import UserProfile
# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    Admin interface for UserProfile model.
    """
    list_display = ('username', 'email', 'role', 'is_verified', 'created_at', 'updated_at')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('role', 'is_verified', 'created_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'password')
        }),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'phone_number', 'date_of_birth', 'gender', 'address')
        }),
        ('Role', {
            'fields': ('role',)
        }),
        ('Verification', {
            'fields': ('verification_document', 'verification_status', 'is_verified')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')  