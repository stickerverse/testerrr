import type React from 'react';

export interface Material {
  id: string;
  name: string;
  image: string;
  pricePerUnit: number;
  description: string;
}

export type ShapeId = 'die-cut' | 'circle' | 'square' | 'rounded-square' | 'rectangle' | 'oval';

export interface Shape {
    id: ShapeId;
    name: string;
    icon: React.ReactNode;
}

export type EditorTabId = 'upload' | 'cutline' | 'material' | 'text' | 'cliparts';

export interface EditorTab {
  id: EditorTabId;
  label: string;
  icon: React.ReactNode;
}