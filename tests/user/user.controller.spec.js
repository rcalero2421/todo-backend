"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("@infrastructure/config/firebase");
describe('UserController', () => {
    const validUser = {
        name: 'John Doe',
        email: 'user@example.com',
        role: 'user',
    };
    afterAll(async () => {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'users'), (0, firestore_1.where)('email', '==', validUser.email));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const deletes = snapshot.docs.map((doc) => (0, firestore_1.deleteDoc)(doc.ref));
        await Promise.all(deletes);
    });
    it('should create a user successfully [201]', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/users').send(validUser);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            code: 201,
            status: 'success',
            message: 'User created',
        });
        expect(res.body.data).toMatchObject({
            user: expect.objectContaining({
                email: validUser.email,
                name: validUser.name,
                role: validUser.role,
            }),
        });
        expect(typeof res.body.data.token).toBe('string');
        expect(res.body.data.token.length).toBeGreaterThan(0);
    });
    it('should return 409 for duplicate email', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/users').send(validUser);
        expect(res.status).toBe(409);
        expect(res.body).toMatchObject({
            code: 409,
            status: 'error',
        });
    });
    it('should return 400 for invalid email on creation', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/api/users').send({
            name: 'Invalid',
            email: 'not-an-email',
            role: 'user',
        });
        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
            code: 400,
            status: 'error',
            message: 'Validation error',
        });
        expect(res.body.data[0]).toMatchObject({
            path: 'email',
            msg: expect.stringMatching(/invalid/i),
        });
    });
    it('should retrieve an existing user [200]', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get(`/api/users/${validUser.email}`);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            code: 200,
            status: 'success',
            message: 'User found',
        });
        expect(res.body.data).toMatchObject({
            user: expect.objectContaining({
                email: validUser.email,
                name: validUser.name,
                role: validUser.role,
            }),
        });
        expect(typeof res.body.data.token).toBe('string');
        expect(res.body.data.token.length).toBeGreaterThan(0);
    });
    it('should return 404 for non-existing user', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get(`/api/users/nonexistent@example.com`);
        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({
            code: 404,
            status: 'error',
            message: 'User not found',
        });
    });
});
