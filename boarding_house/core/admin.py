from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Member, Schedule, Payment, Bill, Repair, UserProfile


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'


class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'room_number', 'status', 'joined_date', 'user')
    list_filter = ('status',)
    search_fields = ('name', 'email', 'room_number')


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('task_type', 'assigned_to', 'date', 'time', 'completed')
    list_filter = ('task_type', 'completed', 'date')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('member', 'amount', 'payment_date', 'status')
    list_filter = ('status', 'payment_date')


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('member', 'month', 'balance', 'paid_status')
    list_filter = ('paid_status', 'month')


@admin.register(Repair)
class RepairAdmin(admin.ModelAdmin):
    list_display = ('item_name', 'repair_date', 'cost', 'status')
    list_filter = ('status', 'repair_date')
