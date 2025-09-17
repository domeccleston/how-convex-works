// In Convex, we only ever append new data. We never update existing data.
// This differs from traditional DBs - both relational and NoSQL - which allow updates.
// This approach is called an 'append-only log'.
// Let's say we have a warehouse that we want to track the inventory of.
// We'll use a log to keep track of all the changes to the inventory.

import { nanoid as generateId } from "nanoid";

type Entry = { id: string; data: any };

class Log {
  private entries: Entry[] = [];

  append(data: any): string {
    const id = data.id || `item_${generateId()}`;
    this.entries.push({ ...data, id });
    return id;
  }

  getAll(): Entry[] {
    return this.entries;
  }
}

// Usage
const log = new Log();
const wrenchId = log.append({ table: "items", name: "Wrench", stock: 50 });
// If we want to 'update' the wrench stock, we append a new entry:
log.append({ table: "items", id: wrenchId, stock: 49 });

console.log(log.getAll());
