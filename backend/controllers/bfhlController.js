import { processHierarchies } from '../utils/treeProcessor.js';
import dotenv from 'dotenv';

dotenv.config({ override: true });

// Default values for college identity fields
const DEFAULT_USER_ID = "parthmunjal_24062026";
const DEFAULT_EMAIL_ID = "parth.munjal.21cs@chitkara.edu.in";
const DEFAULT_ROLL_NUMBER = "2110991234"; // Typical roll number pattern

/**
 * Handle POST /bfhl
 */
export const handlePostBfhl = (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        error: "Missing 'data' field in request body."
      });
    }

    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: "'data' field must be an array of strings."
      });
    }

    const userId = process.env.USER_ID || DEFAULT_USER_ID;
    const emailId = process.env.EMAIL_ID || DEFAULT_EMAIL_ID;
    const rollNumber = process.env.COLLEGE_ROLL_NUMBER || DEFAULT_ROLL_NUMBER;

    // Process edge connections
    const result = processHierarchies(data, userId, emailId, rollNumber);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in POST /bfhl:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error: " + error.message
    });
  }
};
