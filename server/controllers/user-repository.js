const { passwordVerifier, verifyPasswordStrength, passwordHasher } = require("../utils/security-ground.js");
const User = require("../models/user.js");
const tokenManager = require("../utils/token-generator.js");

const generate_user = async (name, surname, gmail, password, phone, role) => {
  try {
    const newUser = new User({
      name: name,
      surname: surname,
      email: gmail,
      password: password,
      phone: phone,
      role: role,
    });
    await newUser.save();
    return { result: true, message: "User created!" };
  } catch (err) {
    console.log(err.message);
    return { result: false, message: "User was not created!" };
  }
};

const user_authentication = async (email, password) => {
  const user = await find_user_by_email(email);
  if (!user) return { status: 404, tokenObj: {} };
  if(user.status === 'banned') return { status: 401, tokenObj: {} }
  if (passwordVerifier(password, user.password)) {
    const tokenObj = await tokenManager.tokenIssuing({
      user_id: user._id,
      role: user.role,
    });
    return { status: 200, tokenObj: tokenObj, role: user.role };
  } else {
    return { status: 400, tokenObj: {} };
  }
};

const find_user_by_email = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    return user;
  } catch (err) {
    return null;
  }
};

const serve_user_info_by_id = async (user_id) => {
  const token_user = await User.findById(user_id, "name surname").exec();
  return token_user;
};

const serve_full_info_by_id = async (user_id) => {
  const user = await User.findById(user_id).exec();
  return user;
};

const update_password = async (user_id, old_password, new_password) => {
  const user = await User.findById(user_id).exec();
  if (passwordVerifier(old_password, user.password)) {
    if (verifyPasswordStrength(new_password)) {
      await user.updateOne({ password: passwordHasher(new_password) });
      return { result: 1, message: "New password set successfully" };
    } else {
      return { result: 3, message: "New password is not strong enough!" };
    }
  } else {
    return { result: 2, message: "Current password was entered incorrectly" };
  }
};

const edit_user = async (user_id, new_info) => {
  try { 
    const result = await User.findByIdAndUpdate(user_id, { ...new_info });
    if (result) {
      return { result: true, message: "Edited successfully!" };
    } else {
      return { result: false, message: "User not found!" };
    }
  } catch (error) {
    return { result: false, message: error.message };
  }
};

const delete_user = async (user_id) => {
  const user = await User.findById(user_id);
  await user.deleteOne();
};

const retrieveUsers = async (avoidId)=>{
  try{
    const users = await User.find({});
    return { result: true, users: users.filter((user)=>user._id.toString() !== avoidId) };
  } catch(error) {
    return { result: false, message: error.message };
  }
}

module.exports = {
  generate_user,
  serve_full_info_by_id,
  serve_user_info_by_id,
  delete_user,
  edit_user,
  update_password,
  user_authentication,
  retrieveUsers
};
