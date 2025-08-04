"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("@interfaces/routes"));
const _docs_1 = require("@docs");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
}));
app.use(express_1.default.json());
app.use('/api', routes_1.default);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(_docs_1.swaggerSpec));
app.get('/', (_req, res) => {
    res.send('Todo API is running');
});
describe('App Initialization', () => {
    it('GET / should return Todo API message', async () => {
        const res = await (0, supertest_1.default)(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('Todo API is running');
    });
    it('GET /docs should return Swagger HTML', async () => {
        const res = await (0, supertest_1.default)(app).get('/docs/');
        expect(res.status).toBe(200);
        expect(res.text).toContain('Swagger UI');
    });
});
