from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Member, Schedule, Payment, Bill, Repair, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'phone']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'


class ScheduleSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='assigned_to.name', read_only=True)
    member_room = serializers.CharField(source='assigned_to.room_number', read_only=True)
    
    class Meta:
        model = Schedule
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.name', read_only=True)
    member_email = serializers.CharField(source='member.email', read_only=True)
    member_room = serializers.CharField(source='member.room_number', read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'


class BillSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.name', read_only=True)
    member_email = serializers.CharField(source='member.email', read_only=True)
    member_room = serializers.CharField(source='member.room_number', read_only=True)
    
    class Meta:
        model = Bill
        fields = '__all__'


class RepairSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.name', read_only=True)
    member_email = serializers.CharField(source='member.email', read_only=True)
    member_room = serializers.CharField(source='member.room_number', read_only=True)
    
    class Meta:
        model = Repair
        fields = '__all__'
