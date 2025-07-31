import React from 'react';
import styled from 'styled-components';

interface ContextMenuProps {
  onDelete: () => void;
  onRemoveBg: () => void;
}

// Icons for the menu options
const RemoveBgIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5z" />
    <path d="M6 14l4-4 4 4h-3v-3l-1 1-1-1v3H6z" />
    <path d="M12.586 5.586a2 2 0 112.828 2.828l-3 3-1.414-1.414 3-3 .001-.001z" opacity="0.4"/>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const StyledWrapper = styled.div`
  .button-menu {
    cursor: pointer;
    position: absolute;
    z-index: 12;
    background-color: #ffdd00;
    border: 2px solid #1e1e1e;
    color: #1e1e1e;
    font-size: 30px;
    font-weight: 700;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    -webkit-box-shadow: 0px 3px 10px 0px rgba(16, 16, 16, 0.5);
    -moz-box-shadow: 0px 3px 10px 0px rgba(16, 16, 16, 0.5);
    box-shadow: 0px 3px 10px 0px rgba(16, 16, 16, 0.5);
    pointer-events: none;
  }

  .checkbox {
    width: 60px;
    height: 60px;
    opacity: 0;
    z-index: 10;
    cursor: pointer;
  }

  .option {
    position: absolute;
    background-color: #1e1e1e;
    border: 2px solid #ffdd00;
    color: #ffdd00;
    z-index: 5;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    cursor: pointer;
    font-weight: 700;
    transition: all 0.3s, z-index 0s;
    -webkit-box-shadow: 3px 3px 10px 0px rgba(16, 16, 16, 0.5);
    -moz-box-shadow: 3px 3px 10px 0px rgba(16, 16, 16, 0.5);
    box-shadow: 3px 3px 10px 0px rgba(16, 16, 16, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
  }

  .checkbox:hover ~ .button-menu,
  .checkbox:checked ~ .button-menu {
    background-color: #eccd00;
    scale: 0.98;
    box-shadow: none;
  }

  .checkbox:not(:checked) ~ .button-menu::before {
    content: "+";
  }

  .checkbox:checked ~ .button-menu::after {
    content: "-";
    scale: 0.98;
    box-shadow: none;
  }

  .checkbox:not(:checked) ~ .option {
    box-shadow: none;
  }

  .option:hover,
  .option:active,
  .option:focus {
    box-shadow: none;
    scale: 0.98;
  }

  .checkbox:checked ~ .option-a {
    transition-delay: 0.1s;
    transform: translateY(-90px);
    z-index: 20;
  }

  .checkbox:checked ~ .option-b {
    transition-delay: 0.2s;
    transform: translateY(-65px) translateX(65px);
    z-index: 20;
  }

  .checkbox:checked ~ .option-c {
    transition-delay: 0.3s;
    transform: translateX(90px);
    z-index: 20;
  }
  
  /* Custom colors for our specific buttons */
  .option-delete {
    background-color: #e53e3e;
    border-color: #fff;
    color: #fff;
  }
  
  .option-bg {
    background-color: #3182ce;
    border-color: #fff;
    color: #fff;
  }
  
  .option-settings {
    background-color: #805ad5;
    border-color: #fff;
    color: #fff;
  }
`;

export const ContextMenu: React.FC<ContextMenuProps> = ({ onDelete, onRemoveBg }) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div onMouseDown={handleMouseDown}>
      <StyledWrapper>
        <div>
          <input className="checkbox" type="checkbox" />
          <span className="button-menu" />
          <button 
            className="option-a option option-bg" 
            onClick={(e) => {
              e.stopPropagation();
              onRemoveBg();
            }}
            title="Remove Background"
          >
            <RemoveBgIcon />
          </button>
          <button 
            className="option-b option option-settings"
            onClick={(e) => {
              e.stopPropagation();
              // Additional settings could be added here
            }}
            title="Settings"
          >
            <SettingsIcon />
          </button>
          <button 
            className="option-c option option-delete" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete"
          >
            <DeleteIcon />
          </button>
        </div>
      </StyledWrapper>
    </div>
  );
};