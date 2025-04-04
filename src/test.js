import dotenv from "dotenv";
import { Client, Databases, Query } from "appwrite";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.VITE_APPWRITE_COLLECTION_ID;

// Check for missing environment variables
if (!PROJECT_ID || !DATABASE_ID || !COLLECTION_ID) {
  throw new Error(
    "Missing required environment variables. Check your .env.local file."
  );
}

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

async function fetchData() {
  try {
    const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(100), // Fetch up to 100 documents
      Query.offset(0), // Start from the first document
    ]);
    console.log(response); // Logs the fetched documents
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Run the fetchData function
/* (async () => {
  await fetchData();
})(); */
fetchData();
