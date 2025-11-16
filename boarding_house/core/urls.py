from rest_framework import routers
from django.urls import path, include
from .views import (
    MemberViewSet,
    ScheduleViewSet,
    PaymentViewSet,
    BillViewSet,
    RepairViewSet,
    DashboardViewSet,
    UserViewSet,
)

router = routers.DefaultRouter()
router.register(r'members', MemberViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'bills', BillViewSet)
router.register(r'repairs', RepairViewSet)
router.register(r'dashboard', DashboardViewSet, basename='dashboard')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]
