import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser, Contact, Spam
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView
from .jwt_serializer import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')  # If you wish to include a password

        # Generate a 6-digit OTP
        otp = str(random.randint(100000, 999999))

        try:
            user = CustomUser.objects.create_user(
                email=email,
                password=password,
                name=data.get('name'),
                phone=data.get('phone'),
                city=data.get('city', ''),
                country=data.get('country', ''),
                otp=otp
            )
            # Send OTP to the email (handled by frontend via EmailJS)
            return Response({"msg": "OTP sent to your email.", "otp": otp, "email": email}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"msg": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        # Try to get the user by email
        try:
            user = CustomUser.objects.get(email=email)

            # Check if the OTP matches
            if user.otp == otp:
                # Set the user as active and clear the OTP
                user.is_active = True
                user.otp = None  # Clear OTP after successful verification
                user.save()

                # Authenticate user and issue JWT tokens
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'msg': 'OTP verified successfully. You are now logged in.',
                }, status=status.HTTP_200_OK)

            return Response({"msg": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        except CustomUser.DoesNotExist:
            return Response({"msg": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class LoginRequestOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')

        try:
            user = CustomUser.objects.get(email=email)

            # Generate a 6-digit OTP
            otp = str(random.randint(100000, 999999))
            user.otp = otp
            user.save()

            # Return OTP to frontend, which will send it via EmailJS
            return Response({"msg": "OTP generated.", "otp": otp, "email": email}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({"msg": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

class AddContactView(APIView):
    # Re-enable the IsAuthenticated permission
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Fetch the authenticated user from the request (provided by JWT)
        user = request.user

        # Get name and phone from the request data
        name = request.data.get('name')
        phone = request.data.get('phone')

        if not name or not phone:
            return Response({"msg": "Name and phone number are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a contact for the authenticated user
        try:
            Contact.objects.create(user=user, name=name, phone=phone)
            return Response({"msg": "Contact added successfully."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"msg": "Failed to add contact.", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ListContactsView(APIView):
    # Enable IsAuthenticated permission to ensure the user is authenticated
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch the authenticated user from the request (provided by JWT)
        user = request.user

        # Fetch the contacts for the authenticated user
        contacts = Contact.objects.filter(user=user)
        contacts_data = []

        for contact in contacts:
            spam_data = None
            # Check if the contact's phone number is in the Spam model
            try:
                spam = Spam.objects.get(phone=contact.phone)
                spam_data = {
                    "spam_likelihood": spam.spam_likelihood,
                    "spam_count": spam.spam_count
                }
            except Spam.DoesNotExist:
                spam_data = {
                    "spam_likelihood": 0,
                    "spam_count": 0
                }

            contact_data = {
                "id": contact.id,
                "name": contact.name,
                "phone": contact.phone,
                "spam_info": spam_data  # Include spam data in the response
            }

            contacts_data.append(contact_data)

        return Response(contacts_data, status=status.HTTP_200_OK)


class MarkAsSpamView(APIView):
    permission_classes = [IsAuthenticated]



    def post(self, request, contact_id):
        try:
            user = request.user
            # Fetch the contact that belongs to the authenticated user
            contact = Contact.objects.get(id=contact_id, user=user)
            phone = contact.phone

            # Check if the phone number is already in the Spam model
            spam, created = Spam.objects.get_or_create(phone=phone)

            # Check if the user has already marked this number as spam
            if user in spam.marked_spam_by.all():
                return Response({"msg": "You have already marked this number as spam."}, status=status.HTTP_400_BAD_REQUEST)

            # Mark the phone number as spam
            spam.marked_spam_by.add(user)
            spam.spam_count += 1
            spam.save()

            return Response({"msg": f"Contact marked as spam. Spam likelihood: {spam.spam_likelihood:.2f}%"}, status=status.HTTP_200_OK)

        except Contact.DoesNotExist:
            return Response({"msg": "Contact not found."}, status=status.HTTP_404_NOT_FOUND)

class LogoutView(APIView):
    def post(self, request):
        try:
            # Get the refresh token from the request data
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            # Blacklist the refresh token
            token.blacklist()

            return Response({"msg": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"msg": "Failed to log out", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
