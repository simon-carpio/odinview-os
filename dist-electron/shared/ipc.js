"use strict";
/**
 * Formal IPC Contract between Main and Renderer processes
 * This file defines all IPC communication interfaces and types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPC_CHANNELS = void 0;
// IPC Channel Constants
exports.IPC_CHANNELS = {
    KEY_SAVE: 'key:save',
    KEY_GET: 'key:get',
    KEY_DELETE: 'key:delete',
};
