import { Injectable } from '@angular/core';
import { MongoClient, Db, Collection, FindCursor, Document } from 'mongodb';

@Injectable({
  providedIn: 'root',
})
export class MongoDBService {
  private url = 'mongodb+srv://admin:admin@cluster0.5wtjno2.mongodb.net/';
  private dbName = 'DashBoardDB';
  private client: MongoClient;

  constructor() {
    this.client = new MongoClient(this.url);
  }

  async connectToMongoDB(): Promise<Db> {
    try {
      await this.client.connect();
      return this.client.db(this.dbName);
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      throw err;
    }
  }

  getCollection(db: Db, collectionName: string): Collection {
    return db.collection(collectionName);
  }

  async insertDocument(collection: Collection, document: any): Promise<any> {
    return collection.insertOne(document);
  }

  async findDocuments(collection: Collection, query: any): Promise<Document[]> {
    const cursor: FindCursor<Document> = collection.find(query);
    return cursor.toArray();
  }

  async closeConnection(): Promise<void> {
    await this.client.close();
  }
}
