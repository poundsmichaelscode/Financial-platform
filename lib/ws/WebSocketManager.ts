import { WS_MAX_RETRIES, WS_RECONNECT_DELAY } from '@/lib/constants';
import type { Tick } from '@/features/charts/types';
import { normalizeFinnhubTrade } from './normalizers';

type TickHandler = (ticks: Tick[]) => void;
type StatusHandler = (status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'mock') => void;

type Config = {
  url: string;
  provider: 'finnhub';
  onTicks: TickHandler;
  onStatus?: StatusHandler;
};

export class WebSocketManager {
  private socket: WebSocket | null = null;
  private subscriptions = new Set<string>();
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private manuallyClosed = false;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.manuallyClosed = false;
    this.config.onStatus?.('connecting');
    this.socket = new WebSocket(this.config.url);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.config.onStatus?.('connected');
      for (const symbol of this.subscriptions) this.sendSubscribe(symbol);
    };

    this.socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data as string);
        const ticks = normalizeFinnhubTrade(payload);
        if (ticks.length) this.config.onTicks(ticks);
      } catch (error) {
        console.error('[WebSocketManager] failed to parse message', error);
      }
    };

    this.socket.onclose = () => {
      this.config.onStatus?.('disconnected');
      if (!this.manuallyClosed) this.reconnect();
    };

    this.socket.onerror = (error) => {
      console.error('[WebSocketManager] socket error', error);
    };
  }

  subscribe(symbol: string) {
    this.subscriptions.add(symbol);
    if (this.socket?.readyState === WebSocket.OPEN) this.sendSubscribe(symbol);
  }

  unsubscribe(symbol: string) {
    this.subscriptions.delete(symbol);
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    }
  }

  disconnect() {
    this.manuallyClosed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.socket?.close();
    this.socket = null;
  }

  private reconnect() {
    if (this.reconnectAttempts >= WS_MAX_RETRIES) return;
    this.reconnectAttempts += 1;
    const delay = Math.min(WS_RECONNECT_DELAY * this.reconnectAttempts, 15000);
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  private sendSubscribe(symbol: string) {
    this.socket?.send(JSON.stringify({ type: 'subscribe', symbol }));
  }
}

export class MockMarketDataManager {
  private subscriptions = new Set<string>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private prices = new Map<string, number>();
  private onTicks: TickHandler;
  private onStatus?: StatusHandler;

  constructor(onTicks: TickHandler, onStatus?: StatusHandler) {
    this.onTicks = onTicks;
    this.onStatus = onStatus;
  }

  connect() {
    this.onStatus?.('mock');
    this.timer = setInterval(() => {
      const now = Date.now();
      const ticks: Tick[] = [];

      for (const symbol of this.subscriptions) {
        const current = this.prices.get(symbol) ?? 100 + symbol.length * 1000;
        const next = Math.max(1, current + (Math.random() - 0.5) * current * 0.002);
        this.prices.set(symbol, next);
        ticks.push({ symbol, price: next, volume: Math.random() * 1000, timestamp: now });
      }

      if (ticks.length) this.onTicks(ticks);
    }, 700);
  }

  subscribe(symbol: string) {
    this.subscriptions.add(symbol);
  }

  unsubscribe(symbol: string) {
    this.subscriptions.delete(symbol);
  }

  disconnect() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
