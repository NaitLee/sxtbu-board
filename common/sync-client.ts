import type { BoardSyncData } from "./types.ts";
import { randstr } from "./utils.tsx";

export class BoardSyncClient {
    identifier: string;
    constructor(public name: string, public api: string, callback: (data: BoardSyncData) => void) {
        this.identifier = randstr();
        const stream = new EventSource(api + name);
        stream.addEventListener('message', (event: MessageEvent<string>) => {
            const data = JSON.parse(event.data) as BoardSyncData;
            if (data.identifier === this.identifier) return; // from self
            callback(data);
        });
    }
    send(data: BoardSyncData) {
        if (data.identifier === this.identifier) return;
        fetch(this.api + this.name, {
            method: 'POST',
            headers: { 'Content-Type': 'text/json' },
            body: JSON.stringify(Object.assign(data, { identifier: this.identifier }))
        });
    }
}
