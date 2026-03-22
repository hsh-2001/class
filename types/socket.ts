import type { Server as HTTPServer } from "http";
import type { NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";
import type { MessageClientToServerEvents, MessageServerToClientEvents, IMessageSocketUser } from "@/types/message";

export type MessageIOServer = IOServer<
    MessageClientToServerEvents,
    MessageServerToClientEvents,
    Record<string, never>,
    IMessageSocketUser
>;

export type NextApiResponseServerIO = NextApiResponse & {
    socket: {
        server: HTTPServer & {
            io?: MessageIOServer;
        };
    };
};
