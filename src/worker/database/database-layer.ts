import pkg from 'pg';
const { Client: PostgreSQLClient } = pkg;
import { MongoClient, Db } from 'mongodb';
import { Pinecone } from '@pinecone-database/pinecone';
import weaviate from 'weaviate-ts-client';

export interface DatabaseEnv {
  POSTGRESQL_URL: string;
  MONGODB_ATLAS_URI: string;
  PINECONE_API_KEY: string;
  WEAVIATE_API_KEY: string;
}

export class DatabaseLayer {
  private postgresClient: PostgreSQLClient | null = null;
  private mongoClient: MongoClient | null = null;
  private mongoDB: Db | null = null;
  private pinecone: Pinecone | null = null;
  private weaviateClient: any = null;

  constructor(private env: DatabaseEnv) {}

  async initializeConnections(): Promise<void> {
    await Promise.all([
      this.initPostgreSQL(),
      this.initMongoDB(),
      this.initPinecone(),
      this.initWeaviate(),
    ]);
  }

  private async initPostgreSQL(): Promise<void> {
    try {
      this.postgresClient = new PostgreSQLClient({
        connectionString: this.env.POSTGRESQL_URL,
        ssl: { rejectUnauthorized: false },
      });
      await this.postgresClient.connect();
      console.log('PostgreSQL connected successfully');
    } catch (error) {
      console.error('PostgreSQL connection failed:', error);
    }
  }

  private async initMongoDB(): Promise<void> {
    try {
      this.mongoClient = new MongoClient(this.env.MONGODB_ATLAS_URI);
      await this.mongoClient.connect();
      this.mongoDB = this.mongoClient.db('privacyguard');
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection failed:', error);
    }
  }

  private async initPinecone(): Promise<void> {
    try {
      this.pinecone = new Pinecone({
        apiKey: this.env.PINECONE_API_KEY,
      });
      console.log('Pinecone initialized successfully');
    } catch (error) {
      console.error('Pinecone initialization failed:', error);
    }
  }

  private async initWeaviate(): Promise<void> {
    try {
      this.weaviateClient = weaviate.client({
        scheme: 'https',
        host: 'your-weaviate-cluster.weaviate.network',
        apiKey: weaviate.ApiKey(this.env.WEAVIATE_API_KEY),
      });
      console.log('Weaviate initialized successfully');
    } catch (error) {
      console.error('Weaviate initialization failed:', error);
    }
  }

  // PostgreSQL operations for structured data
  async executePostgreSQLQuery(query: string, params: any[] = []): Promise<any> {
    if (!this.postgresClient) {
      throw new Error('PostgreSQL client not initialized');
    }
    const result = await this.postgresClient.query(query, params);
    return result.rows;
  }

  // MongoDB operations for document storage
  async insertDocument(collection: string, document: any): Promise<any> {
    if (!this.mongoDB) {
      throw new Error('MongoDB not initialized');
    }
    return await this.mongoDB.collection(collection).insertOne(document);
  }

  async findDocuments(collection: string, filter: any = {}, options: any = {}): Promise<any[]> {
    if (!this.mongoDB) {
      throw new Error('MongoDB not initialized');
    }
    return await this.mongoDB.collection(collection).find(filter, options).toArray();
  }

  async updateDocument(collection: string, filter: any, update: any): Promise<any> {
    if (!this.mongoDB) {
      throw new Error('MongoDB not initialized');
    }
    return await this.mongoDB.collection(collection).updateOne(filter, { $set: update });
  }

  // Pinecone operations for vector search
  async upsertVectors(indexName: string, vectors: Array<{
    id: string;
    values: number[];
    metadata?: Record<string, any>;
  }>): Promise<void> {
    if (!this.pinecone) {
      throw new Error('Pinecone not initialized');
    }
    const index = this.pinecone.index(indexName);
    await index.upsert(vectors);
  }

  async queryVectors(indexName: string, vector: number[], topK: number = 10, filter?: Record<string, any>): Promise<any> {
    if (!this.pinecone) {
      throw new Error('Pinecone not initialized');
    }
    const index = this.pinecone.index(indexName);
    return await index.query({
      vector,
      topK,
      filter,
      includeMetadata: true,
    });
  }

  // Weaviate operations for semantic search
  async createWeaviateClass(className: string, properties: any[]): Promise<void> {
    if (!this.weaviateClient) {
      throw new Error('Weaviate client not initialized');
    }
    await this.weaviateClient
      .schema
      .classCreator()
      .withClass({
        class: className,
        properties,
      })
      .do();
  }

  async insertWeaviateObject(className: string, object: any): Promise<any> {
    if (!this.weaviateClient) {
      throw new Error('Weaviate client not initialized');
    }
    return await this.weaviateClient
      .data
      .creator()
      .withClassName(className)
      .withProperties(object)
      .do();
  }

  async searchWeaviate(className: string, query: string, limit: number = 10): Promise<any> {
    if (!this.weaviateClient) {
      throw new Error('Weaviate client not initialized');
    }
    return await this.weaviateClient
      .graphql
      .get()
      .withClassName(className)
      .withLimit(limit)
      .withNearText({ concepts: [query] })
      .do();
  }

  // Health check for all database connections
  async healthCheck(): Promise<{
    postgresql: boolean;
    mongodb: boolean;
    pinecone: boolean;
    weaviate: boolean;
  }> {
    const health = {
      postgresql: false,
      mongodb: false,
      pinecone: false,
      weaviate: false,
    };

    try {
      if (this.postgresClient) {
        await this.postgresClient.query('SELECT 1');
        health.postgresql = true;
      }
    } catch (error) {
      console.error('PostgreSQL health check failed:', error);
    }

    try {
      if (this.mongoDB) {
        await this.mongoDB.admin().ping();
        health.mongodb = true;
      }
    } catch (error) {
      console.error('MongoDB health check failed:', error);
    }

    try {
      if (this.pinecone) {
        await this.pinecone.listIndexes();
        health.pinecone = true;
      }
    } catch (error) {
      console.error('Pinecone health check failed:', error);
    }

    try {
      if (this.weaviateClient) {
        await this.weaviateClient.misc.metaGetter().do();
        health.weaviate = true;
      }
    } catch (error) {
      console.error('Weaviate health check failed:', error);
    }

    return health;
  }

  async cleanup(): Promise<void> {
    try {
      if (this.postgresClient) {
        await this.postgresClient.end();
      }
      if (this.mongoClient) {
        await this.mongoClient.close();
      }
    } catch (error) {
      console.error('Database cleanup error:', error);
    }
  }
}
