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
exports.getProductById = exports.getAllproducts = exports.addProduct = exports.logout = exports.login = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const entities_1 = require("./entities");
const node_cache_1 = __importDefault(require("node-cache"));
const cache = new node_cache_1.default({ stdTTL: 300 });
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userRepository = db_1.AppDataSource.getRepository(entities_1.User);
        const existingUser = yield userRepository.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = userRepository.create({ email, passwordHash: hashedPassword });
        yield userRepository.save(user);
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.registerUser = registerUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userRepository = db_1.AppDataSource.getRepository(entities_1.User);
        const user = yield userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        user.sessionToken = null;
        yield userRepository.save(user);
        const sessionToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "2m" });
        user.sessionToken = sessionToken;
        yield userRepository.save(user);
        res.cookie("token", sessionToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        res.status(200).json({ message: "Login successful" });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.logout = logout;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description } = req.body;
        const productRepository = db_1.AppDataSource.getRepository(entities_1.Product);
        const existingProduct = yield productRepository.findOne({ where: { name } });
        if (existingProduct) {
            res.status(400).json({ message: "Product already exists" });
            return;
        }
        const product = productRepository.create({ name, price, description });
        yield productRepository.save(product);
        res.status(201).json({ message: "Product added successfully", data: product });
    }
    catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.addProduct = addProduct;
const getAllproducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cachedData = cache.get("products");
        if (cachedData) {
            res.status(200).json({ data: cachedData, cached: true });
            return;
        }
        const productRepository = db_1.AppDataSource.getRepository(entities_1.Product);
        const products = yield productRepository.find();
        if (products.length === 0) {
            res.status(404).json({ message: "No products available" });
            return;
        }
        cache.set("products", products);
        res.status(200).json({ data: products });
    }
    catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.getAllproducts = getAllproducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productRepository = db_1.AppDataSource.getRepository(entities_1.Product);
        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            res.status(400).json({ message: "Invalid product ID" });
            return;
        }
        const product = yield productRepository.findOne({ where: { id: productId } });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ data: product });
    }
    catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ message: "Internal server error", error: err });
    }
});
exports.getProductById = getProductById;
