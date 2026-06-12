"""
URL configuration for mediTrack project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.http import JsonResponse

def api_root_welcome(request):
    return JsonResponse({
        "status": "online",
        "name": "MediTrack REST API Backend",
        "version": "v1.0",
        "endpoints": {
            "auth": "/api/v1/auth/",
            "health": "/api/v1/health/",
            "skindiagnosis": "/api/v1/skindiagnosis/",
            "appointments": "/api/v1/appointments/",
            "reminders": "/api/v1/reminders/",
            "rentals": "/api/v1/rentals/",
            "ngos": "/api/v1/ngos/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('authentication.api_urls')),
    path('api/v1/health/', include('health_monitoring.api_urls')),
    path('api/v1/skindiagnosis/', include('skin_diagnosis.api_urls')),
    path('api/v1/appointments/', include('appointments.api_urls')),
    path('api/v1/reminders/', include('reminders.api_urls')),
    path('api/v1/rentals/', include('rental.api_urls')),
    path('api/v1/ngos/', include('ngo.api_urls')),
    path('', api_root_welcome, name='api_root_welcome'),
]


from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
