import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private activeSockets: Set<string> = new Set();
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket, ...args: any[]) {
        client.emit("update-user-list", {
            users: Array.from(this.activeSockets)
        });
        this.activeSockets.add(client.id);
        client.broadcast.emit("update-user-list", {
            users: [client.id]
        });
    }

    handleDisconnect(client: Socket) {
        this.activeSockets.delete(client.id);
        client.broadcast.emit("remove-user", {
            socketId: client.id
        });
    }

    @SubscribeMessage('call-user')
    callUser(client: Socket, data: any): void {
        client.to(data.to).emit("call-made", {
            offer: data.offer,
            socket: client.id
        });
    }

    @SubscribeMessage('make-answer')
    makeAnswer(client: Socket, data: any): void {
        client.to(data.to).emit("answer-made", {
            socket: client.id,
            answer: data.answer
        });
    }

    @SubscribeMessage('reject-call')
    rejectCall(client: Socket, data: any): void {
        client.to(data.from).emit("call-rejected", {
            socket: client.id
        });
    }
}