const joi = require('joi')

module.exports.createUser = joi.object().keys({
    user_name: joi.string().required(),
    email: joi
        .string()
        .email({ tlds: { allow: false } })
        .required(),
    password: joi.string().required(),
})


module.exports.login = joi.object().keys({
    email: joi
        .string()
        .email({ tlds: { allow: false } })
        .required(),
    password: joi.string().required(),
})