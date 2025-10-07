import { config } from "dotenv";
config(); // Load env vars from .env

import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI from "openai";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const queue = new Queue("file-uploads-queue", {
    connection: {
        host: process.env.BULL_MQ_HOSTNAME,
        port: process.env.BULL_MQ_PORT,
    },
});

// Serve uploaded files statically
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());

// Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

const PORT = process.env.APP_PORT;

// Health Check
app.get("/", (req, res) => {
    return res.json({ status: "Working" });
});

// Chat Route
app.get("/chat", async (req, res) => {
    const user_query = req.query.message;

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: process.env.DB_URL,
            collectionName: "pdf-vectors",
        }
    );

    const retriever = vectorStore.asRetriever({ k: 2 });
    const result = await retriever.invoke(user_query);

    const SYSTEM_PROMPT = `You are a helpful AI assistant who provides short and to-the-point answers to queries based on the provided PDF file. Response must be in plane text format, Language style must be conversational. Here is a query context: ${JSON.stringify(result)}`;

    const chatResult = await client.chat.completions.create({
        model: "gpt-4.1",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: user_query },
        ],
    });



    return res.json({
        message: chatResult.choices[0].message.content,
        docs: result,
    });
});

// PDF Upload Route
app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
    const uploadedFile = req.file;

    if (!uploadedFile) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    await queue.add(
        "file-ready",
        JSON.stringify({
            filename: uploadedFile.originalname,
            source: uploadedFile.destination,
            path: uploadedFile.path,
        })
    );

    const fileUrl = `/uploads/${uploadedFile.filename}`;

    return res.json({
        message: "File uploaded successfully",
        fileUrl,
    });
});

app.listen(PORT, () => console.log(`Server is running at port`));
