# PDF RAG AI

[![React](https://img.shields.io/badge/React-17.0.2-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey?logo=express&logoColor=black)](https://expressjs.com/)
[![LangChain](https://img.shields.io/badge/LangChain-v0.1-purple)](https://www.langchain.com/)
[![QuadrantDB](https://img.shields.io/badge/QuadrantDB-v1.0-orange)](https://quadrant.io/)

<img width="260" height="256" alt="ai" src="https://github.com/user-attachments/assets/cc7f8f57-e888-4416-a722-a55179bdac92" />
 
A **PDF-based question-answering system** that leverages **Retrieval-Augmented Generation (RAG)** to answer user queries from uploaded PDFs. Built with **React, Express, LangChain, and QuadrantDB**.

---

## Features

- Upload and process **PDF documents**.  
- Perform **semantic search** on PDF content.  
- Generate **accurate, context-aware answers** using RAG methodology.  
- Responsive frontend with **React**.  
- Backend API powered by **Express.js**.  
- **LangChain** used for embeddings and document retrieval.  
- **QuadrantDB** used as a vector database for fast similarity search.  
- Modular and scalable architecture, suitable for **education, research, or enterprise use**.

---

## Tech Stack

- **Frontend:** React.js  
- **Backend:** Express.js  
- **AI & NLP:** LangChain  
- **Database:** QuadrantDB  
- **Others:** Node.js, JavaScript, CSS

---

## Installation

### Prerequisites
- Node.js (v18+)  
- npm   
- QuadrantDB installed and running  

### Backend Setup
```bash
cd RAG_server
npm install
# create a .env file with your DB & API config
npm start
cd ..
cd RAG_client
npm i
npm run dev

## check package.json

