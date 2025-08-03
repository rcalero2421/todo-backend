import request from 'supertest';
import app from '../../src/app';
import { db } from '@infrastructure/config/firebase';
import { collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';

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
        let userRes = await request(app).post('/api/users').send(testUser);

        if (userRes.status === 409) {
            userRes = await request(app).get(`/api/users/${testUser.email}`);
        }
        userId = userRes.body.data.user.id;
        token = userRes.body.data.token;
    });

    afterAll(async () => {
        const q = query(collection(db, 'tasks'), where('userId', '==', testUser.email));
        const snapshot = await getDocs(q);
        const deletes = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletes);
    });

    it('should create a task [201]', async () => {
        const res = await request(app)
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
        const res = await request(app)
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
        const res = await request(app)
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
        const res = await request(app)
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
