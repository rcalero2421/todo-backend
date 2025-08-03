import { IUserRepository } from '@domain/repositories/IUserRepository';
import { User } from '@domain/entities/User';
import { db } from '@infrastructure/config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export class FirebaseUserRepository implements IUserRepository {
  private userRef = collection(db, 'users');

  async create(user: User): Promise<User> {
    await addDoc(this.userRef, { ...user });
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const q = query(this.userRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const data = snapshot.docs[0].data();
    return new User(snapshot.docs[0].id, data.name, data.email, data.role);
  }
}
