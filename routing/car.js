const { Router } = require("express");
const {getAllCars, addCars, getCarById, deleteCar, updateCar, getCarByTitle, getCarByDesc, getCarByTags} = require("../controller/car");

const postRouter = Router();

postRouter.get("/", getAllCars);
postRouter.post("/", addCars);
postRouter.get("/:id", getCarById);
postRouter.put("/:id",updateCar);
postRouter.delete("/:id",deleteCar);
postRouter.get("/searchT/:tl",getCarByTitle);
postRouter.get("/searchD/:desc",getCarByDesc);
postRouter.get("/searchTag/:tags",getCarByTags);

module.exports = postRouter;