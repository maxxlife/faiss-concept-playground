# FAISS Concept Playground 🧠

A specialized interactive demonstration of Vector Similarity Search concepts, inspired by [FAISS](https://github.com/facebookresearch/faiss) (Facebook AI Similarity Search).

This application visualizes how high-dimensional semantic search works by using the **Google Gemini API** to simulate vector embeddings, clustering, and nearest neighbor retrieval in a 2D space.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/built%20with-React-61DAFB.svg)
![Gemini](https://img.shields.io/badge/AI-Gemini-8E75B2.svg)

## ✨ Features

- **Semantic Embedding Simulation**: Uses Gemini to analyze text and project it into a simulated 2D vector space (PCA-like reduction).
- **Interactive Visualization**:
  - **Flat Index**: Visualizes exact nearest neighbor search.
  - **IVF (Inverted File Index)**: Visualizes clustering (centroids) and partitioned search spaces.
- **Real-time Vector Plotting**: See documents, the query vector, and search radii dynamically.
- **Search Logic**: Demonstrates L2 (Euclidean) distance and similarity scoring.
- **Knowledge Base Management**: Add, remove, or auto-generate sample data using AI.

## 📸 Screenshots

### 1. Knowledge Base Management
Manage your dataset or auto-generate semantic content using AI.
![Knowledge Base](./screenshots/knowledge_base.png)

### 2. Vector Space Visualization
Visual representation of high-dimensional embeddings projected into 2D space.
![Vector Space](./screenshots/vector_space.png)

### 3. Semantic Search
Execute natural language queries and analyze nearest neighbor results with engine insights.
![Vector Search](./screenshots/vector_search.png)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A **Google Gemini API Key** (Get one at [aistudio.google.com](https://aistudio.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/faiss-concept-playground.git
   cd faiss-concept-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```
   Add your API key to the file:
   ```env
   VITE_API_KEY=your_actual_api_key_here
   ```
   *(Note: The application is configured to automatically map `VITE_API_KEY` to the internal `process.env.API_KEY` usage).*

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Visualization**: Recharts
- **AI/Embeddings**: Google Gemini API (`@google/genai`)
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🤝 Contributing

Contributions are welcome! This is a playground project intended for educational purposes.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
