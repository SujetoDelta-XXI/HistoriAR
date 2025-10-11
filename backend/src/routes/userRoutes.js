import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuario eliminado" });
});

export default router;
