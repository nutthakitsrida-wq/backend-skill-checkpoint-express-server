import express from "express";
import connectionPool from "../utils/db.mjs";

const answerRouter = express.Router();

// Create an answer for a question
answerRouter.post("/:questionId/answers", async (req, res) => {
  const questionId = Number(req.params.questionId);
  const { content } = req.body;

  if (
    !Number.isInteger(questionId) ||
    questionId <= 0 ||
    typeof content !== "string" ||
    !content.trim() ||
    content.trim().length > 300
  ) {
    return res.status(400).json({
      message: "Invalid request data.",
    });
  }

  try {
    const result = await connectionPool.query(
      `
        INSERT INTO answers (question_id, content)
        SELECT id, $2
        FROM questions
        WHERE id = $1
        RETURNING id
      `,
      [questionId, content.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(201).json({
      message: "Answer created successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to create answers.",
    });
  }
});

// Get answers for a question
answerRouter.get("/:questionId/answers", async (req, res) => {
  const questionId = Number(req.params.questionId);

  if (!Number.isInteger(questionId) || questionId <= 0) {
    return res.status(404).json({
      message: "Question not found.",
    });
  }

  try {
    const questionResult = await connectionPool.query(
      `
        SELECT id
        FROM questions
        WHERE id = $1
      `,
      [questionId]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    const answerResult = await connectionPool.query(
      `
        SELECT id, content
        FROM answers
        WHERE question_id = $1
        ORDER BY id ASC
      `,
      [questionId]
    );

    return res.status(200).json({
      data: answerResult.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch answers.",
    });
  }
});

// Delete all answers for a question
answerRouter.delete("/:questionId/answers", async (req, res) => {
  const questionId = Number(req.params.questionId);

  if (!Number.isInteger(questionId) || questionId <= 0) {
    return res.status(404).json({
      message: "Question not found.",
    });
  }

  try {
    const questionResult = await connectionPool.query(
      `
        SELECT id
        FROM questions
        WHERE id = $1
      `,
      [questionId]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    await connectionPool.query(
      `
        DELETE FROM answers
        WHERE question_id = $1
      `,
      [questionId]
    );

    return res.status(200).json({
      message: "All answers for the question have been deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to delete answers.",
    });
  }
});

export default answerRouter;