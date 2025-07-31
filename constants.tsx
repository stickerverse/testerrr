import React from 'react';
import type { Material, EditorTab, Shape } from './types';

// Icons for the editor navigation
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h18v-3.75M4.5 12.75l7.5-7.5 7.5 7.5" />
  </svg>
);

const CutlineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.846 1.154a.75.75 0 011.06 0l1.373 1.373a.75.75 0 010 1.06L3.39 10.474a.75.75 0 01-1.06 0L1.154 9.297a.75.75 0 010-1.06l6.692-6.693zm11.382 11.382a.75.75 0 010 1.06l-6.693 6.693a.75.75 0 01-1.06 0l-1.176-1.177a.75.75 0 010-1.06l6.88-6.88a.75.75 0 011.06 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 10.5l8.25-8.25" />
  </svg>
);


const MaterialIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75c-.621 0-1.125-.504-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375V17.25" />
  </svg>
);

const TextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3v18M16.5 3v18M3 8.25h18M3 15.75h18" />
  </svg>
);

const ClipartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

// Icons for the shape selector
const ShapeIconBase = ({ children }: { children: React.ReactNode }) => (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);
const DieCutIcon = () => <ShapeIconBase><path d="M8.2 1.81c.21-.88.62-1.28 1.28-.95.49.25 1.43-.22 2.22-.54.95-.38 1.4.15 1.76.91s.38 1.51.98 1.94c.7.49 1.58.38 2.11-.27s.82-1.34 1.5-1.7c.8-.42 1.48-.15 1.84.55.42.8-.22 1.74-.47 2.52s-.12 1.52.4 2.2c.57.75 1.4.92 1.76 1.6.43.8-.15 1.68-.79 2.13s-1.35.63-1.63 1.42c-.32.9.06 1.7.75 2.13.6.36 1.06 1.2.94 2.03s-.73 1.4-1.54 1.5c-.9.12-1.63-.52-2.39-.74-.84-.24-1.67.15-2.22.8s-1.04 1.28-1.92 1.45c-.9.18-1.7-.35-2.2-1.12s-.75-1.52-1.52-1.77c-.84-.28-1.7.13-2.2.86s-1.04 1.34-1.9 1.48c-.92.15-1.74-.42-2.2-1.2s-.7-1.52-1.48-1.7c-.85-.2-1.67.28-2.13 1s-1.02 1.28-1.8 1.2c-.88-.1-1.45-.8-1.5-1.68s.3-1.6.8-2.25c.53-.7.55-1.68.16-2.42s-1.1-1.2-1.2-2.08.4-1.58 1.1-1.9c.78-.36 1.25-1.23 1.18-2.08S2.8 3.82 2.14 3.44s-1.1-.98-.9-1.84.88-1.4 1.7-1.48S4.5.6 5.12.82c.7.25 1.54-.12 2.1-.7.6-.64 1.25-1.02 2.08-.8Z"/></ShapeIconBase>;
const CircleIcon = () => <ShapeIconBase><circle cx="12" cy="12" r="10"/></ShapeIconBase>;
const SquareIcon = () => <ShapeIconBase><rect x="3" y="3" width="18" height="18"/></ShapeIconBase>;
const RoundedSquareIcon = () => <ShapeIconBase><rect x="3" y="3" width="18" height="18" rx="4"/></ShapeIconBase>;
const RectangleIcon = () => <ShapeIconBase><rect x="2" y="7" width="20" height="10"/></ShapeIconBase>;
const OvalIcon = () => <ShapeIconBase><ellipse cx="12" cy="12" rx="10" ry="7"/></ShapeIconBase>;


export const EDITOR_TABS: EditorTab[] = [
  { id: 'upload', label: 'Upload file', icon: <UploadIcon /> },
  { id: 'cutline', label: 'Cutline', icon: <CutlineIcon /> },
  { id: 'material', label: 'Material', icon: <MaterialIcon /> },
  { id: 'text', label: 'Insert text', icon: <TextIcon /> },
  { id: 'cliparts', label: 'Cliparts', icon: <ClipartIcon /> },
];

export const SHAPES: Shape[] = [
    { id: 'die-cut', name: 'Die Cut', icon: <DieCutIcon /> },
    { id: 'circle', name: 'Circle', icon: <CircleIcon /> },
    { id: 'square', name: 'Square', icon: <SquareIcon /> },
    { id: 'rounded-square', name: 'Rounded Square', icon: <RoundedSquareIcon /> },
    { id: 'rectangle', name: 'Rectangle', icon: <RectangleIcon /> },
    { id: 'oval', name: 'Oval', icon: <OvalIcon /> },
];

export const MATERIALS: Material[] = [
  {
    id: 'vinyl',
    name: 'Vinyl',
    image: 'https://i.imgur.com/95n5d6f.png',
    pricePerUnit: 0.25,
    description: 'Our most popular, all-purpose material. Durable, waterproof, and ideal for any surface.',
  },
  {
    id: 'holographic',
    name: 'Holographic',
    image: 'https://i.imgur.com/9nCeAdG.png',
    pricePerUnit: 0.60,
    description: 'An eye-catching material with a vibrant, rainbow-like sheen that changes with light.',
  },
  {
    id: 'transparent',
    name: 'Transparent',
    image: 'https://i.imgur.com/u5aY2Rq.png',
    pricePerUnit: 0.35,
    description: 'A clear material that makes your design pop, leaving the background visible.',
  },
  {
    id: 'glitter',
    name: 'Glitter',
    image: 'https://i.imgur.com/fplwT7N.png',
    pricePerUnit: 0.5303,
    description: 'A sparkly, textured finish that adds a dazzling and fun effect to your design.',
  },
  {
    id: 'mirror',
    name: 'Mirror',
    image: 'https://i.imgur.com/Fw5s62H.png',
    pricePerUnit: 0.75,
    description: 'A highly reflective, chrome-like material that creates a bold, shiny look.',
  },
  {
    id: 'pixie_dust',
    name: 'Pixie Dust',
    image: 'https://i.imgur.com/oB0yUJW.png',
    pricePerUnit: 0.80,
    description: 'A magical, iridescent glitter that shimmers with a fine, enchanting sparkle.',
  },
  {
    id: 'prismatic',
    name: 'Prismatic',
    image: 'https://i.imgur.com/E1r3h58.png',
    pricePerUnit: 0.65,
    description: 'A stunning material with a "shattered glass" holographic effect that reflects light beautifully.',
  },
  {
    id: 'brushed_aluminum',
    name: 'Brushed Aluminum',
    image: 'https://i.imgur.com/NvlXGfl.png',
    pricePerUnit: 0.70,
    description: 'A sophisticated metallic material with a textured, brushed finish for a premium look.',
  },
];