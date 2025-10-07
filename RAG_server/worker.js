import { config } from "dotenv";
config(); // Load env vars from .env

import { Worker } from 'bullmq';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { OpenAIEmbeddings } from '@langchain/openai';
import { CharacterTextSplitter } from "@langchain/textsplitters";

// Setup the worker
const worker = new Worker(
    'file-uploads-queue',
    async (job) => {
        try {
            console.log(`Job data:`, job.data);

            const data = JSON.parse(job.data);
            const loader = new PDFLoader(data.path);
            const docs = await loader.load(); // Array of Document objects

            const fullText = docs.map(doc => doc.pageContent).join("\n");

            // Split text into chunks
            const textSplitter = new CharacterTextSplitter({
                chunkSize: 300,
                chunkOverlap: 0,
            });

            const splitTexts = await textSplitter.createDocuments([fullText]); // returns Document[]
            // gen vector embeddings
            const embeddings = new OpenAIEmbeddings({
                model: 'text-embedding-3-small',
                apiKey: process.env.OPENAI_API_KEY, // use .env
            });
            // store
            const vectorStore = await QdrantVectorStore.fromExistingCollection(
                embeddings,
                {
                    url: 'http://localhost:6333',
                    collectionName: 'pdf-vectors',
                }
            );

            await vectorStore.addDocuments(splitTexts);

            console.log("All documents added to vector DB.");
        } catch (err) {
            console.error("Worker error:", err);
        }
    },
    {
        concurrency: 100,
        connection: {
            host: 'localhost',
            port: 6379,
        },
    }
);
