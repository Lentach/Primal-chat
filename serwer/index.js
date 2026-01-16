/**
 * Serwer Czatu - Socket.io Backend
 * 
 * Prosty serwer obsługujący połączenia WebSocket
 * i rozgłaszający wiadomości do wszystkich klientów.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Konfiguracja Socket.io z obsługą CORS
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Prosta strona testowa
app.get('/', (req, res) => {
    res.send('<h1>Serwer Czatu działa!</h1><p>Połącz się przez aplikację mobilną.</p>');
});

// Obsługa połączeń Socket.io
io.on('connection', (socket) => {
    console.log(`[Server] Nowe połączenie: ${socket.id}`);

    // Nasłuchiwanie na wiadomości od klientów
    socket.on('wyslij_wiadomosc', (msg) => {
        console.log(`[Server] Wiadomość od ${socket.id}:`, msg);

        // Rozgłaszanie wiadomości do WSZYSTKICH klientów (łącznie z nadawcą)
        io.emit('odbierz_wiadomosc', msg);
    });

    // Obsługa rozłączenia
    socket.on('disconnect', (reason) => {
        console.log(`[Server] Rozłączono ${socket.id}: ${reason}`);
    });
});

// Uruchomienie serwera
const PORT = 3000;
server.listen(PORT, () => {
    console.log('========================================');
    console.log(`  Serwer czatu działa na porcie ${PORT}`);
    console.log(`  http://localhost:${PORT}`);
    console.log('========================================');
});
