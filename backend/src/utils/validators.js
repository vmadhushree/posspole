
const { body, param, query } = require('express-validator');

const passwordRule = body('password')
  .isString().withMessage('Password is required')
  .isLength({ min: 8 }).withMessage('Min 8 chars')
  .matches(/(?=.*[0-9])/).withMessage('At least one number')
  .matches(/(?=.*[^A-Za-z0-9])/).withMessage('At least one special character');

module.exports = {
  signupValidator: [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    passwordRule,
  ],
  loginValidator: [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isString().notEmpty(),
  ],
  profileUpdateValidator: [
    body('name').optional().isString().trim().notEmpty(),
    body('phone').optional().isString().trim(),
    body('dob').optional().isISO8601().toDate(),
    body('address').optional().isString().trim(),
  ],
  changePasswordValidator: [
    body('currentPassword').isString().notEmpty(),
    body('newPassword').isString().isLength({ min: 8 })
      .matches(/(?=.*[0-9])/)
      .matches(/(?=.*[^A-Za-z0-9])/),
  ],
  courseCreateValidator: [
    body('title').trim().notEmpty(),
    body('description').optional().isString(),
  ],
  feedbackCreateValidator: [
    body('courseId').isMongoId(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('message').optional().isString().trim(),
  ],
};
