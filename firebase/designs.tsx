import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './auth';
import { saveDesign, getUserDesigns, getDesign, updateDesign, deleteDesign, addToCart } from './db';
import type { StickerDesign } from './db';
import type { ShapeId } from '../types';

interface DesignContextProps {
  loading: boolean;
  userDesigns: StickerDesign[];
  saveDesignToFirebase: (design: {
    name: string;
    width: number;
    height: number;
    quantity: number;
    materialId: string;
    shapeId: ShapeId;
    imageUrl: string;
    comment?: string;
  }) => Promise<StickerDesign>;
  loadUserDesigns: () => Promise<void>;
  getDesignById: (id: string) => Promise<StickerDesign>;
  updateUserDesign: (id: string, data: Partial<StickerDesign>) => Promise<StickerDesign>;
  deleteUserDesign: (id: string) => Promise<boolean>;
  addToUserCart: (designId: string, quantity: number, price: number) => Promise<void>;
}

const DesignContext = createContext<DesignContextProps | undefined>(undefined);

export function useDesigns() {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesigns must be used within a DesignProvider');
  }
  return context;
}

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [userDesigns, setUserDesigns] = useState<StickerDesign[]>([]);
  const { currentUser } = useAuth();

  async function saveDesignToFirebase(designData: {
    name: string;
    width: number;
    height: number;
    quantity: number;
    materialId: string;
    shapeId: ShapeId;
    imageUrl: string;
    comment?: string;
  }) {
    if (!currentUser) {
      throw new Error('You must be logged in to save a design');
    }

    setLoading(true);
    try {
      const savedDesign = await saveDesign(currentUser.uid, designData);
      // Update the local designs array
      setUserDesigns(prev => [...prev, savedDesign]);
      return savedDesign;
    } finally {
      setLoading(false);
    }
  }

  async function loadUserDesigns() {
    if (!currentUser) {
      return;
    }

    setLoading(true);
    try {
      const designs = await getUserDesigns(currentUser.uid);
      setUserDesigns(designs);
    } finally {
      setLoading(false);
    }
  }

  async function getDesignById(id: string) {
    if (!currentUser) {
      throw new Error('You must be logged in to get a design');
    }

    setLoading(true);
    try {
      return await getDesign(id);
    } finally {
      setLoading(false);
    }
  }

  async function updateUserDesign(id: string, data: Partial<StickerDesign>) {
    if (!currentUser) {
      throw new Error('You must be logged in to update a design');
    }

    setLoading(true);
    try {
      const updatedDesign = await updateDesign(id, data);
      // Update the local designs array
      setUserDesigns(prev => 
        prev.map(design => design.id === id ? updatedDesign : design)
      );
      return updatedDesign;
    } finally {
      setLoading(false);
    }
  }

  async function deleteUserDesign(id: string) {
    if (!currentUser) {
      throw new Error('You must be logged in to delete a design');
    }

    setLoading(true);
    try {
      const success = await deleteDesign(id);
      if (success) {
        // Remove from local designs array
        setUserDesigns(prev => prev.filter(design => design.id !== id));
      }
      return success;
    } finally {
      setLoading(false);
    }
  }

  async function addToUserCart(designId: string, quantity: number, price: number) {
    if (!currentUser) {
      throw new Error('You must be logged in to add to cart');
    }

    setLoading(true);
    try {
      await addToCart(currentUser.uid, designId, quantity, price);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    loading,
    userDesigns,
    saveDesignToFirebase,
    loadUserDesigns,
    getDesignById,
    updateUserDesign,
    deleteUserDesign,
    addToUserCart
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
}
