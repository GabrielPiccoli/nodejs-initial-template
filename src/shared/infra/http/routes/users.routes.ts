import { Router } from "express";

import { CreateUserController } from "@modules/users/useCases/createUser/CreateUserController";
import { DeleteUserController } from "@modules/users/useCases/deleteUser/DeleteUserController";
import { GetUserController } from "@modules/users/useCases/getUser/GetUserController";
import { ListUsersController } from "@modules/users/useCases/listUsers/ListUsersController";
import { UpdateUserController } from "@modules/users/useCases/updateUser/UpdateUserController";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const usersRoutes = Router();

const listUsersController = new ListUsersController();
const getUserController = new GetUserController();
const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();

usersRoutes.get("/", ensureAuthenticated, listUsersController.handle);
usersRoutes.get("/me", ensureAuthenticated, getUserController.handle);
usersRoutes.post("/", ensureAuthenticated, createUserController.handle);
usersRoutes.put("/:id", ensureAuthenticated, updateUserController.handle);
usersRoutes.delete("/:id", ensureAuthenticated, deleteUserController.handle);

export { usersRoutes };
