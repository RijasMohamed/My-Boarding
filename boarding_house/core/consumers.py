from channels.generic.websocket import AsyncJsonWebsocketConsumer


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add('notifications', self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard('notifications', self.channel_name)

    async def receive_json(self, content, **kwargs):
        # Echo or broadcast messages; in real use this would be triggered by signals
        await self.channel_layer.group_send('notifications', {
            'type': 'broadcast.message',
            'message': content,
        })

    async def broadcast_message(self, event):
        await self.send_json(event.get('message'))
