import styled from 'styled-components';
import { colors } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlighted' | 'outlined';
  padding?: string;
  onClick?: () => void;
  width?: string;
  height?: string;
  animate?: boolean;
}

const Card = ({
  children,
  variant = 'default',
  padding = '20px',
  onClick,
  width,
  height,
  animate = false,
  ...props
}: CardProps) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      onClick={onClick}
      width={width}
      height={height}
      animate={animate}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

const StyledCard = styled.div<{
  variant: 'default' | 'highlighted' | 'outlined';
  padding: string;
  width?: string;
  height?: string;
  animate?: boolean;
}>`
  background: ${colors.white};
  border-radius: 16px;
  padding: ${({ padding }) => padding};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || 'auto'};
  transition: all 0.3s ease;
  
  ${({ variant }) => {
    switch (variant) {
      case 'default':
        return `
          border: 1px solid ${colors.gray20};
        `;
      case 'highlighted':
        return `
          border: 1px solid ${colors.bandiBlue35};
          box-shadow: 0 8px 24px rgba(69, 95, 209, 0.15);
        `;
      case 'outlined':
        return `
          background: transparent;
          border: 2px solid ${colors.bandiBlue55};
          box-shadow: none;
        `;
    }
  }}
  
  ${({ onClick }) => onClick && `
    cursor: pointer;
  `}
  
  ${({ animate }) => animate && `
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }
  `}
`;

export default Card; 