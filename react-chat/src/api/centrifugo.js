import { Centrifuge } from 'centrifuge';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let centrifuge;
let subscription;

const connect = (userId, token, callback) => {
    // const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `wss://vkedu-fullstack-div2.ru/connection/websocket/`;

    console.log('Connecting to WebSocket at:', url);

    if (!centrifuge) {
        centrifuge = new Centrifuge(url, {
            getToken: () => {
                console.log('Fetching token for Centrifugo...');
                return new Promise((resolve, reject) => {
                    fetch(`${BASE_URL}/api/centrifugo/connect/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ user_id: userId })
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            console.log('Received token from Centrifugo:', data.token);
                            resolve(data.token);
                        })
                        .catch((err) => {
                            console.error('Error fetching token for Centrifugo:', err);
                            reject(err);
                        });
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
    } else {
        console.log('Centrifugo connection already established');
    }

    if (!subscription) {
        console.log('Subscribing to user channel:', userId);
        subscription = centrifuge.newSubscription(userId, {
            getToken: () => {
                console.log('Fetching subscription token...');
                return new Promise((resolve, reject) => {
                    fetch(`${BASE_URL}/api/centrifugo/subscribe/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ user_id: userId })
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            console.log('Received subscription token:', data.token);
                            resolve(data.token);
                        })
                        .catch((err) => {
                            console.error('Error fetching subscription token:', err);
                            reject(err);
                        });
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
    } else {
        console.log('Already subscribed to user channel');
    }
};

const disconnect = () => {
    if (centrifuge) {
        console.log('Disconnecting from Centrifugo WebSocket');
        centrifuge.disconnect();
    }
    if (subscription) {
        console.log('Unsubscribing from user channel');
        subscription.removeAllListeners();
        subscription.unsubscribe();
    }
};

export { connect, disconnect };
