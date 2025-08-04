"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const firebase_1 = require("@infrastructure/config/firebase");
const firestore_1 = require("firebase/firestore");
describe('TaskController', () => {
    const testUser = {
        name: 'Task Tester',
        email: 'task@test.com',
        role: 'user',
    };
    let token = '';
    let userId = '';
    let taskId = '';
    beforeAll(async () => {
        let userRes = await (0, supertest_1.default)(app_1.default).post('/api/users').send(testUser);
        if (userRes.status === 409) {
            userRes = await (0, supertest_1.default)(app_1.default).get(`/api/users/${testUser.email}`);
        }
        userId = userRes.body.data.user.id;
        token = userRes.body.data.token;
    });
    afterAll(async () => {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'tasks'), (0, firestore_1.where)('userId', '==', testUser.email));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const deletes = snapshot.docs.map((doc) => (0, firestore_1.deleteDoc)(doc.ref));
        await Promise.all(deletes);
    });
    it('should create a task [201]', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
            title: 'Test task',
            description: 'A simple test task',
            status: 'todo',
            userId: userId,
        });
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            code: 201,
            status: 'success',
            message: 'Task created',
        });
        taskId = res.body.data.id;
    });
    it('should get tasks for the logged in user [200]', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/api/tasks/user')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            code: 200,
            status: 'success',
            message: 'Tasks found',
        });
        expect(Array.isArray(res.body.data)).toBe(true);
    });
    it('should update a task [200]', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
            id: taskId,
            title: 'Updated Task',
            description: 'Updated description',
            userId: userId,
            status: 'in_progress',
        });
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            code: 200,
            status: 'success',
            message: 'Task updated',
        });
    });
    it('should delete the task [200]', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            code: 200,
            status: 'success',
            message: 'Task deleted',
        });
    });
});
