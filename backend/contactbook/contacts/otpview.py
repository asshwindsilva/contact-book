# views.py (Django Backend)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            user = CustomUser.objects.get(email=email)
            if user.otp == otp:
                user.is_active = True  # Activate the user after OTP verification
                user.otp = None  # Clear the OTP once verified
                user.save()
                return Response({"msg": "OTP verified successfully"}, status=status.HTTP_200_OK)
            return Response({"msg": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({"msg": "User not found"}, status=status.HTTP_404_NOT_FOUND)



class VerifyOTPLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            user = CustomUser.objects.get(email=email)

            # Check if the OTP matches
            if user.otp == otp:
                # Clear OTP after successful login
                user.otp = None
                user.save()

                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    "msg": "Login successful."
                }, status=status.HTTP_200_OK)

            else:
                return Response({"msg": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        except CustomUser.DoesNotExist:
            return Response({"msg": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

