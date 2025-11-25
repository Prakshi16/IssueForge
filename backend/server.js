// SERVER.JS - ISSUEFORGE BACKEND

// .env drama
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "❌ ERROR: MONGODB_URI is not defined in environment variables"
  );
  console.error(
    "Please create a .env file with MONGODB_URI=your_connection_string"
  );
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Please check your MONGODB_URI in .env file");
    process.exit(1);
  });

mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("❌ MongoDB error:", error.message);
});

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    owner: {
      type: String,
      required: [true, "Owner is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "In Progress", "Fixed", "Closed"],
      default: "New",
    },
    created: {
      type: Date,
      default: Date.now,
    },
    effort: {
      type: Number,
      min: 0,
      default: 0,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Issue = mongoose.model("Issue", issueSchema);

// GET /api/issues - Fetch all issues from database
app.get("/api/issues", async (req, res) => {
  try {
    console.log("📋 Fetching all issues from database...");

    const issues = await Issue.find().sort({ created: -1 });

    console.log(`✅ Found ${issues.length} issues`);
    res.json(issues);
  } catch (error) {
    console.error("❌ Error fetching issues:", error.message);
    res.status(500).json({
      error: "Failed to fetch issues",
      message: error.message,
    });
  }
});

// POST /api/issues - Create a new issue
app.post("/api/issues", async (req, res) => {
  try {
    console.log("➕ Creating new issue:", req.body);

    if (!req.body.title || !req.body.owner) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Title and Owner are required fields",
      });
    }

    const newIssue = new Issue({
      title: req.body.title,
      owner: req.body.owner,
      status: req.body.status || "New",
      effort: req.body.effort || 0,
      dueDate: req.body.dueDate || null,
    });

    const savedIssue = await newIssue.save();

    console.log(`✅ Issue created with ID: ${savedIssue._id}`);
    res.status(201).json(savedIssue);
  } catch (error) {
    console.error("❌ Error creating issue:", error.message);
    res.status(500).json({
      error: "Failed to create issue",
      message: error.message,
    });
  }
});

// PUT /api/issues/:id - Update an existing issue
app.put("/api/issues/:id", async (req, res) => {
  try {
    const issueId = req.params.id;
    console.log(`📝 Updating issue ${issueId}:`, req.body);

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      return res.status(400).json({
        error: "Invalid ID format",
        message: "The provided ID is not a valid MongoDB ObjectId",
      });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      {
        title: req.body.title,
        owner: req.body.owner,
        status: req.body.status,
        effort: req.body.effort,
        dueDate: req.body.dueDate,
      },
      { new: true, runValidators: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({
        error: "Issue not found",
        message: `No issue found with ID: ${issueId}`,
      });
    }

    console.log(`✅ Issue ${issueId} updated successfully`);
    res.json(updatedIssue);
  } catch (error) {
    console.error("❌ Error updating issue:", error.message);
    res.status(500).json({
      error: "Failed to update issue",
      message: error.message,
    });
  }
});

// DELETE /api/issues/:id - Delete an issue
app.delete("/api/issues/:id", async (req, res) => {
  try {
    const issueId = req.params.id;
    console.log(`🗑️  Deleting issue ${issueId}...`);

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      return res.status(400).json({
        error: "Invalid ID format",
        message: "The provided ID is not a valid MongoDB ObjectId",
      });
    }

    const deletedIssue = await Issue.findByIdAndDelete(issueId);

    if (!deletedIssue) {
      return res.status(404).json({
        error: "Issue not found",
        message: `No issue found with ID: ${issueId}`,
      });
    }

    console.log(`✅ Issue ${issueId} deleted successfully`);
    res.json({
      message: "Issue deleted successfully",
      deletedIssue,
    });
  } catch (error) {
    console.error("❌ Error deleting issue:", error.message);
    res.status(500).json({
      error: "Failed to delete issue",
      message: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "🔥 IssueForge API",
    version: "2.0",
    database: "MongoDB",
    endpoints: [
      "GET /api/issues - Get all issues",
      "POST /api/issues - Create new issue",
      "PUT /api/issues/:id - Update issue by ID",
      "DELETE /api/issues/:id - Delete issue by ID",
    ],
  });
});

// start server bhai
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🔥 IssueForge Backend Server");
  console.log("=".repeat(50));
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/issues`);
  console.log("=".repeat(50));
  console.log("Waiting for requests...\n");
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n👋 Shutting down server gracefully...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed");
  process.exit(0);
});
