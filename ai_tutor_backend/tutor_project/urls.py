# tutor_project/urls.py

from django.contrib import admin
from django.urls import path, include
from api.views import GoogleLogin 

urlpatterns = [
    path('admin/', admin.site.urls),
    
    
    path('api/', include('api.urls')),
    
  
    path('api/auth/', include('dj_rest_auth.urls')), # Login, Logout, Profile
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')), # Signup
    
    
    path('api/auth/google/', GoogleLogin.as_view(), name='google_login'),
    
    
]