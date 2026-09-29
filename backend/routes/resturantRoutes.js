const express = require("express")

const{createResturant, getResturants, getResturant, updateResturant, deleteResturant} = require("../controllers/resturantController")

const router = express.Router()

router.post("/",createResturant)

router.get("/",getResturants)

router.get("/:id",getResturant)

router.put("/:id", updateResturant)

router.delete("/:id", deleteResturant)

module.exports = router;