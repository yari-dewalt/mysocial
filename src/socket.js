"use strict";
exports.__esModule = true;
exports.socket = void 0;
var socket_io_client_1 = require("socket.io-client");
var URL = "https://mysocial-backend.onrender.com";
exports.socket = (0, socket_io_client_1.io)(URL);
