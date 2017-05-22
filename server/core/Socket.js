// // sending to sender-client only
// socket.emit('message', "this is a test");
//
// // sending to all clients, include sender
// io.emit('message', "this is a test");
//
// // sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");
//
// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');
//
// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');
//
// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');
//
// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');
//
// // sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');

var IW = IW || {};

/**
 *
 * @param {express} app
 * @constructor
 */
IW.Socket = function ( app ) {
    this.server = require('http').createServer(app);
    this.io = require('socket.io')(this.server);
};

IW.Socket.prototype.io = null;
IW.Socket.prototype.server = null;

/**
 *
 * @param {string} namespace
 */
IW.Socket.prototype.listen = function (namespace) {
    var scope = this;

    var room = this.io.of(namespace);

    room.on('connection', function(socket){

            console.log(socket.id);

            // Подписался
            socket.emit(IW.Socket.EVENT_CONNECTED, { clientID: socket.id });

            // Слушаем запросы клиента

            // Отправить ответ только себе
            socket.on(IW.Socket.EVENT_SENDER, function (data) {
                socket.emit(IW.Socket.EVENT_SENDER, data);
            });

            // Отправить всем кроме себя
            socket.on(IW.Socket.EVENT_EXCEPT_SENDER, function (data) {
                // Отправляем сообщени всем кроме себя
                socket.broadcast.emit(IW.Socket.EVENT_EXCEPT_SENDER, data);

            });

            // Отправить конкретномы пользователю сообщение
            socket.on(IW.Socket.EVENT_SPECIFIC, function (data) {
                socket.broadcast.to(data.receiverID).emit(IW.Socket.EVENT_SPECIFIC, data);
            });

            socket.on(IW.Socket.EVENT_ALL, function (data) {
                room.emit(IW.Socket.EVENT_ALL, data);
            });

            socket.on(IW.Socket.EVENT_DISCONNECT, function () {
                // room.emit('disconnected', { clientID: socket.id });
                socket.broadcast.emit(IW.Socket.EVENT_DISCONNECT, { clientID: socket.id });
            });
        });

    this.server.listen(3000);
};

/**
 *
 * @type {string}
 */
IW.Socket.EVENT_CONNECTED = 'connected';
IW.Socket.EVENT_SENDER = 'sender';
IW.Socket.EVENT_EXCEPT_SENDER = 'except-sender';
IW.Socket.EVENT_SPECIFIC = 'specific';
IW.Socket.EVENT_ALL = 'all';
IW.Socket.EVENT_DISCONNECT = 'disconnect';

module.exports = IW;
