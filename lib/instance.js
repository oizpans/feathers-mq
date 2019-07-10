const NATS = require('nats');

module.exports = function getInstance(natsConfig = {}) {
  const url = natsConfig.url || 'localhost';
  const port = natsConfig.port || 4222;
  const jsonMode = natsConfig.json || true;
  const maxPingOut = natsConfig.maxPingOut || 2;
  const maxReconnectAttempts = natsConfig.maxReconnectAttempts || 10;
  const reconnectTimeWait = natsConfig.reconnectTimeWait || 2000;
  const reconnect = natsConfig.reconnect || true;

  return NATS.connect({
    url: `nats://${url}:${port}`,
    json: jsonMode,
    verbose: true,
    maxPingOut,
    maxReconnectAttempts,
    reconnectTimeWait,
    reconnect,
  });
};
