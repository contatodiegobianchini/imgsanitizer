import { v4 as uuidv4 } from 'uuid';

interface StoredImage {
  id: string;
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  createdAt: number;
}

class StorageManager {
  private images: Map<string, StoredImage> = new Map();
  private readonly MAX_AGE = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

  constructor() {
    // Run cleanup every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  save(buffer: Buffer, originalName: string, mimeType: string): string {
    const id = uuidv4();
    this.images.set(id, {
      id,
      buffer,
      originalName,
      mimeType,
      createdAt: Date.now(),
    });
    return id;
  }

  get(id: string): StoredImage | undefined {
    return this.images.get(id);
  }

  delete(id: string): boolean {
    return this.images.delete(id);
  }

  private cleanup() {
    const now = Date.now();
    for (const [id, image] of this.images.entries()) {
      if (now - image.createdAt > this.MAX_AGE) {
        this.images.delete(id);
        console.log(`Cleaned up image ${id}`);
      }
    }
  }
}

export const storage = new StorageManager();
