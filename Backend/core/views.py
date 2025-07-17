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

# users 

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data = request.data)
        vehicles = Vehicle.objects.all()
        vehicle_data = VehicleSerializer(vehicles, many=True)
        if serializer.is_valid():
            user = serializer.save()
            print(user)
            if user.role == 'driver':
                user.is_active = False
                user.created_by = request.user
                user.save()
                print(user,'driver')
            else:
                user.is_active = True
                user.created_by = request.user
                user.save()
   
                
            return Response({"data":serializer.data,"vehicle":vehicle_data.data}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetchUser(request,userId):
    try:
        user = User.objects.get(id = userId)
        serializer = UserSerializer(user)
        return Response(serializer.data,status=status.HTTP_200_OK)
    except user.DoesNotExist:
        return Response({'message:User Not Found'}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_User(request,UserID):
    try:
        manager = User.objects.get(id = UserID)
        manager.delete()
        return Response({"message":"Manager deleted successfully"},status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"message":"Manager not found"},status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request,userID):
    try:
        updated_data = request.data
        print(updated_data)
        user = User.objects.get(id = userID)
        serializer = UserSerializer(user, data = updated_data , partial =True)
        if serializer.is_valid():
            serializer.save(updated_by = request.user)
            
            return Response({"message":"User updated successfully"},status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except User.DoesNotExist:
        return Response({"message":"User not found"},status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
def login_user(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password= request.data.get('password')
        user = User.objects.filter(email = email).first()
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
@permission_classes([IsAuthenticated])
def password_Change(request):
        # user = User.objects.filter(username = request.user).first()
        user = request.user
        current = request.data.get('current')
        new = request.data.get('new')
        confirm = request.data.get('confirm')
        print(user,current,new,confirm)
        if not user.check_password(current):
            print("no current match")
            return Response({"error": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
        if new != confirm:
            print("no confirm match")
            return Response({"error": "New password and confirm password do not match"}, status=status.HTTP_400_BAD_REQUEST)
        elif new == confirm:
            user.set_password(new)
            user.save()
        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
    


# Dashboard

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user
    #for driver Dashboard
    driver_detail = DriversProfile.objects.filter(user=user).first()
    
    #admin     
    total_users = User.objects.all().count()
    admins = User.objects.filter(role = 'admin').count()
    
    # managers
    
    managers = User.objects.filter(role = 'manager').count()
    userAdded_managers = User.objects.filter(role='manager',created_by = request.user).count()
    
    # drivers 
    
    drivers = User.objects.filter(role = 'driver').count()
    assigned_drivers = User.objects.filter(role = 'driver',is_active = True).count()
    unassigned_drivers = User.objects.filter(role = 'driver',is_active = False).count()
    userAdded_drivers = User.objects.filter(role='driver',created_by = request.user).count()
    
    # vehicles
    
    vehicles = Vehicle.objects.all().count()
    userAdded_vehicles = Vehicle.objects.filter(created_by = request.user).count()
    assigned_vehicle = Vehicle.objects.filter(is_assigned = True).count()
    unassigned_vehicle = Vehicle.objects.filter(is_assigned = False).count()
    
    serializer = UserSerializer(user)
    driver_profile = DriverSerializer(driver_detail)
    # print(driver_profile)
    return Response({
        'user': serializer.data,
        'total_users':total_users,
        'total_admins': admins,
        
        'total_vehicles':vehicles,
        'unassigned_vehicle': unassigned_vehicle,
        'assigned_vehicle': assigned_vehicle,
        'userAdded_vehicles':userAdded_vehicles,
        
        'total_drivers': drivers,
        'assigned_drivers':assigned_drivers,
        'unassigned_drivers':unassigned_drivers,
        'userAdded_drivers':userAdded_drivers,
        
        'total_managers': managers,
        'userAdded_managers':userAdded_managers,
        'driver_profile': driver_profile.data
    },status=status.HTTP_200_OK)


# Vehicles

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_vehicles(request):
    query = request.GET.get('search','')
    data = Vehicle.objects.filter(
        Q(vehicle_name__icontains=query)|Q(vehicle_model__icontains=query)
    )
    users = User.objects.all()
    userSerialize = UserSerializer(users,many=True)
    serializer = VehicleSerializer(data, many=True)
    return Response({"data":serializer.data,"users":userSerialize.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_vehicle(request):
    data = request.data
    user = User.objects.get(username = request.user)
    serializer = VehicleSerializer(data=data)
    print(serializer)
    if serializer.is_valid():
        vehicle = serializer.save(created_by = user)
        # vehicle.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteVehicle(request,vehicleID):
    vehicle = Vehicle.objects.get(id = vehicleID)
    try:
        vehicle.delete()
        return Response('Vehicle Deleted Successfully',status=status.HTTP_202_ACCEPTED)
    except vehicle.DoesNotExist:
        return Response ('Vehicle not exist',status=status.HTTP_204_NO_CONTENT)
        

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_driver(request):
    data = request.data
    serializer = DriverSerializer(data = data)
    
    userID = data.get('user')
    user = User.objects.get(id=int(userID))
    
    vehicleID = data.get('vehicle_assigned')
          

    if serializer.is_valid():
        if vehicleID == '':
            serializer.save(user=user)
            print('none')
        elif vehicleID != '':
            vehicle = Vehicle.objects.get(id = int(vehicleID))
            serializer.save(user = user , vehicle_assigned = vehicle)
            print('not none')
            user.is_active = True
            user.save()
            vehicle.is_assigned = True
            vehicle.save()
                
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_driver_detail(request,driver_id):
    try:
        users = User.objects.all()
        UserSerialize = UserSerializer(users,many = True)
        data = DriversProfile.objects.select_related('user').get(user__id=driver_id)
        # print(data.vehicle_assigned)
        serializer = DriverSerializer(data)
        # print(serializer.data['vehicle_assigned'])
        return Response({"data":serializer.data,"users":UserSerialize.data},status=status.HTTP_200_OK)
    except DriversProfile.DoesNotExist:
        return Response({'error': 'Driver not found'}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['DELETE'])
def delete_driver(request, driverID):
    try:
        user = User.objects.get(id=driverID)
        driver_details = DriversProfile.objects.filter(user = user)
        for driver in driver_details:
            print(driver.vehicle_assigned)
            if driver.vehicle_assigned != None:
                vehicle_details = Vehicle.objects.filter(vehicle_name = driver.vehicle_assigned)
                for vehicle in vehicle_details:
                    print(vehicle.is_assigned)
                    vehicle.is_assigned = False
                    vehicle.save()
        print(user)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_driver(request,user_id ,driver_id):
    data = request.data
    driver = DriversProfile.objects.get(id = driver_id)
    
    driver_serialize = DriverSerializer(driver , data = data , partial = True)

    user = User.objects.get(id = user_id)
    vehicleID = data.get('vehicle_assigned')
    print(vehicleID)
    
    if driver_serialize.is_valid():
        if vehicleID == '':
            vehicle = Vehicle.objects.get(id = driver.vehicle_assigned.id)
            vehicle.is_assigned = False
            vehicle.save()
            driver_serialize.save(updated_by = request.user,vehicle_assigned = None,user =user)
            user.is_active = False
            user.save()
            return Response({'message': 'Driver updated successfully'}, status=status.HTTP_200_OK)
        
        elif vehicleID != '':
            vehicle = Vehicle.objects.get(id = vehicleID)
            driver_serialize.save(updated_by = request.user, vehicle_assigned = vehicle,user =user)
            user.is_active = True
            user.save()
            vehicle.is_assigned = True
            vehicle.save()
            return Response({'message': 'Driver updated successfully'}, status=status.HTTP_200_OK)
        
        else:
            return Response({"message":"INformation not valid"},status=status.HTTP_206_PARTIAL_CONTENT)
    
    return Response({'message': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
    

#managers
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_managers(request):
    search = request.GET.get('search','')
    data = User.objects.filter(role = 'manager').filter(
        Q(first_name__icontains=search)|Q(last_name__icontains=search)|Q(email__icontains=search))
    serializer = UserSerializer(data, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_manager_detail(request,managerID):
    try:
        manager = User.objects.get(id=managerID)
        user = User.objects.all()
        userSerialize = UserSerializer(user,many = True)
        serializer = UserSerializer(manager)
        return Response({"data":serializer.data,'user':userSerialize.data}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"message":"Manager not found"},status=status.HTTP_404_NOT_FOUND)


# token 

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

