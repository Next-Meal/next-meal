module.exports = exports = function(req, res, next) {
  try {
    var authHeader = req.headers.authorization;
    var namePassword = authHeader.split(' ')[1];
    var namePassBuf = new Buffer(namePassword, 'base64');
    var namePassPT = namePassBuf.toString();
    namePassBuf.fill(0);
    var namePassArr = namePassPT.split(':');
    req.auth = {
      organizationName: namePassArr[0],
      password: namePassArr[1]
    };
    if (req.auth.organizationName.length < 1) throw new Error('no organization name');
    if (req.auth.password.length < 1) throw new Error('no password');
  } catch (e) {
    console.log(e);
    return res.status(418).json({ msg: 'request error' });
  }
  next();
};
