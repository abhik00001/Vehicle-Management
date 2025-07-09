from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('__all__')
        extra_kwargs = {
            'password': {'write_only': True},
            'created_by': {'read_only': True},
            'username': {'required': False, 'allow_blank': True},
        }
    
        
    def create(self, validated_data):
        if User.objects.filter(email=validated_data['email']).exists():
              raise serializers.ValidationError({'email': 'Email already exists.'})
        
        else:
            if validated_data.get('role') == 'admin':
                user = User.objects.create_user(
                    email=validated_data['email'],
                    password=validated_data['password'],
                    username=validated_data.get('email').split('@')[0],
                    
                    first_name = validated_data['first_name'],
                    last_name = validated_data['last_name'],
                    
                    role=validated_data['role'],
                    date_of_birth=validated_data['date_of_birth'],
                    profile_image = validated_data['profile_image'],
                    is_superuser = True,
                    is_staff = True          
                )
                
                return user
            
            
            else:   
                user = User.objects.create_user(
                    email=validated_data['email'],
                    password=validated_data['password'],
                    username=validated_data.get('email').split('@')[0],
                    
                    first_name = validated_data['first_name'],
                    last_name = validated_data['last_name'],
                    
                    role=validated_data.get('role'),
                    date_of_birth=validated_data.get('date_of_birth'),
                    profile_image = validated_data.get('profile_image'),
                    
                )
            
                return user
    
class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password')
        
class VehicleSerializer(serializers.ModelSerializer):
    is_assigned = serializers.BooleanField(default = False , read_only = True)
    class Meta:
        model = Vehicle
        fields = '__all__'
        extra_kwargs = {
            "created_by": {'read_only': True},
        }
        
class DriverSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    vehicle_assigned = VehicleSerializer(read_only=True) 
    class Meta:
        model = DriversProfile
        fields = '__all__'
        

