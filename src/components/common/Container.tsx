import styled from 'styled-components';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
  padding?: string;
}

const Container = ({
  children,
  maxWidth = '1200px',
  padding = '20px 20px',
  ...props
}: ContainerProps) => {
  return (
    <StyledContainer maxWidth={maxWidth} padding={padding} {...props}>
      {children}
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{
  maxWidth: string;
  padding: string;
}>`
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth};
  margin: 0 auto;
  padding: ${({ padding }) => padding};
`;

export default Container; 