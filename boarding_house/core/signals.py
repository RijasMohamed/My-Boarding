from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Member, Schedule, Payment, Bill, Repair, UserProfile
from .serializers import (
    MemberSerializer, ScheduleSerializer, PaymentSerializer, 
    BillSerializer, RepairSerializer
)


def send_notification(payload: dict):
    """Send a JSON payload to the 'notifications' group via channel layer."""
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return
    async_to_sync(channel_layer.group_send)(
        'notifications',
        {
            'type': 'broadcast.message',
            'message': payload,
        },
    )


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create UserProfile when a User is created"""
    if created:
        # Default to admin role for first user, otherwise member
        role = 'admin' if User.objects.count() == 1 else 'member'
        UserProfile.objects.get_or_create(user=instance, defaults={'role': role})


@receiver(post_save, sender=Member)
def member_post_save(sender, instance: Member, created, **kwargs):
    serializer = MemberSerializer(instance)
    send_notification({
        'model': 'member',
        'action': 'created' if created else 'updated',
        'data': serializer.data,
    })


@receiver(post_delete, sender=Member)
def member_post_delete(sender, instance: Member, **kwargs):
    send_notification({
        'model': 'member',
        'action': 'deleted',
        'data': {'id': instance.id},
    })


@receiver(post_save, sender=Schedule)
def schedule_post_save(sender, instance: Schedule, created, **kwargs):
    serializer = ScheduleSerializer(instance)
    send_notification({
        'model': 'schedule',
        'action': 'created' if created else 'updated',
        'data': serializer.data,
    })


@receiver(post_delete, sender=Schedule)
def schedule_post_delete(sender, instance: Schedule, **kwargs):
    send_notification({
        'model': 'schedule',
        'action': 'deleted',
        'data': {'id': instance.id},
    })


@receiver(post_save, sender=Payment)
def payment_post_save(sender, instance: Payment, created, **kwargs):
    serializer = PaymentSerializer(instance)
    send_notification({
        'model': 'payment',
        'action': 'created' if created else 'updated',
        'data': serializer.data,
    })


@receiver(post_delete, sender=Payment)
def payment_post_delete(sender, instance: Payment, **kwargs):
    send_notification({
        'model': 'payment',
        'action': 'deleted',
        'data': {'id': instance.id},
    })


@receiver(post_save, sender=Bill)
def bill_post_save(sender, instance: Bill, created, **kwargs):
    serializer = BillSerializer(instance)
    send_notification({
        'model': 'bill',
        'action': 'created' if created else 'updated',
        'data': serializer.data,
    })


@receiver(post_delete, sender=Bill)
def bill_post_delete(sender, instance: Bill, **kwargs):
    send_notification({
        'model': 'bill',
        'action': 'deleted',
        'data': {'id': instance.id},
    })


@receiver(post_save, sender=Repair)
def repair_post_save(sender, instance: Repair, created, **kwargs):
    serializer = RepairSerializer(instance)
    send_notification({
        'model': 'repair',
        'action': 'created' if created else 'updated',
        'data': serializer.data,
    })


@receiver(post_delete, sender=Repair)
def repair_post_delete(sender, instance: Repair, **kwargs):
    send_notification({
        'model': 'repair',
        'action': 'deleted',
        'data': {'id': instance.id},
    })
