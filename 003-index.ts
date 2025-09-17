// We're now able to view the current state of the log.
// This approach is pretty inefficient though, because we're reading the entire log every time we want to get the current state.
// Eventually as our DB scales, this will become really slow.
// The solution is to build an index: a separate data structure that will keep track of the current state and update as we go.
// Then instead of reading the entire log, we can just read the index in O(1) time rather than O(n).

import { nanoid as generateId } from "nanoid";

type Entry = { timestamp: number; data: any };

export class Log {
  private entries: Entry[] = [];
  private timestampCounter = 1;
  private currentStateIndex: Record<string, any> = {}; // The index!

  append(data: any): string {
    const id = data.id || `item_${generateId()}`;
    const timestamp = this.timestampCounter++;
    const entry = { timestamp, data: { ...data, id } };

    // Add to log
    this.entries.push(entry);

    // Update index immediately
    this.currentStateIndex[id] = entry.data;

    return id;
  }

  getAll(): Entry[] {
    return this.entries;
  }

  // Now O(1) instead of O(n)!
  getCurrentState(): Record<string, any> {
    return { ...this.currentStateIndex };
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
