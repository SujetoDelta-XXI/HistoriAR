import express from "express";
import Monument from "../models/Monument.js";

const router = express.Router();

// Listar todos
router.get("/", async (req, res) => {
  const monuments = await Monument.find();
  res.json(monuments);
});

// Crear nuevo
router.post("/", async (req, res) => {
  const monument = await Monument.create(req.body);
  res.status(201).json(monument);
});

// Obtener uno
router.get("/:id", async (req, res) => {
  const monument = await Monument.findById(req.params.id);
  if (!monument) return res.status(404).json({ message: "No encontrado" });
  res.json(monument);
});

// Actualizar
router.put("/:id", async (req, res) => {
  const monument = await Monument.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(monument);
});

// Eliminar
router.delete("/:id", async (req, res) => {
  await Monument.findByIdAndDelete(req.params.id);
  res.json({ message: "Monumento eliminado" });
});

export default router;
