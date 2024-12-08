import { Centrifuge } from 'centrifuge';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let centrifuge;
let subscriptions = {};

const connect = (userId, token, callback) => {
    const url = `wss://vkedu-fullstack-div2.ru/connection/websocket/`;

    if (!centrifuge) {
        centrifuge = new Centrifuge(url, {
            getToken: () => {
                return fetch(`${BASE_URL}/api/centrifugo/connect/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ user_id: userId }),
                })
                    .then((res) => res.json())
                    .then((data) => data.token)
                    .catch((err) => {
                        console.error('Error fetching token for Centrifugo:', err);
                        throw err;
                    });
            },
        });

        centrifuge.on('connect', () => {
            console.log('Successfully connected to Centrifugo WebSocket');
        });

        centrifuge.on('disconnect', (reason) => {
            console.log('Disconnected from Centrifugo WebSocket:', reason);
        });

        centrifuge.on('error', (error) => {
            console.error('Centrifugo connection error:', error);
        });

        centrifuge.connect();
    }

    if (!subscriptions[userId]) {
        const subscription = centrifuge.newSubscription(userId, {
            getToken: () => {
                return fetch(`${BASE_URL}/api/centrifugo/subscribe/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ user_id: userId }),
                })
                    .then((res) => res.json())
                    .then((data) => data.token)
                    .catch((err) => {
                        console.error('Error fetching subscription token:', err);
                        throw err;
                    });
            },
        });

        subscription.on('subscribed', () => {
            console.log('Successfully subscribed to user channel');
        });

        subscription.on('publication', (data) => {
            console.log('Received message from Centrifugo:', data);
            callback(data);
        });

        subscription.on('unsubscribe', () => {
            console.log('Unsubscribed from user channel');
        });

        subscription.subscribe();
        subscriptions[userId] = subscription;
    }
};

const disconnect = () => {
    if (centrifuge) {
        centrifuge.disconnect();
        centrifuge = null;
        subscriptions = {};
    }
};

export { connect, disconnect };