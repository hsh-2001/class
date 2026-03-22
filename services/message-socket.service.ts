import { getUserRoom } from "@/lib/socket-server";
import messageService from "@/services/message.service";
import {
    ICreateMessageThreadDTO,
    IMessageSocketAck,
    IMessageSocketUser,
    ISendMessageDTO,
    MessageClientToServerEvents,
    MessageServerToClientEvents,
} from "@/types/message";
import { MessageIOServer } from "@/types/socket";
import { Socket } from "socket.io";

export const registerMessageSocketHandlers = (io: MessageIOServer) => {
    if ((io as MessageIOServer & { __messageHandlersRegistered?: boolean }).__messageHandlersRegistered) {
        return;
    }

    (io as MessageIOServer & { __messageHandlersRegistered?: boolean }).__messageHandlersRegistered = true;

    io.on("connection", (socket: Socket<
        MessageClientToServerEvents,
        MessageServerToClientEvents,
        Record<string, never>,
        IMessageSocketUser
    >) => {
        socket.join(getUserRoom(socket.data.id));

        socket.on("message:thread:create", async (payload: ICreateMessageThreadDTO, callback: (response: IMessageSocketAck) => void) => {
            try {
                const response = await messageService.createThreadForTeacher(socket.data, payload);
                callback({
                    success: true,
                    data: response,
                });
            } catch (error) {
                callback({
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to create conversation",
                });
            }
        });

        socket.on("message:send", async (payload: ISendMessageDTO, callback: (response: IMessageSocketAck) => void) => {
            try {
                const response = await messageService.sendMessageForUser(socket.data, payload);
                callback({
                    success: true,
                    data: response,
                });
            } catch (error) {
                callback({
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to send message",
                });
            }
        });
    });
};
