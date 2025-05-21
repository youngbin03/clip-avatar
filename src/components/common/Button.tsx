import styled, { css } from 'styled-components';
import { colors, gradients } from '../../styles/theme';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  full?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  full = false,
  disabled = false, 
  children, 
  onClick 
}: ButtonProps) => {
  return (
    <StyledButton 
      variant={variant} 
      size={size} 
      disabled={disabled} 
      $full={full} 
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{ variant: string; size: string; $full: boolean; }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  width: ${({ $full }) => $full ? '100%' : 'auto'};
  
  ${({ variant }) => {
    switch(variant) {
      case 'primary':
        return css`
          background: ${gradients.bandiGra3};
          color: ${colors.white};
          
          &:hover:not(:disabled) {
            box-shadow: 0 4px 12px rgba(69, 95, 209, 0.3);
            transform: translateY(-2px);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return css`
          background: ${gradients.bandiGra2};
          color: ${colors.white};
          
          &:hover:not(:disabled) {
            box-shadow: 0 4px 12px rgba(133, 91, 255, 0.3);
            transform: translateY(-2px);
          }
          &:active {
            transform: translateY(0);
          }
        `;
      case 'outlined':
        return css`
          background: transparent;
          color: ${colors.bandiBlue55};
          border: 2px solid ${colors.bandiBlue55};
          
          &:hover:not(:disabled) {
            background: rgba(69, 95, 209, 0.1);
          }
        `;
      default:
        return '';
    }
  }}
  
  ${({ size }) => {
    switch(size) {
      case 'small':
        return css`
          padding: 8px 16px;
          font-size: 14px;
        `;
      case 'medium':
        return css`
          padding: 12px 24px;
          font-size: 16px;
        `;
      case 'large':
        return css`
          padding: 16px 32px;
          font-size: 18px;
        `;
      default:
        return '';
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export default Button; 