// Our code has a problem!
// If we only ever append new data, how do we distinguish between the latest and previous entries?
// The way Convex handles this is by using timestamps. Each entry has a unique timestamp, and we can use this to determine which entry is the latest.
// Internally, Convex uses 'logical clocks' as timestamps: what matters is the order of events, not the literal time.
// We'll create a simple counter to simulate this, and use it to implement a method to get the current state of the log.

import { nanoid as generateId } from "nanoid";

type Entry = { timestamp: number; data: any };

class Log {
  private entries: Entry[] = [];
  private timestampCounter = 1;

  append(data: any): string {
    const id = data.id || `item_${generateId()}`;
    const timestamp = this.timestampCounter++;
    this.entries.push({ timestamp, data: { ...data, id } });
    return id;
  }

  getAll(): Entry[] {
    return this.entries;
  }

  getCurrentState(): Record<string, any> {
    const latest = {};

    for (const entry of this.entries) {
      const id = entry.data.id;
      if (!latest[id]) {
        latest[id] = entry.data; // if we haven't seen this ID yet, set it at latest
      }
      if (entry.timestamp > latest[id].timestamp) {
        latest[id] = entry.data; // if we have a newer entry, set it as latest
      }
    }

    return latest;
  }
}

// Usage
const log = new Log();
const wrenchId = log.append({ table: "items", name: "Wrench", stock: 50 });
const hammerId = log.append({ table: "items", name: "Hammer", stock: 25 });
// If we want to 'update' the wrench stock, we append a new entry:
log.append({ table: "items", id: wrenchId, stock: 49 });

console.log("Full log:", log.getAll());
console.log("Current warehouse state:", log.getCurrentState());
