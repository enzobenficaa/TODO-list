const express = require("express");

const checklistDependentRoute = express.Router();
const Checklist = require("../models/checklist");
const Task = require("../models/task");

checklistDependentRoute.get("/:id/task/new", async (req, res) => {
  try {
    let task = Task();
    res
      .status(200)
      .render("tasks/new", { checklistId: req.params.id, task: task });
  } catch (error) {
    res
      .status(422)
      .render("pages/error", { erorrs: "Erro ao carregar o formulário" });
  }
});

checklistDependentRoute.post("/:id/task/new", async (req, res) => {
  let { name } = req.body.task;
  let task = new Task({ name, checklist: req.params.id });
  try {
    await task.save();
    let checklist = checklist.findById(req.params.id);
    checklist.task.push(task);
    await checklist.save();
    res.redirect(`checklists/${req.params.id}`);
  } catch (error) {
    let errors = error.errors;
    res.status(422).render("task/new", {
      task: { ...task, errors },
      checklistId: req.params.id,
    });
  }
});

module.exports = { checklistDependent: checklistDependentRoute };
