from django import forms
from .models import UserProfile
from django.contrib import crispyforms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Fieldset, Div, Field
from django.utils.translation import gettext_lazy as _

from models import UserProfile
from .validators import UserFileValidator
#forms for registration and profile management and login

class UserAccountRegistrationForm(forms.ModelForm):
    """
    Form for user registration.
    """
    #code logic for passeword fields
    password1 = forms.CharField(
        label=_("Password"),
        widget=forms.PasswordInput,
        min_length=8,
        help_text=_("Your password must be at least 8 characters long with special characters and numbers."),
    )
    password2 = forms.CharField(
        label=_("Confirm Password"),
        widget=forms.PasswordInput,
        help_text=_("Enter the same password as above, for verification."),
    )
    class Meta:
        model = UserProfile
        fields = [
            'first_name',
            'last_name',
            'role',
            'email',
            'phone_number',
            'date_of_birth',
            'gender',
            'address',
            'password1',    
            'password2',
            'verification_document',
        ]
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        #initialize crispy form helper
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.add_input(Submit('submit', _('Register'), css_class='btn btn-primary'))
        
        #defining the layout of the registration using a crispy forms layout
        self.helper.layout = Layout(
            Fieldset(
                _('User Registration'),
                Div(
                    Field('first_name', css_class='form-control', css_class='col-span-1'),
                    Field('last_name', css_class='form-control', css_class='col-span-1'),
                    Field('role', css_class='form-control',  css_class='col-span-1'),
                    Field('email', css_class='form-control',   css_class='col-span-1'), css_class='grid grid-cols-1 gap-4',),
                Div(
                    Field('phone_number', css_class='form-control'),
                    Field('date_of_birth', css_class='form-control'),
                    Field('gender', css_class='form-control'),
                    Field('address', css_class='form-control'),
                    Field('password1', css_class='form-control'),
                    Field('password2', css_class='form-control'),
                    Field('verification_document', css_class='form-control'),
                    css_class='mb-3',
                ),
            ),
        )
        
        #user type logic
        user_type = kwargs.get ('initial', {}.get('user_type', None))
        if user_type == 'patient':
            self.fields['verification_document'].required = True
            self.fields['role'].initial = 'patient'
            self.fields ['role'].widget = forms.HiddenInput()
        elif user_type == 'doctor':
            self.fields['verification_document'].required = True
            self.fields['role'].choices = [
                ('doctor', _('Doctor'))
                ]
        elif user_type == 'nurse':
            self.fields['verification_document'].required = True
            self.fields['role'].choices = [
                ('nurse', _('Nurse'))
                ]
        else:
            self.fields['verification_document'].required = False
            self.fields['role'].initial = 'patient'
            self.fields ['role'].widget = forms.HiddenInput()
            
        #ensure that email is unique
        def clean_email(self):
            email = self.cleaned_data.get('email')
            if UserProfile.objects.filter(email=email).exists():
                raise forms.ValidationError(_("Email already exists."))
            return email
        
    def clean_password2(self):
        """
        Ensure that the two password fields match.
        """
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(_("Passwords do not match."))
        return password2
    
    def save(self, commit = True):
        """
        Save the user profile instance, hashing the password.
        """
        user = super().save(commit=False) #save the user instance without committing to the database
        
        #set the password using the set_password method
        if self.cleaned_data.get('password1'):
            user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user