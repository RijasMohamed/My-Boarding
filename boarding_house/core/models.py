from django.db import models
from django.contrib.auth.models import User


class Member(models.Model):
    STATUS_CHOICES = [('Active', 'Active'), ('Inactive', 'Inactive')]

    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    contact = models.CharField(max_length=50, blank=True)
    home_address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=100, blank=True)
    room_number = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')
    joined_date = models.DateField(auto_now_add=True)
    # Link member to Django User for member portal access
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='member_profile')

    def __str__(self):
        return f"{self.name} ({self.room_number})"


class UserProfile(models.Model):
    """Extended user profile with role information"""
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('member', 'Member'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    phone = models.CharField(max_length=20, blank=True)
    
    def __str__(self):
        return f"{self.user.username} ({self.role})"
    
    @property
    def is_admin(self):
        return self.role == 'admin'
    
    @property
    def is_staff(self):
        return self.role in ['admin', 'staff']
    
    @property
    def is_member(self):
        return self.role == 'member'


class Schedule(models.Model):
    TASK_CHOICES = [('Water', 'Water'), ('Food', 'Food'), ('Cleaning', 'Cleaning')]

    task_type = models.CharField(max_length=20, choices=TASK_CHOICES)
    description = models.TextField(blank=True)
    assigned_to = models.ForeignKey(Member, null=True, blank=True, on_delete=models.SET_NULL)
    date = models.DateField()
    time = models.TimeField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.task_type} on {self.date} {self.time}"


class Payment(models.Model):
    STATUS_CHOICES = [('Paid', 'Paid'), ('Unpaid', 'Unpaid')]

    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    collected_by = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Paid')

    def __str__(self):
        return f"{self.member} - {self.amount}"


class Bill(models.Model):
    STATUS_CHOICES = [('Paid', 'Paid'), ('Unpaid', 'Unpaid')]

    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    month = models.CharField(max_length=20)
    water_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    electricity_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Unpaid')

    def __str__(self):
        return f"{self.member} - {self.month}"


class Repair(models.Model):
    STATUS_CHOICES = [('Completed', 'Completed'), ('Pending', 'Pending')]

    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=200)
    repair_date = models.DateField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    replaced_by = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return f"{self.item_name} - {self.status}"
