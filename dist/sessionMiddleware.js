"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const entities_1 = require("./entities");
const sessionMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized. No session token provided." });
            return;
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            res.status(401).json({ message: "Session expired. Please log in again." });
            return;
        }
        const userId = parseInt(decoded.id, 10);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid token payload" });
            return;
        }
        const userRepository = db_1.AppDataSource.getRepository(entities_1.User);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user || !user.sessionToken || user.sessionToken !== token) {
            res.status(401).json({ message: "Session expired. Please log in again." });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        console.error("Session validation error:", err);
        res.status(401).json({ message: "Invalid token" });
    }
});
exports.default = sessionMiddleware;
