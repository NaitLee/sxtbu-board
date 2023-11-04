
import type { BoardData, BoardSyncData } from "./types.ts";
import { randstr } from "./utils.tsx";

/** in minutes */
const SESSION_LIFE = 1 * 60;
// TODO
// export const QUEUE_LIMIT = 4;

export const SyncServerSessions: BoardSyncServer[] = [];

/**
 * Used server-side
 */
export class BoardSyncServer {
    /** in minutes */
    life: number;
    queue: BoardSyncData[];
    ref_data: { current: BoardData | null };
    channel: BroadcastChannel;
    closed: boolean;
    // genuine_id: string;
    // genuine_id_taken: boolean;
    constructor(public name: string) {
        this.queue = [];
        this.ref_data = { current: null };
        this.life = new Date().getTime() / 1000 / 60 | 0;
        this.channel = new BroadcastChannel(name);
        this.closed = false;
        // this.genuine_id = randstr();
        // this.genuine_id_taken = false;
        for (let i = 0; i < SyncServerSessions.length; ++i) {
            const session = SyncServerSessions[i];
            if (this.life - session.life > SESSION_LIFE || session.closed) {
                session.end();
                SyncServerSessions.splice(i, 1);
            }
        }
        SyncServerSessions.push(this);
    }
    send(data: BoardSyncData) {
        if (this.closed) return;
        /*
        if (!this.genuine_id_taken && data.identifier && data.stroke) {
            this.genuine_id = data.identifier!;
            this.genuine_id_taken = true;
        }
        if (data.resync_response) {
            if (data.identifier === this.genuine_id) {
                this.queue = [];
            } else return;
        }
        */
        this.queue.push(data);
        /*
        if (this.queue.length >= QUEUE_LIMIT)
            data = Object.assign({}, data, { resync_request: true });
        */
        this.channel.postMessage(data);
        this.channel.dispatchEvent(new MessageEvent('message', { data: data }));
    }
    updateData(data: BoardData) {
        this.ref_data.current = data;
    }
    getReadableStream() {
        let listener: (event: MessageEvent<BoardSyncData>) => void;
        return new ReadableStream<string>({
            start: (controller) => {
                // deno-lint-ignore no-explicit-any
                const enqueue = (data: any) => controller.enqueue('data: ' + JSON.stringify(data) + '\n\n');
                for (let i = 0; i < this.queue.length; ++i)
                    enqueue(this.queue[i]);
                this.channel.addEventListener('message', listener = (event: MessageEvent<BoardSyncData>) => {
                    enqueue(event.data);
                });
            },
            cancel: () => {
                // this.end();
                if (listener)
                    this.channel.removeEventListener('message', listener);
            }
        });
    }
    end() {
        this.queue = [];
        this.channel.close();
        this.closed = true;
    }
}

export function getSyncServer(name: string) {
    for (const server of SyncServerSessions)
        if (server.name === name && !server.closed)
            return server;
    return null;
}
