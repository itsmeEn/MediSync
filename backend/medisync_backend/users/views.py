from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserProfileSerializer, UserRegistrationSerializer, UserLoginSerializer, VerificationDocumentSerializer
from rest_framework.parsers import MultiPartParser, FormParser
import pyrebase
import datetime # Import for handling timestamps

config = {
    "apiKey": "AIzaSyD6krKiytg0vl99Ltdx5_pDv7AmNLM4WK8",
    "authDomain": "medisync-8d3dc.firebaseapp.com",
    "databaseURL": "https://medisync-8d3dc-default-rtdb.firebaseio.com",
    "projectId": "medisync-8d3dc",
    "storageBucket": "medisync-8d3dc.appspot.com",
    "messagingSenderId": "497187621830",
    "appId": "1:497187621830:web:26accbcc40563e09a5c0c7",
    "measurementId": "G-DJZEVWMJGS"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
database = firebase.database()
storage = firebase.storage()

# Registration: store user in Firebase Auth and RTDB
class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            # Create user in Firebase Auth
            user = auth.create_user_with_email_and_password(data['email'], data['password'])
            uid = user['localId']

            # Prepare data for Firebase Realtime Database
            now = datetime.datetime.now(datetime.timezone.utc).isoformat() # Get current UTC time in ISO format

            profile_data = {
                'email': data['email'],
                'first_name': data.get('first_name', ''),
                'last_name': data.get('last_name', ''),
                'role': data.get('role', 'patient'),
                'phone_number': data.get('phone_number', ''),
                'date_of_birth': data.get('date_of_birth', '').isoformat() if data.get('date_of_birth') else '', # Convert date to string
                'gender': data.get('gender', ''),
                'address': data.get('address', ''),
                'verification_document_url': '', # Initialize as empty, uploaded separately
                'verification_status': 'pending', # Default status
                'is_verified': False, # Default status
                'created_at': now,
                'updated_at': now,
            }

            # Store extra info in Firebase Realtime Database under the UID
            database.child("users").child(uid).set(profile_data)

            return Response({'uid': uid, 'profile': profile_data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            # More specific error handling for Firebase Auth errors
            if "EMAIL_EXISTS" in str(e):
                return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
            if "WEAK_PASSWORD" in str(e):
                return Response({'error': 'Password is too weak.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Login: authenticate with Firebase
class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        try:
            user = auth.sign_in_with_email_and_password(data['email'], data['password'])
            uid = user['localId']
            id_token = user['idToken']
            # Optionally, fetch profile
            profile = database.child("users").child(uid).get().val()
            return Response({'uid': uid, 'token': id_token, 'profile': profile}, status=status.HTTP_200_OK)
        except Exception as e:
            # More specific error handling for Firebase Auth login errors
            if "EMAIL_NOT_FOUND" in str(e) or "INVALID_PASSWORD" in str(e):
                return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

# List all user profiles (Firebase)
class UserProfileListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Ensure the path matches the actual structure: "users/{uid}/..."
        users_data = database.child("users").get().val() or {}
        # users_data will be a dict of {uid: profile_object}
        return Response(users_data)

# Get/update current user's profile (Firebase)
class UserProfileDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, uid=None):
        # Important: In a real app, you'd verify that the 'uid' passed in the URL
        # matches the authenticated user's UID from their token.
        # For simplicity here, we're assuming the client sends the correct UID.
        if not uid:
            return Response({'error': 'No UID provided.'}, status=status.HTTP_400_BAD_REQUEST)

        profile = database.child("users").child(uid).get().val()
        if not profile:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(profile)

    def put(self, request, uid=None):
        # Important: Similar to GET, verify 'uid' matches authenticated user.
        if not uid:
            return Response({'error': 'No UID provided.'}, status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data
        # Update updated_at timestamp
        data['updated_at'] = datetime.datetime.now(datetime.timezone.utc).isoformat()

        database.child("users").child(uid).update(data)
        profile = database.child("users").child(uid).get().val()
        return Response(profile)

# Upload a verification document (Firebase Storage)
class VerificationDocumentUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, uid=None):
        # Important: Verify 'uid' matches authenticated user.
        if not uid:
            return Response({'error': 'No UID provided.'}, status=status.HTTP_400_BAD_REQUEST)

        file_obj = request.FILES.get('verification_document')
        if not file_obj:
            return Response({'error': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Apply your Django validators here if they are not already applied by DRF serializer
        # For example, if you have a FileField in your DRF serializer for this file:
        # from .serializers import VerificationDocumentSerializer
        # file_serializer = VerificationDocumentSerializer(data=request.FILES)
        # file_serializer.is_valid(raise_exception=True)
        # file_obj = file_serializer.validated_data['verification_document']

        storage_path = f"verification_documents/{uid}/{file_obj.name}"
        try:
            storage.child(storage_path).put(file_obj)
            file_url = storage.child(storage_path).get_url(None) # get_url(None) gets the public URL

            # Update profile in database with the URL and set status to pending
            database.child("users").child(uid).update({
                'verification_document_url': file_url,
                'verification_status': 'pending', # Set to pending upon new upload
                'updated_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
            })
            return Response({'file_url': file_url, 'message': 'Document uploaded successfully. Verification pending.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'File upload failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)