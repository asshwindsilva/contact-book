from django.urls import path
from .views import RegisterView, VerifyOTPView, LoginRequestOTPView, AddContactView, MarkAsSpamView, ListContactsView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),

    path('login/request-otp/', LoginRequestOTPView.as_view(), name='login-request-otp'),
    path('login/verify-otp/', VerifyOTPView.as_view(), name='login-verify-otp'),


    path('contacts/add/', AddContactView.as_view(), name='add-contact'),
    path('contacts/<int:contact_id>/spam/', MarkAsSpamView.as_view(), name='mark-as-spam'),
    path('contacts/', ListContactsView.as_view(), name='list-contacts'),

     path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
