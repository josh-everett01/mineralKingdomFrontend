// WebSocketService.js

class WebSocketService {
  constructor() {
    this.socket = null;
  }

  connect(url) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("WebSocket connected!");
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected.");
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      // Handle incoming messages
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  // Use this method to send data through the WebSocket
  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    }
  }

  // Use this method to set up a handler for messages received from the server
  onMessage(handler) {
    if (this.socket) {
      console.log("EVENT: " + handler);
      console.log("SOCKET: " + this.socket);
      this.socket.onmessage = (event) => {
        console.log("EVENTDATA" + event.data);
        handler(event.data);
        console.log("AFTER: " + event.data)
      };
    }
  }
}

// Export a singleton instance
export const webSocketService = new WebSocketService();
