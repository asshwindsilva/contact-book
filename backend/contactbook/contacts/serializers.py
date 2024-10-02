from rest_framework import serializers
from .models import CustomUser, Contact, Spam

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'name', 'phone', 'password', 'city', 'country']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            phone=validated_data['phone'],
            password=validated_data['password'],
            city=validated_data.get('city'),
            country=validated_data.get('country')
        )
        return user

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['name', 'phone_number']

class ContactSerializer(serializers.ModelSerializer):
    spam_likelihood = serializers.SerializerMethodField()

    class Meta:
        model = Contact
        fields = ['id', 'name', 'phone', 'spam_likelihood']

    def get_spam_likelihood(self, obj):
        try:
            spam = Spam.objects.get(phone=obj.phone)
            return spam.spam_likelihood
        except Spam.DoesNotExist:
            return 0  # If not marked as spam, return 0