import { io } from 'socket.io-client';

class SocketClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.socket = null;
    this.userId = null;
    this.eventListeners = new Map();
  }

  connect(userId) {
    this.userId = userId; // Store the user ID when connecting
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.connected) {
        console.log('Already connected to socket', this.socket.id);
        resolve(); // Already connected
      } else {
        console.log('Attempting to connect to socket...');
        this.socket = io.connect(this.endpoint, { transports: ['websocket'] });
  
        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error); // Connection error
        });
  
        // Wait for the 'connect' event before resolving
        this.socket.on('connect', () => {
          console.log('Connected to socket', this.socket.id);
          // Emit 'auth' event with user ID when connected
          this.socket.emit('auth', userId);
          resolve();
        });
      }
    });
  }
  
  disconnect() {
    return new Promise((resolve) => {
      if (this.socket && this.socket.connected) {
        this.socket.disconnect(() => {
          console.log('Disconnected from socket', this.socket.id);
          this.socket = null;
          resolve(); // Disconnected successfully
        });
      } else {
        resolve(); // Already disconnected
      }
    });
  }

  emit(event, data) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        reject('No socket connection.'); // Socket not connected
      } else {
        this.socket.emit(event, data, (response) => {
          if (response.error) {
            console.error(response.error);
            reject(response.error); // Error response from server
          } else {
            resolve(response); // Success response from server
          }
        });
      }
    });
  }
  
  on(event, callback) {
    if (!this.socket || !this.socket.connected) {
      throw new Error('No socket connection.'); // Socket not connected
    } else {
      this.socket.on(event, callback);
      // Store the event listener so it can be removed later
      this.eventListeners.set(event, callback);
    }
  }
  off(event) {
    const callback = this.eventListeners.get(event);
    if (callback) {
      this.socket.off(event, callback);
      this.eventListeners.delete(event);
    }
  }
}

export default SocketClient;
