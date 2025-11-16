from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Member, Schedule, Payment, Bill, Repair
from .serializers import (
    MemberSerializer,
    ScheduleSerializer,
    PaymentSerializer,
    BillSerializer,
    RepairSerializer,
    UserSerializer,
)
from .permissions import IsStaff, IsOwnerOrStaff


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsStaff]  # Only staff/admin can manage members


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsStaff]  # Only staff/admin can manage schedules


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsOwnerOrStaff]  # Members can view their own, staff can view all
    
    def get_queryset(self):
        queryset = Payment.objects.all()
        # If user is a member, filter to their own payments
        if hasattr(self.request.user, 'profile') and self.request.user.profile.is_member:
            if hasattr(self.request.user, 'member_profile'):
                member = self.request.user.member_profile
                queryset = queryset.filter(member=member)
        return queryset


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [IsOwnerOrStaff]  # Members can view their own, staff can view all
    
    def get_queryset(self):
        queryset = Bill.objects.all()
        # If user is a member, filter to their own bills
        if hasattr(self.request.user, 'profile') and self.request.user.profile.is_member:
            if hasattr(self.request.user, 'member_profile'):
                member = self.request.user.member_profile
                queryset = queryset.filter(member=member)
        return queryset


class RepairViewSet(viewsets.ModelViewSet):
    queryset = Repair.objects.all()
    serializer_class = RepairSerializer
    permission_classes = [IsOwnerOrStaff]  # Members can view their own, staff can view all
    
    def get_queryset(self):
        queryset = Repair.objects.all()
        # If user is a member, filter to their own repairs
        if hasattr(self.request.user, 'profile') and self.request.user.profile.is_member:
            if hasattr(self.request.user, 'member_profile'):
                member = self.request.user.member_profile
                queryset = queryset.filter(member=member)
        return queryset


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsStaff]  # Only staff/admin can view dashboard

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get dashboard statistics"""
        today = timezone.now().date()
        
        # Total members
        total_members = Member.objects.count()
        active_members = Member.objects.filter(status='Active').count()
        
        # Pending payments (unpaid)
        pending_payments = Payment.objects.filter(status='Unpaid').count()
        total_pending_amount = Payment.objects.filter(status='Unpaid').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # Pending repairs
        pending_repairs = Repair.objects.filter(status='Pending').count()
        
        # Today's schedules
        today_schedules = Schedule.objects.filter(date=today).count()
        completed_today = Schedule.objects.filter(date=today, completed=True).count()
        
        # Recent activity (last 10 items)
        recent_payments = PaymentSerializer(
            Payment.objects.order_by('-payment_date')[:5], many=True
        ).data
        recent_repairs = RepairSerializer(
            Repair.objects.order_by('-repair_date')[:5], many=True
        ).data
        recent_schedules = ScheduleSerializer(
            Schedule.objects.order_by('-date', '-time')[:5], many=True
        ).data
        
        # Monthly bills summary
        unpaid_bills = Bill.objects.filter(paid_status='Unpaid').count()
        total_unpaid_bills_amount = Bill.objects.filter(paid_status='Unpaid').aggregate(
            total=Sum('balance')
        )['total'] or 0
        
        return Response({
            'members': {
                'total': total_members,
                'active': active_members,
                'inactive': total_members - active_members,
            },
            'payments': {
                'pending_count': pending_payments,
                'pending_amount': float(total_pending_amount),
            },
            'repairs': {
                'pending': pending_repairs,
            },
            'schedules': {
                'today': today_schedules,
                'completed_today': completed_today,
            },
            'bills': {
                'unpaid_count': unpaid_bills,
                'unpaid_amount': float(total_unpaid_bills_amount),
            },
            'recent_activity': {
                'payments': recent_payments,
                'repairs': recent_repairs,
                'schedules': recent_schedules,
            }
        })


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """View current user profile"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
