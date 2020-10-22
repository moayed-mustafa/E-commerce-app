


const Joi = require('joi')

const signUpSchema = Joi.object({
    username: Joi.string().min(4).max(18).required(),
    password: Joi.string().pattern(/^[ A-Za-z0-9_@/#&+-]*$/).required().min(6),
    first_name: Joi.string().min(2).max(12).required(),
    last_name: Joi.string().min(2).max(12).required(),
    email: Joi.string().email().required(),
    address: Joi.string().required()
})
const updateUserSchema = Joi.object({
    username: Joi.string().min(6).max(18),
    password: Joi.string().pattern(/^[ A-Za-z0-9_@/#&+-]*$/),
    newPassword: Joi.string().pattern(/^[ A-Za-z0-9_@/#&+-]*$/),
    first_name: Joi.string().min(2).max(12),
    last_name: Joi.string().min(2).max(12),
    email: Joi.string().email(),
    address: Joi.string(),
    _token: Joi.string()
})

module.exports = {signUpSchema, updateUserSchema}
