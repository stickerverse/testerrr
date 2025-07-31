import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import { Material, ShapeId } from '../types';

// Define types for our database models
export interface StickerDesign {
  id?: string;
  userId: string;
  name: string;
  width: number;
  height: number;
  quantity: number;
  materialId: string;
  shapeId: ShapeId;
  imageUrl: string;
  comment?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CartItem {
  id?: string;
  userId: string;
  designId: string;
  quantity: number;
  price: number;
  createdAt?: Timestamp;
}

// Sticker Designs Collection
const designsCollection = collection(db, 'designs');

// Save a new design
export async function saveDesign(userId: string, designData: Omit<StickerDesign, 'userId' | 'createdAt' | 'updatedAt'>) {
  // First, upload the image if it's a data URL
  let imageUrl = designData.imageUrl;
  
  if (imageUrl.startsWith('data:')) {
    // This is a base64 data URL, so we need to upload it to storage
    const storageRef = ref(storage, `designs/${userId}/${Date.now()}`);
    await uploadString(storageRef, imageUrl, 'data_url');
    imageUrl = await getDownloadURL(storageRef);
  }
  
  // Create the design document
  const designToSave: Omit<StickerDesign, 'id'> = {
    ...designData,
    userId,
    imageUrl,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp
  };
  
  const docRef = await addDoc(designsCollection, designToSave);
  return { id: docRef.id, ...designToSave };
}

// Get designs for a user
export async function getUserDesigns(userId: string) {
  const q = query(designsCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as StickerDesign[];
}

// Get a single design by ID
export async function getDesign(designId: string) {
  const designDoc = await getDoc(doc(designsCollection, designId));
  
  if (!designDoc.exists()) {
    throw new Error('Design not found');
  }
  
  return {
    id: designDoc.id,
    ...designDoc.data()
  } as StickerDesign;
}

// Update an existing design
export async function updateDesign(designId: string, updateData: Partial<StickerDesign>) {
  const designRef = doc(designsCollection, designId);
  
  // Handle image upload if it's a new data URL
  if (updateData.imageUrl && updateData.imageUrl.startsWith('data:')) {
    const designDoc = await getDoc(designRef);
    if (!designDoc.exists()) {
      throw new Error('Design not found');
    }
    
    const design = designDoc.data() as StickerDesign;
    const storageRef = ref(storage, `designs/${design.userId}/${Date.now()}`);
    await uploadString(storageRef, updateData.imageUrl, 'data_url');
    updateData.imageUrl = await getDownloadURL(storageRef);
  }
  
  await updateDoc(designRef, {
    ...updateData,
    updatedAt: serverTimestamp()
  });
  
  return getDesign(designId);
}

// Delete a design
export async function deleteDesign(designId: string) {
  const designRef = doc(designsCollection, designId);
  await deleteDoc(designRef);
  return true;
}

// Cart functionality
const cartCollection = collection(db, 'cart');

// Add item to cart
export async function addToCart(userId: string, designId: string, quantity: number, price: number) {
  const cartItem: Omit<CartItem, 'id'> = {
    userId,
    designId,
    quantity,
    price,
    createdAt: serverTimestamp() as Timestamp
  };
  
  const docRef = await addDoc(cartCollection, cartItem);
  return { id: docRef.id, ...cartItem };
}

// Get cart items for a user
export async function getCartItems(userId: string) {
  const q = query(cartCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as CartItem[];
}

// Remove item from cart
export async function removeFromCart(cartItemId: string) {
  const cartItemRef = doc(cartCollection, cartItemId);
  await deleteDoc(cartItemRef);
  return true;
}

// Update cart item quantity
export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const cartItemRef = doc(cartCollection, cartItemId);
  await updateDoc(cartItemRef, { quantity });
  return true;
}
