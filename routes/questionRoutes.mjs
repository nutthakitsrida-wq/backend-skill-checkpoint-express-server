import express from "express";
import connectionPool from "../utils/db.mjs";

const questionRouter = express.Router();

// Create a new question
questionRouter.post("/", async (req, res) => {
  const { title, description, category } = req.body;

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof category !== "string" ||
    !title.trim() ||
    !description.trim() ||
    !category.trim()
  ) {
    return res.status(400).json({
      message: "Invalid request data.",
    });
  }

  try {
    await connectionPool.query(
      `
        INSERT INTO questions (title, description, category)
        VALUES ($1, $2, $3)
      `,
      [title.trim(), description.trim(), category.trim()]
    );

    return res.status(201).json({
      message: "Question created successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to create question.",
    });
  }
});

// Get all questions
questionRouter.get("/", async (req, res) => {
  try {
    const result = await connectionPool.query(`
      SELECT id, title, description, category
      FROM questions
      ORDER BY id ASC
    `);

    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }
});

// Search questions by title or category
// This route must be above GET /:questionId
questionRouter.get("/search", async (req, res) => {
  const { title, category } = req.query;

  const hasTitle = typeof title === "string" && title.trim();
  const hasCategory = typeof category === "string" && category.trim();

  if (!hasTitle && !hasCategory) {
    return res.status(400).json({
      message: "Invalid search parameters.",
    });
  }

  const conditions = [];
  const values = [];

  if (hasTitle) {
    values.push(`%${title.trim()}%`);
    conditions.push(`title ILIKE $${values.length}`);
  }

  if (hasCategory) {
    values.push(`%${category.trim()}%`);
    conditions.push(`category ILIKE $${values.length}`);
  }

  try {
    const result = await connectionPool.query(
      `
        SELECT id, title, description, category
        FROM questions
        WHERE ${conditions.join(" OR ")}
        ORDER BY id ASC
      `,
      values
    );

    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch a question.",
    });
  }
});

// Get a question by ID
questionRouter.get("/:questionId", async (req, res) => {
  const questionId = Number(req.params.questionId);

  if (!Number.isInteger(questionId) || questionId <= 0) {
    return res.status(404).json({
      message: "Question not found.",
    });
  }

  try {
    const result = await connectionPool.query(
      `
        SELECT id, title, description, category
        FROM questions
        WHERE id = $1
      `,
      [questionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch questions.",
    });
  }
});

// Update a question by ID
questionRouter.put("/:questionId", async (req, res) => {
  const questionId = Number(req.params.questionId);
  const { title, description, category } = req.body;

  if (
    !Number.isInteger(questionId) ||
    questionId <= 0 ||
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof category !== "string" ||
    !title.trim() ||
    !description.trim() ||
    !category.trim()
  ) {
    return res.status(400).json({
      message: "Invalid request data.",
    });
  }

  try {
    const result = await connectionPool.query(
      `
        UPDATE questions
        SET title = $1,
            description = $2,
            category = $3
        WHERE id = $4
        RETURNING id
      `,
      [
        title.trim(),
        description.trim(),
        category.trim(),
        questionId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      message: "Question updated successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to update question.",
    });
  }
});

// Delete a question by ID
questionRouter.delete("/:questionId", async (req, res) => {
  const questionId = Number(req.params.questionId);

  if (!Number.isInteger(questionId) || questionId <= 0) {
    return res.status(404).json({
      message: "Question not found.",
    });
  }

  try {
    const result = await connectionPool.query(
      `
        DELETE FROM questions
        WHERE id = $1
        RETURNING id
      `,
      [questionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      message: "Question post has been deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to delete question.",
    });
  }
});

export default questionRouter;