
const { Parser } = require('json2csv');

function toCSV(rows, fields) {
  const parser = new Parser({ fields, withBOM: true });
  return parser.parse(rows);
}

module.exports = { toCSV };
