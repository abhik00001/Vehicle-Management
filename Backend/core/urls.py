from django.urls import path
from .views import *
urlpatterns = [
    path("refresh/",custom_token_refresh),

    path("register/",register_user),
    path("login/",login_user),
    path('fetchUser/<int:userId>',fetchUser),
    path('delete_user/<int:UserID>',delete_User),
    path('update_user/<int:userID>',update_user),
    
    path('user/profile/',userProfile),
    path('user/forgotPassword/',passwordForgot),
    path('updateProfile/',updateProfile),
    path('passwordChange/',password_Change),
    
    path("driver/register",add_driver),
    path("drivers/",get_drivers),
    path("delete_driverUser/<int:driverID>",delete_driver),
    path('drivers/<int:driver_id>/', fetch_driver_detail, name='get_driver_detail'),
    path('drivers/<int:user_id>/update/<int:driver_id>', update_driver , name='get_driver_detail'),

    path('managers/',get_managers),
    path('managers/<int:managerID>',get_manager_detail),
    
    path('dashboard/',dashboard),
    
    path("vehicles/",get_vehicles),
    path("vehicle/register",add_vehicle),
    path('delete_vehicle/<int:vehicleID>' , deleteVehicle )
]
