import { socketServerPath } from "@/lib/socket-shared";
import authService from "@/services/auth.service";
import { IMessageSocketUser, MessageClientToServerEvents, MessageServerToClientEvents } from "@/types/message";
import { MessageIOServer } from "@/types/socket";
import type { Server as HTTPServer } from "http";
import { Server as IOServer } from "socket.io";

const getTokenFromHandshake = (authorization?: string, token?: string) => {
    if (token) {
        return token;
    }

    if (authorization?.startsWith("Bearer ")) {
        return authorization.slice(7);
    }

    return authorization;
};

export const getUserRoom = (userId: string) => `user:${userId}`;

export const initializeSocketServer = (server: HTTPServer) => {
    const existingServer = server as HTTPServer & { io?: MessageIOServer };

    if (existingServer.io) {
        return existingServer.io;
    }

    const io = new IOServer<MessageClientToServerEvents, MessageServerToClientEvents>(server, {
        path: socketServerPath,
        addTrailingSlash: false,
    });

    io.use((socket, next) => {
        try {
            const token = getTokenFromHandshake(
                typeof socket.handshake.auth.authorization === "string" ? socket.handshake.auth.authorization : undefined,
                typeof socket.handshake.auth.token === "string" ? socket.handshake.auth.token : undefined,
            );

            if (!token) {
                throw new Error("UNAUTHORIZED");
            }

            const verifiedUser = authService.verifyToken(token);
            if (!verifiedUser || typeof verifiedUser === "string") {
                throw new Error("UNAUTHORIZED");
            }

            socket.data = {
                id: String(verifiedUser.id),
                role: verifiedUser.role as IMessageSocketUser["role"],
                schoolId: String(verifiedUser.schoolId),
            };
            next();
        } catch {
            next(new Error("UNAUTHORIZED"));
        }
    });

    existingServer.io = io;
    return io;
};

export const emitMessagePageDataToUser = (userId: string, payload: Parameters<MessageServerToClientEvents["message:page-data"]>[0]) => {
    const io = globalThis.__messageIo;
    if (!io) {
        return;
    }

    io.to(getUserRoom(userId)).emit("message:page-data", payload);
};

declare global {
    var __messageIo: MessageIOServer | undefined;
}

export const attachSocketServer = (server: HTTPServer) => {
    const io = initializeSocketServer(server);
    globalThis.__messageIo = io;
    return io;
};
