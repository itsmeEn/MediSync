# MediSync Backend - User Validators
# This module contains validators for the UserProfile model.
import mimetypes

from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _
from django.utils.translation import ngettext_lazy

#maximum file size in bytes
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

#allowed file types
ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
]

@deconstructible
class UserFileValidator:
    """
    Validator for file uploads.
    Ensures the file size does not exceed the maximum limit and the file type is allowed.
    """
    def __init__(self, allowed_types=None, max_size=None): # Set max_size to None by default for flexibility
        # Initialize the validator with allowed file types and maximum size.
        self.allowed_types = allowed_types if allowed_types is not None else ALLOWED_FILE_TYPES # Use global constant if not provided
        self.max_size = max_size if max_size is not None else MAX_FILE_SIZE # Use global constant if not provided

    def __call__(self, value):
        #validate the file size first
        if self.max_size and value.size > self.max_size:
            raise ValidationError(
                ngettext_lazy(
                    "File size cannot exceed %(max_size)s byte.",
                    "File size cannot exceed %(max_size)s bytes.",
                    self.max_size
                ),
                code='file_too_large',
                params={'max_size': self.max_size},
            )
        #validate the file type
        real_content_type = None
        try:
            import magic
            real_content_type = magic.from_buffer(value.read(1024), mime=True)
        except ImportError:
            content_type_from_browser = value.content_type
            guessed_type, _ = mimetypes.guess_type(value.name)
            if content_type_from_browser:
                real_content_type = content_type_from_browser
            elif guessed_type:
                real_content_type = guessed_type
            else:
                raise ValidationError(
                    _("Could not determine the file type."),
                    code='unknown_file_type',
                )
        except Exception as e:
                content_type_from_browser = value.content_type
                guessed_type, _ = mimetypes.guess_type(value.name)
                if content_type_from_browser and content_type_from_browser != 'application/octet-stream':
                    real_content_type = content_type_from_browser
                elif guessed_type:
                    real_content_type = guessed_type
                else:
                    raise ValidationError(
                        _("Could not determine the file type."),
                        code='unknown_file_type',
                    ) 
        if self.allowed_types and real_content_type not in self.allowed_types:
          #raise a human readable lists of allowable file types
            ALLOWED_FILE_TYPES = []
            for mime_type in self.allowed_types:
                if mime_type == 'application/pdf':
                    ALLOWED_FILE_TYPES.append('PDF')
                elif mime_type.startswith('image/jpeg'):
                    ALLOWED_FILE_TYPES.append('JPEG/JPG')
                elif mime_type.startswith('image/png'):
                    ALLOWED_FILE_TYPES.append('PNG')
            allowed_types_str = ', '.join(ALLOWED_FILE_TYPES)
            raise ValidationError(
                _("File type '%(file_type)s' is not allowed. Allowed types are: %(allowed_types)s."),
                code='invalid_file_type',
                params={
                    'file_type': real_content_type, 'allowed_types': allowed_types_str
                    },
            ) 
#instantiate the validator to use it in the model
validate_user_document = UserFileValidator()