from django import forms
from .models import UserProfile
from django.contrib import crispyforms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Fieldset, Div, Field
from django.utils.translation import gettext_lazy as _


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