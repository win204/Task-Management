import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { storage } from '../utils/storage';

export type SubscriptionCallback = (message: any) => void;

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, any> = new Map();

  connect() {
    if (this.client && this.client.active) {
      return;
    }

    const token = storage.getAccessToken();
    if (!token) return;

    // Use environment variable for base URL, replace http with ws if using raw websocket,
    // but with SockJS we use standard HTTP endpoints.
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        // console.log('[STOMP]: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('[WebSocket] Connected');
      this.resubscribeAll();
    };

    this.client.onStompError = (frame) => {
      console.error('[WebSocket] Broker reported error: ' + frame.headers['message']);
      console.error('[WebSocket] Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.subscriptions.clear();
    console.log('[WebSocket] Disconnected');
  }

  subscribe(topic: string, callback: SubscriptionCallback) {
    if (this.subscriptions.has(topic)) {
      // Avoid duplicate subscriptions from React strict mode or re-renders
      return;
    }

    const subConfig = { callback };
    this.subscriptions.set(topic, subConfig);

    if (this.client && this.client.connected) {
      this.executeSubscription(topic, subConfig);
    }
  }

  unsubscribe(topic: string) {
    const sub = this.subscriptions.get(topic);
    if (sub && sub.stompSubscription) {
      sub.stompSubscription.unsubscribe();
    }
    this.subscriptions.delete(topic);
  }

  private resubscribeAll() {
    this.subscriptions.forEach((subConfig, topic) => {
      this.executeSubscription(topic, subConfig);
    });
  }

  private executeSubscription(topic: string, subConfig: any) {
    if (!this.client) return;
    
    subConfig.stompSubscription = this.client.subscribe(topic, (message: IMessage) => {
      if (message.body) {
        try {
          const parsed = JSON.parse(message.body);
          subConfig.callback(parsed);
        } catch (e) {
          // If it's just a raw string like "PROJECT_UPDATED"
          subConfig.callback(message.body);
        }
      }
    });
  }
}

export const wsService = new WebSocketService();
