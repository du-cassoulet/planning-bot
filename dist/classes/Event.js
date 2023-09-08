"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(eventName, execute) {
        this.eventName = eventName;
        this.execute = execute;
    }
}
exports.default = Event;
