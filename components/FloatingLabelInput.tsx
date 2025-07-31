import React from 'react';
import styled from 'styled-components';

interface FloatingLabelInputProps {
  id?: string;
  name?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  name,
  value,
  onChange,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  min,
  max
}) => {
  return (
    <StyledWrapper>
      <div className="input-group">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className="input"
          min={min}
          max={max}
        />
        <label className="user-label">{label}</label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .input-group {
    position: relative;
    width: 100%;
  }

  .input {
    width: 100%;
    border: solid 1.5px #9e9e9e;
    border-radius: 1rem;
    background: none;
    padding: 1rem;
    font-size: 1rem;
    color: #f5f5f5;
    transition: border 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .user-label {
    position: absolute;
    left: 15px;
    top: 0;
    color: #e8e8e8;
    pointer-events: none;
    transform: translateY(1rem);
    transition: 150ms cubic-bezier(0.4,0,0.2,1);
  }

  .input:focus, .input:valid {
    outline: none;
    border: 1.5px solid #1a73e8;
  }

  .input:focus ~ .user-label, .input:valid ~ .user-label {
    transform: translateY(-50%) scale(0.8);
    background-color: #212121;
    padding: 0 .2em;
    color: #2196f3;
  }
`;

export default FloatingLabelInput;
