const express = require("express");
const { updateUser, deleteUser, getUsers } = require("../Controller/Auth");
const router = express.Router();
router.put('/:userId', updateUser);
router.delete('/:id', deleteUser);
router.get('/', getUsers);
module.exports = router;