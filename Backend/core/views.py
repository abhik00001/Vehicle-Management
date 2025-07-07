from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
# from django.contrib.auth import authenticate,login,logout 
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from django.contrib.auth import authenticate
from django.db.models import Q

# Create your views here.

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data = request.data)
        vehicles = Vehicle.objects.all()
        vehicle_data = VehicleSerializer(vehicles, many=True)
        if serializer.is_valid():
            user = serializer.save()
            user.created_by = request.user
            user.updated_by = request.user
            user.save()
            return Response({"data":serializer.data,"vehicle":vehicle_data.data}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
# def get_tokens_for_user(user):
#     refresh = RefreshToken.for_user(user)
#     return {
#         'refresh': str(refresh),
#         'access': str(refresh.access_token),
#         }

@api_view(["POST"])
def login_user(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password= request.data.get('password')
        user = User.objects.filter(email = email).first()
        print(email,password)
        if user and user.check_password(password):
        # user = authenticate(email = email,password = password)
        # if user is not None:
            refresh = RefreshToken.for_user(user) 
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            },status= status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    

@api_view(['POST'])
def custom_token_refresh(request):
    refresh_token = request.data.get('refresh')
    try:
        refresh = RefreshToken(refresh_token)
        access = str(refresh.access_token)
        
        return Response({
            'access': access
        },status=status.HTTP_200_OK)
    
    except TokenError as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user
    driver_detail = DriversProfile.objects.filter(user=user).first()
    total_users = User.objects.all().count()
    admins = User.objects.filter(role = 'admin').count()
    managers = User.objects.filter(role = 'manager').count()
    drivers = User.objects.filter(role = 'driver').count()
    vehicles = Vehicle.objects.all().count()
    
    serializer = UserSerializer(user)
    driver_profile = DriverSerializer(driver_detail)
    # print(driver_profile)
    return Response({
        'user': serializer.data,
        'total_vehicles':vehicles,
        'total_users':total_users,
        'total_admins': admins,
        'total_managers': managers,
        'total_drivers': drivers,
        'driver_profile': driver_profile.data
    },status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_vehicles(request):
    data = Vehicle.objects.all()
    serializer = VehicleSerializer(data, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# drivers 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_drivers(request):
    search = request.GET.get('search','')
    data = User.objects.filter(role = 'driver').filter(
        Q(first_name__icontains=search) | Q(email__icontains=search) | Q(last_name__icontains=search)
    )
    print(data)
    serializer = UserSerializer(data, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_driver_detail(request,driver_id):
    try:
        data = DriversProfile.objects.select_related('user').get(user__id=driver_id)
        print(data.vehicle_assigned)
        serializer = DriverSerializer(data)
        # print(serializer.data['vehicle_assigned'])
        return Response(serializer.data,status=status.HTTP_200_OK)
    except DriversProfile.DoesNotExist:
        return Response({'error': 'Driver not found'}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['DELETE'])
def delete_user(request, userID):
    try:
        user = User.objects.filter(id=userID)
        print(user)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    

#managers
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_managers(request):
    search = request.GET.get('search','')
    data = User.objects.filter(role = 'manager').filter(
        Q(first_name__icontains=search)|Q(last_name__icontains=search)|Q(email__icontains=search))
    serializer = UserSerializer(data, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
