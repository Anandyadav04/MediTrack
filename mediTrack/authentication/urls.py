from django.urls import path
from .views import login_page, logout_page, signup_page, doctor_signup_page

urlpatterns = [
    path('login/', login_page, name='login'),
    path('signup/', signup_page, name='signup'),
    path('signup/doctor/', doctor_signup_page, name='doctor_signup'),
    path('logout/', logout_page, name='logout'),
]
