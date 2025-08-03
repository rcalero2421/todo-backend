import request from 'supertest';
import app from '../../src/app';
import { collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '@infrastructure/config/firebase';

describe('UserController', () => {
    const validUser = {
        name: 'John Doe',
        email: 'user@example.com',
        role: 'user',
    };

    afterAll(async () => {
        const q = query(collection(db, 'users'), where('email', '==', validUser.email));
        const snapshot = await getDocs(q);
        const deletes = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletes);
    });

    it('should create a user successfully [201]', async () => {
        const res = await request(app).post('/api/users').send(validUser);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({
            code: 201,
            status: 'success',
            message: 'User created',
        });
    });

    it('should return 409 for duplicate email', async () => {
        const res = await request(app).post('/api/users').send(validUser);
        expect(res.status).toBe(409);
        expect(res.body).toMatchObject({
            code: 409,
            status: 'error',
        });
    });

    it('should return 400 for invalid email on creation', async () => {
        const res = await request(app).post('/api/users').send({
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
        const res = await request(app).get(`/api/users/${validUser.email}`);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            code: 200,
            status: 'success',
            message: 'User found',
            data: expect.objectContaining({
                email: validUser.email,
            }),
        });
    });

    it('should return 404 for non-existing user', async () => {
        const res = await request(app).get(`/api/users/nonexistent@example.com`);
        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({
            code: 404,
            status: 'error',
            message: 'User not found',
        });
    });
});
