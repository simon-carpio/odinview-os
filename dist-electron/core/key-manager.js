"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyManager = void 0;
const keytar = __importStar(require("keytar"));
/**
 * KeyManager is a singleton class that provides secure API key management
 * using the OS keychain via the keytar library.
 */
class KeyManager {
    constructor() {
        this.serviceName = 'OdinView';
        // Private constructor to enforce singleton pattern
    }
    /**
     * Gets the singleton instance of KeyManager
     */
    static getInstance() {
        if (!KeyManager.instance) {
            KeyManager.instance = new KeyManager();
        }
        return KeyManager.instance;
    }
    /**
     * Saves an API key for the specified service
     * @param service The service name (e.g., 'openai', 'gemini')
     * @param apiKey The API key to save
     */
    async saveApiKey(service, apiKey) {
        try {
            await keytar.setPassword(this.serviceName, service, apiKey);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Retrieves an API key for the specified service
     * @param service The service name (e.g., 'openai', 'gemini')
     * @returns The API key if found, null if not found
     */
    async getApiKey(service) {
        try {
            return await keytar.getPassword(this.serviceName, service);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Deletes an API key for the specified service
     * @param service The service name (e.g., 'openai', 'gemini')
     * @returns true if the key was deleted, false if it didn't exist
     */
    async deleteApiKey(service) {
        try {
            return await keytar.deletePassword(this.serviceName, service);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.KeyManager = KeyManager;
