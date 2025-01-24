import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';
/* eslint-disable camelcase */

let instance = null;


class DB {
  constructor() {
    if (!instance) {
      instance = this;
      this.db = null;
      this.mongoClient = null; 
    }
    return instance;
  }

  async connect(dbname) {
    if (this.db) {
      return; 
    }
    try {
      const dbUrl = process.env.ATLAS_URI;
      this.mongoClient = new MongoClient(dbUrl, { 
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      await this.mongoClient.connect();
      this.db = this.mongoClient.db(dbname);

      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 });
      console.log('Connected to the database:', dbname);
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      throw error; 
    }
  }

  async close() {
    await this.mongoClient.close();
    instance = null; 
  }

  async readAll(collectionName) {
    try {
      const collection = this.db.collection(collectionName);
      return await collection.find().toArray();
    } catch (error) {
      console.error('Error reading from collection:', error);
      throw error; 
    }
  }

  async findQuery(collectionName, query) {
    try {
      const collection = this.db.collection(collectionName);
  
      if (collectionName === 'flight') {
        return await collection.aggregate([
          { $match: query },
          {
            $addFields: {
              parsed_departure_dt: {
                $dateFromString: { dateString: '$actual_departure_dt' }
              }
            }
          },
          { $sort: { parsed_departure_dt: 1 } },
          { $project: { parsed_departure_dt: 0 } }
        ]).toArray();
      } else {
        return await collection.find(query).toArray();
      }
    } catch (error) {
      console.error('Error finding documents:', error);
      throw error;
    }
  }

  async createMany(collectionName, documents) {
    if (!Array.isArray(documents) || documents.length === 0) {
      throw new Error('Array must not be empty.');
    }
    try {
      const collection = this.db.collection(collectionName);
      const result = await collection.insertMany(documents);
      return result.insertedCount; 
    } catch (error) {
      console.error('Error inserting documents:', error);
      throw error; 
    }
  }

  async QueryAllAirports(collectionName) {
    const projectionFields = { name: 1, latitude_deg: 1, longitude_deg: 1, local_code: 1,
      region_name: 1,  _id: 0 };
    try {
      const collection = this.db.collection(collectionName);
      return await collection.find().project(projectionFields).toArray(); 
    } catch (error) {
      console.error('Error Fetching Data:', error);
      throw error; 
    }
  }
}
 
export const db = new DB();
export default db;