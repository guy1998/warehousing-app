const bcrypt = require("bcrypt");
const { passwordStrength } = require("check-password-strength");
const validator = require('validator');
const secureRandomPassword = require('secure-random-password');

const passwordHasher = password => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return hashedPassword;
};

const passwordVerifier = (realPassword, testedPassword) => {
  return bcrypt.compareSync(realPassword, testedPassword);
};

const verifyEmail = email => {
    return validator.isEmail(email);
};

const verify_phone_number = phone_number=>{
  return true;
}

const verifyPasswordStrength = password => {
  if (passwordStrength(password).value === "Strong") 
    return true;

  return false;
};

const password_generator = ()=>{
  return secureRandomPassword.randomPassword({
    length: 8,
    characters: secureRandomPassword.lower + secureRandomPassword.upper + secureRandomPassword.digits + secureRandomPassword.symbols,
  });
}

module.exports = {
  passwordHasher: passwordHasher,
  passwordVerifier: passwordVerifier,
  verifyEmail: verifyEmail,
  verify_phone_number: verify_phone_number,
  verifyPasswordStrength: verifyPasswordStrength,
  password_generator: password_generator,
};