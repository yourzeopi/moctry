import { where } from "sequelize";
import User from "../models/UserModel.js";
import argon2 from "argon2";

// GET ALL USER DATA ================================
export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET ONE USER DATA BY ID ==========================
export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// CREATE USER ======================================
export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password And Confirm Password is not match!" });
  const hashPassword = await argon2.hash(password);

  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({ msg: "Registed Account Successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// UPDATE DATA USER BY ID ============================
export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  if (!user) res.status(404).json({ msg: "user not found" });
  const { name, email, password, confPassword, role } = req.body;

  let hashPassword;
  if (password === "" || password == null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }

  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password And Confirm Password is not match!" });

  try {
    await User.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: "User Successfully Update" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// DELETE DATA USER BY ID ============================
export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  if (!user) res.status(404).json({ msg: "user not found" });

  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User Successfully Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
