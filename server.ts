import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { InstituteAgreementData } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'agreements.json');

// Ensure data folder and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadAgreements(): InstituteAgreementData[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content) || [];
    }
  } catch (error) {
    console.error("Error reading agreements data file:", error);
  }
  return [];
}

function saveAgreements(data: InstituteAgreementData[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing agreements data file:", error);
  }
}

// REST API Routes
// Search endpoint
app.get("/api/agreements/search", (req, res) => {
  const mobile = (req.query.mobile as string || "").trim();
  if (!mobile) {
    return res.status(400).json({ error: "Mobile number is required" });
  }

  const agreements = loadAgreements();
  // Clean query for matching (digits only)
  const cleanQuery = mobile.replace(/\D/g, "");

  const results = agreements.filter(item => {
    const headMob = (item.headMobile || "").replace(/\D/g, "");
    const chairMob = (item.chairmanMobile || "").replace(/\D/g, "");
    const ictMob = (item.ictInchargeMobile || "").replace(/\D/g, "");
    const payBillMob = (item.payBillNumber || "").replace(/\D/g, "");
    const dynMob = (item.dynamicChargeNumber || "").replace(/\D/g, "");

    return (
      (headMob && headMob.includes(cleanQuery)) ||
      (chairMob && chairMob.includes(cleanQuery)) ||
      (ictMob && ictMob.includes(cleanQuery)) ||
      (payBillMob && payBillMob.includes(cleanQuery)) ||
      (dynMob && dynMob.includes(cleanQuery)) ||
      (item.headMobile && item.headMobile.includes(mobile))
    );
  });

  return res.json({ success: true, count: results.length, data: results });
});

// List all agreements
app.get("/api/agreements", (req, res) => {
  const agreements = loadAgreements();
  return res.json({ success: true, data: agreements });
});

// Get single agreement
app.get("/api/agreements/:id", (req, res) => {
  const agreements = loadAgreements();
  const agreement = agreements.find(a => a.id === req.params.id);
  if (!agreement) {
    return res.status(404).json({ error: "Agreement not found" });
  }
  return res.json({ success: true, data: agreement });
});

// Create agreement
app.post("/api/agreements", (req, res) => {
  try {
    const body: InstituteAgreementData = req.body;
    
    if (!body.instituteName || !body.headMobile) {
      return res.status(400).json({ error: "Institute Name and Head Mobile Number are required" });
    }

    const agreements = loadAgreements();
    const now = new Date().toISOString();
    
    // Check if an entry with same headMobile or ID exists -> update instead of duplicate
    const cleanMobile = body.headMobile.trim();
    const existingIndex = agreements.findIndex(
      a => (a.id && body.id && a.id === body.id) || (a.headMobile && a.headMobile.trim() === cleanMobile)
    );

    let savedItem: InstituteAgreementData;

    if (existingIndex >= 0) {
      savedItem = {
        ...agreements[existingIndex],
        ...body,
        id: agreements[existingIndex].id,
        updatedAt: now
      };
      agreements[existingIndex] = savedItem;
    } else {
      savedItem = {
        ...body,
        id: `AGR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: now,
        updatedAt: now
      };
      agreements.unshift(savedItem);
    }

    saveAgreements(agreements);

    return res.status(201).json({
      success: true,
      message: existingIndex >= 0 ? "Agreement updated successfully" : "Agreement submitted successfully",
      data: savedItem
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to save agreement" });
  }
});

// Update agreement
app.put("/api/agreements/:id", (req, res) => {
  try {
    const agreements = loadAgreements();
    const index = agreements.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Agreement not found" });
    }

    const updatedItem = {
      ...agreements[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };

    agreements[index] = updatedItem;
    saveAgreements(agreements);

    return res.json({ success: true, message: "Agreement updated successfully", data: updatedItem });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to update agreement" });
  }
});

// Delete agreement
app.delete("/api/agreements/:id", (req, res) => {
  let agreements = loadAgreements();
  agreements = agreements.filter(a => a.id !== req.params.id);
  saveAgreements(agreements);
  return res.json({ success: true, message: "Agreement deleted successfully" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
