import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  QueryConstraint
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from './firebase';

// Generic function to get a document by ID
export const getDocument = async <T>(
  collectionName: string,
  documentId: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as T;
  }
  return null;
};

// Generic function to get all documents in a collection
export const getDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as T[];
};

// Generic function to create or update a document
export const setDocument = async <T>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> => {
  const docRef = doc(db, collectionName, documentId);
  await setDoc(docRef, data as DocumentData, { merge: true });
};

// Generic function to update a document
export const updateDocument = async <T>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionName, documentId);
  await updateDoc(docRef, data as DocumentData);
};

// Helper function to create a where constraint
export const createWhereConstraint = (field: string, operator: string, value: any) => {
  return where(field, operator as any, value);
}; 