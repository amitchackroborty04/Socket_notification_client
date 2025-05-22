'use client';
import React, { use, useEffect } from 'react';
import io from 'socket.io-client'; 
 const socket = io('http://localhost:8000'); // Replace with your server URL

export default function Home() {
  const [notifications, setNotifications] = React.useState<string[]>([]); 

    useEffect(() => {
      if ((Notification.permission === 'default') || (Notification.permission === 'denied')) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log("Notification permission granted");
          } else {
            console.log("Notification permission denied");
          }
        });
      }

    socket.on('PushNotification', (data: string) => {
    console.log('Received notification:', data);
    if (Notification.permission === 'granted') {
      const notification = new Notification('New Notification', {
        body: data,
        icon: 'https://example.com/icon.png' // Replace with your icon URL
      });
      notification.onclick = () => {
        window.focus();
      };
    }
    setNotifications((prevNotifications) => [...prevNotifications, data]); 
    });
    return () => {
      socket.off('PushNotification');
    };
  }, []);
  return (
    <div>

      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li>
        ))}
      </ul>
    </div>
  )
}
 