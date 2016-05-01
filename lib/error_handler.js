module.exports = function(err, res, status, msg) {
  msg = msg || err.message;
  process.stderr.write(err + '\n');
  res.status(status).json({ msg });
};
