from django.urls import path
from .views import *
urlpatterns = [
    path("refresh/",custom_token_refresh),

    path("register/",register_user),
    path("login/",login_user),
    path("user_delete/<int:userID>",delete_user),
    
    path("drivers/",get_drivers),
    path("driver/register",add_driver),
    path('drivers/<int:driver_id>/', fetch_driver_detail, name='get_driver_detail'),

    path('managers/',get_managers),
    
    path('dashboard/',dashboard),
    
    path("vehicles/",get_vehicles),
    path("vehicle/register",add_vehicle)
]
