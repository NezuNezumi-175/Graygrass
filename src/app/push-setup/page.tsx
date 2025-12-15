'use client'
import { useState } from 'react';

export default function PushSetupPage() {
    const [status, setStatus] = useState('未設定')

    async function setup() {
        alert('Setting up push notifications...');
        try {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                return setStatus('申し訳ありません。お使いのブラウザは未対応です。')
            }
            alert('Service Worker and Push Manager are supported.');
            const reg = await navigator.serviceWorker.register('/sw.js')
            alert('Service Worker registered: ' + reg.scope);
            const perm = await Notification.requestPermission()
            alert('Notification permission requested: ' + perm);
            if (perm !== 'granted') return setStatus('通知が拒否されました')

            alert('Notification permission ' + perm);

            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            })

            const res = await fetch('/api/push-subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub),
            })
            setStatus(res.ok ? '購読完了' : '購読失敗（サーバーエラーもしくはネットワークエラー）')
            alert('Push subscription ' + (res.ok ? 'succeeded' : 'failed'));
        } catch (e) {
            setStatus('エラー: ' + (e as Error).message)
        }
    }

    return (
        <div className="p-6 space-y-4">
            <button className="btn" onClick={setup}>通知を有効化</button>
            <p>{status}</p>
        </div>
    )
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
    return outputArray
}
