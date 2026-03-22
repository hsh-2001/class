import { attachSocketServer } from "@/lib/socket-server";
import { registerMessageSocketHandlers } from "@/services/message-socket.service";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/socket";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(_req: NextApiRequest, res: NextApiResponseServerIO) {
    const io = attachSocketServer(res.socket.server);
    registerMessageSocketHandlers(io);
    res.end();
}
