self.addEventListener('push', event => {
    const data = event.data?.json() ?? { title: '4Real', body: '24時間以内に撮影してください' };
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icon.png',
        })
    );
});