from datetime import timezone
from django.db import models
from django.contrib.auth.models import User,PermissionsMixin
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser,PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('driver', 'Driver'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='admin')
    date_of_birth = models.DateField(null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_img', null=True, blank=True)
    
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    
    created_by = models.ForeignKey("self", on_delete=models.CASCADE, related_name='created_user', null=True, blank=True)
    updated_by = models.ForeignKey("self", on_delete=models.CASCADE, related_name='updated_user', null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    joined_on = models.DateTimeField(auto_now_add=True)
    
    
    REQUIRED_FIELDS = ["email"]
        
    def get_full_name(self):
        return f"{self.first_name} {self.last_name} ({self.role})"
    

class Vehicle(models.Model):
    vehicle_types = [
        ("LTV","LTV"),
        ("HTV","HTV"),
    ]
    vehicle_type = models.CharField(max_length=20, choices= vehicle_types)
    vehicle_name = models.CharField(max_length=20, unique=True)
    vehicle_year = models.PositiveIntegerField()
    vehicle_model = models.CharField(max_length=100)
    vehicle_photos = models.ImageField(upload_to='vehicle_img', null=True, blank=True)
    vehicle_chassiNumber = models.CharField(max_length=20, unique=True)
    vehicle_registration = models.CharField(max_length=20, unique=True)
    is_assigned = models.BooleanField(default=False)
    
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_vehicle', null=True, blank=True)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_vehicle', null=True, blank=True)
    
    def __str__(self):
        return self.vehicle_name
    

class DriversProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    vehicle_assigned = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True, blank=True)
    license = models.FileField(upload_to="license")
    license_exp = models.DateField()
    address= models.TextField()
    experience = models.PositiveIntegerField()
    
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_driverProfile', null=True, blank=True)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_driverProfile', null=True, blank=True)
    
    def __str__(self):
        return self.user.get_full_name()
    
                                                                             

    
    