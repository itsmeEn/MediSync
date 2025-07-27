from rest_framework import serializers
from .models import UserProfile
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework import exceptions
from .validators import UserFileValidator
from  .models import UserProfile
from django.contrib.auth import get_user_model

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the UserProfile model.
    """
    class Meta:
        model = UserProfile
        fields = '__all__'  # Include all fields from the UserProfile model
        read_only_fields = ('user_id', 'created_at', 'updated_at', 'verification_status', 'is_verified')  # these fields should not be editable via the API
        
    class UserRegistrationSerializer(serializers.ModelSerializer):
        """ Serializer for user registration."""
        password1 = serializers.CharField(
            write_only=True,
            min_length=8,
            required=True,
            help_text=_("Your password must be at least 8 characters long with special characters and numbers."),
        )
        password2 = serializers.CharField(
            write_only=True,
            min_length=8,
            required=True,
            help_text=_("Enter the same password as above, for verification."),
        )
        
    class Meta:
        model = UserProfile
        fields = [
            'user_id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'date_of_birth',
            'gender',
            'address',
            'role',
            'verification_document',
            'verification_status',
            'is_verified',
            'created_at',
            'updated_at',
        ]   
        
        def validate(self, data):
            """
            Custom validation for the UserProfile serializer.
            """
            if data.get('password1') != data.get('password2'):
               raise serializers.ValidationError(_("Passwords do not match."))
            return data
        
        def create(self, validated_data):
            validated_data.pop('password2', None)  # Remove password2 as it's not needed for creation
            user = UserProfile.objects.create_user(**validated_data)  # Use create_user to hash the password
            user.set_password(validated_data['password1'])
            user.save()
            return user
        
    class VerificationDocumentSerializer(serializers.ModelSerializer):
        class Meta:
            model = UserProfile
            fields = ['verification_document']
            validators = [UserFileValidator()]
            required = True
            help_text = _("Upload a valid verification document.")  
            
    class UserLoginSerializer(serializers.Serializer):
        """
        Serializer for user login.
        """
        email = serializers.EmailField(
            required=True,
            write_only=True,
            validators=[UniqueValidator(queryset=UserProfile.objects.all())],
            help_text=_("Enter your registered email address."),
        )
        password = serializers.CharField(
            write_only=True,
            required=True,
            help_text=_("Enter your password."),
        )
        
    def validate(self, data):
            """
            Validate the user credentials.
            """
            user = get_user_model().objects.filter(email=data['email']).first()
            if user is None or not user.check_password(data['password']):
                raise exceptions.AuthenticationFailed(_("Invalid email or password."))
            return data