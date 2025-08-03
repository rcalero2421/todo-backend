import { db } from '@infrastructure/config/firebase';
import { ITaskRepository } from '@domain/repositories/task.repository';
import { Task } from '@domain/entities/task';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';

export class FirebaseTaskRepository implements ITaskRepository {
  private getUserTasksCollection(userId: string) {
    return collection(db, 'users', userId, 'tasks');
  }

  async create(task: Task): Promise<void> {
    const taskRef = this.getUserTasksCollection(task.userId);
    const { id, ...taskData } = task;
    const docRef = await addDoc(taskRef, { ...taskData });
    task.id = docRef.id;
  }

  async update(task: Task): Promise<void> {
    if (!task.id) throw new Error('Task ID is required');
    const docRef = doc(db, 'users', task.userId, 'tasks', task.id);
    await updateDoc(docRef, { ...task });
  }

  async delete(id: string, userId: string): Promise<void> {
    const docRef = doc(db, 'users', userId, 'tasks', id);
    await deleteDoc(docRef);
  }

  async getById(id: string, userId: string): Promise<Task | null> {
    const docRef = doc(db, 'users', userId, 'tasks', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Task;
  }

  async getByUserId(userId: string, status?: string): Promise<Task[]> {
    const taskRef = this.getUserTasksCollection(userId);

    let q;
    if (status) {
      q = query(
        taskRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        taskRef,
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return new Task(
        doc.id,
        data.title,
        data.description,
        data.status,
        data.userId,
        data.createdAt.toDate(),
        data.updatedAt.toDate()
      );
    });

  }
}
