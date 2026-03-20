import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/authRoutes";
import quoteRoutes from "./routes/quoteRoutes";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import collectionRoutes from "./routes/collectionRoutes";
import readingListRoutes from "./routes/readingListRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import clickRoutes from "./routes/clickRoutes";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/quotes", quoteRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/books", bookRoutes);
  app.use("/api/collections", collectionRoutes);
  app.use("/api/reading-list", readingListRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/clicks", clickRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
