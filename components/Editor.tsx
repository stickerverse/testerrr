import React from 'react';
import type { Material, EditorTabId, Shape, ShapeId } from '../types';
import { EDITOR_TABS } from '../constants';
import { MaterialPanel } from './panels/MaterialPanel';
import { UploadPanel } from './panels/UploadPanel';
import { CutlinePanel } from './panels/CutlinePanel';
import { TextPanel } from './panels/TextPanel';
import { ClipartPanel } from './panels/ClipartPanel';
import { ImageLibrary } from './panels/ImageLibrary';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <div className="outer-cont flex">
        <svg viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg">
          <g fill="none">
            <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
            <path d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2" fill="currentColor" />
          </g>
        </svg>
        Add To Cart
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .flex {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .outer-cont {
    padding: 12px 20px;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    position: relative;
    background: linear-gradient(90deg, #5bfcc4, #f593e4, #71a4f0);
    border-radius: 12px;
    color: #fff;
    transition: all 0.3s ease;
    box-shadow:
      inset 0px 0px 5px #ffffffa9,
      inset 0px 35px 30px #000,
      0px 5px 10px #000000cc;
    text-shadow: 1px 1px 1px #000;
  }
  .outer-cont::before {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    border-radius: 12px;
    filter: blur(0);
    z-index: -1;
    box-shadow: none;
    background: conic-gradient(
      #00000000 80deg,
      #40baf7,
      #f34ad7,
      #5bfcc4,
      #00000000 280deg
    );
    transition: all 0.3s ease;
  }
  .outer-cont:hover::before {
    filter: blur(15px);
  }
  .outer-cont:active::before {
    filter: blur(5px);
    transform: translateY(1px);
  }
  .outer-cont:active {
    box-shadow:
      inset 0px 0px 5px #ffffffa9,
      inset 0px 35px 30px #000;
    margin-top: 3px;
  }`;


interface EditorProps {
  comment: string;
  setComment: (val: string) => void;
  materials: Material[];
  selectedMaterial: Material;
  setSelectedMaterialId: (id: string) => void;
  activeTab: EditorTabId;
  setActiveTab: (id: EditorTabId) => void;
  totalPrice: number;
  setSelectedImage: (image: string | null) => void;
  shapes: Shape[];
  selectedShape: Shape;
  setSelectedShapeId: (id: ShapeId) => void;
}



export const Editor: React.FC<EditorProps> = (props) => {
  const renderActiveTabContent = () => {
    switch (props.activeTab) {
      case 'upload':
        return (
          <div className="upload-panel-container" id="upload-panel-container">
            <UploadPanel setSelectedImage={props.setSelectedImage} />
          </div>
        );
      case 'cutline':
        return (
          <CutlinePanel 
            shapes={props.shapes}
            selectedShape={props.selectedShape}
            setSelectedShapeId={props.setSelectedShapeId}
          />
        );
      case 'material':
        return (
          <MaterialPanel
            materials={props.materials}
            selectedMaterial={props.selectedMaterial}
            setSelectedMaterialId={props.setSelectedMaterialId}
          />
        );
      case 'text':
        return <TextPanel />;
      case 'cliparts':
        return <ClipartPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[550px] bg-black/20 backdrop-blur-2xl border-l border-white/5 h-full flex shadow-2xl">
      <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Die Cut Sticker</h1>
          <button className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
            CLOSE
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-8 shadow-lg backdrop-blur-sm">
              {renderActiveTabContent()}
          </div>
            
            {props.activeTab === 'upload' && (
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-lg backdrop-blur-sm">
                  <ImageLibrary setSelectedImage={props.setSelectedImage} />
              </div>
            )}

            <div className="bg-black/20 p-4 rounded-xl mt-auto shadow-xl backdrop-blur-lg border border-white/10">
                        <div className="flex justify-between items-center text-zinc-300 mb-2">
                            <span>{props.selectedMaterial.name}</span>
                            <span>${props.selectedMaterial.pricePerUnit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-white font-bold text-xl">
                            <span>Total amount</span>
                            <span>${props.totalPrice.toFixed(2)}</span>
                        </div>
            </div>
        </div>

        <div className="mt-6">
          <Button />
        </div>
      </div>
      
      <div className="w-32 bg-black/10 backdrop-blur-2xl border-l border-white/5 flex flex-col items-center py-4 space-y-3">
        {EDITOR_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => props.setActiveTab(tab.id)}
            aria-label={tab.label}
            className={`relative flex flex-col items-center justify-center w-28 h-24 rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 backdrop-blur-md border hover:scale-105 ${
              props.activeTab === tab.id
                ? 'bg-blue-500/10 text-white border-blue-400/80'
                : 'bg-white/5 text-zinc-400 border-transparent hover:bg-white/10 hover:text-white'
            }`}
          >
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-blue-400 rounded-r-full transition-all duration-300 shadow-lg shadow-blue-500/50 ${
                props.activeTab === tab.id ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
              }`}
              aria-hidden="true"
            />
            {tab.icon}
            <span className="text-xs mt-2 font-medium text-center leading-tight">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};