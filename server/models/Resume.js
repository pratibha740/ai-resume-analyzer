const mongoose = require("mongoose")

const resumeSchema =
  new mongoose.Schema({
    extractedText: String,

    skills: [String],

    missingSkills: [String],

    atsScore: Number,

    matchScore: Number,

    aiSuggestions: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  })

module.exports =
  mongoose.model(
    "Resume",
    resumeSchema
  )