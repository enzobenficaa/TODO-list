const express = require("express");
const mongoose = require("mongoose");
const { populate } = require("../models/routes/checklists");
const router = express.Router();
const Checklist = require("../models/checklists");

router.get("/", async (req, res) => {
  try {
    let checklists = await Checklist.find({});
    res.status(200).render("checklists/index", { checklists: checklists });
  } catch (error) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao exibir as listas" });
  }
});

router.get("/new", async (req, res) => {
  try {
    let checklists = new Checklist();
    res.status(200).render("checklists/new", { checklist: checklists });
  } catch (error) {
    res
      .status(500)
      .render("pages/error", { errors: "Erro ao carregar o formulario" });
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    let checklists = await Checklist.findById(req.params.id);
    res.status(200).render("checklists/edit", { checklist: checklists });
  } catch (error) {
    res.status(500).render("pages/error", {
      error: "Erro ao exibir a edição de listas de tarefa",
    });
  }
});

router.post("/", async (req, res) => {
  let { name } = req.body.checklists;
  let checklists = new Checklist({ name });

  try {
    await checklists.save();
    res.redirect("/checklists");
  } catch (error) {
    res
      .status(422)
      .render("checklists/new", { checklists: { ...checklists, error } });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let checklists = await Checklist.findById(req.params.id).populate("tasks");
    res.status(200).render("checklists/show", { checklist: checklists });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .render("pages/error", { error: "Erro ao exibir a lista de tarefa" });
  }
});

router.put("/:id", async (req, res) => {
  let { name } = req.body.checklists;
  let checklists = await Checklist.findById(req.params.id);
  try {
    await checklists.update({ name });
    res.redirect("/checklists");
  } catch (error) {
    let errors = error.errors;
    res
      .status(422)
      .render("checklists/edit", { checklist: { ...checklists, errors } });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let checklists = await Checklist.findByIdAndRemove(req.params.id);
    res.redirect("/checklists");
  } catch (error) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao deletar a lista de tarefa" });
  }
});

module.exports = router;
