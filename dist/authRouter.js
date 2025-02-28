"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const controller_1 = require("./controller");
const validator_1 = require("./validator");
const sessionMiddleware_1 = __importDefault(require("./sessionMiddleware"));
router.post("/register", validator_1.validateRegister, controller_1.registerUser);
router.post("/login", validator_1.validateLogin, controller_1.login);
router.post("/logout", controller_1.logout);
//Product Routes
router.post("/addproduct", sessionMiddleware_1.default, controller_1.addProduct);
router.get("/getAllproducts", sessionMiddleware_1.default, controller_1.getAllproducts);
router.get("/getProductById/:id", sessionMiddleware_1.default, controller_1.getProductById);
exports.default = router;
