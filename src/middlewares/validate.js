const { validationResult } = require("express-validator");
//회원가입시 유효성 검사
module.exports = {
  validateError: (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json({ message: errors.array()[0].msg });
  },
};
