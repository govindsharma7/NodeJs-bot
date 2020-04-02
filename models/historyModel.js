/**
 * Creating Schema for the history model
 */
const mongoose = require("../config/database");
const schema = {
    user: { type: mongoose.SchemaTypes.Mixed, required: true },
    search: { type: mongoose.SchemaTypes.String, required: true },
    search_key: { type: mongoose.SchemaTypes.String},
    result: [{ type: mongoose.SchemaTypes.String }],
    search_count: { type: mongoose.SchemaTypes.Number, default: 1 },
    date: { type: Date, default: Date.now }
};

const collectionName = "history"; // Name of the collection of documents
const historySchema = mongoose.Schema(schema);
const History = mongoose.model(collectionName, historySchema);

module.exports = History;
