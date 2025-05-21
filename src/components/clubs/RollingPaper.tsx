import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, gradients } from '../../styles/theme';
import type { Activity } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface RollingPaperProps {
  activity: Activity;
  isRollingPaper?: boolean;
}

const RollingPaper = ({ activity, isRollingPaper = false }: RollingPaperProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongContent = activity.content.length > 100;
  
  const formattedDate = formatDate(activity.createdAt);
  
  return (
    <RollingPaperWrapper
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      $isRollingPaper={isRollingPaper}
    >
      <RollingPaperContent isExpanded={isExpanded}>
        <Content>
          {isLongContent && !isExpanded 
            ? `${activity.content.substring(0, 100)}...` 
            : activity.content
          }
        </Content>
        
        {isLongContent && (
          <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '접기' : '더 보기'}
          </ExpandButton>
        )}
      </RollingPaperContent>
      
      <RollingPaperFooter>
        <AuthorInfo>
          <AuthorImage $isRollingPaper={isRollingPaper} />
          <Author>{activity.author}</Author>
        </AuthorInfo>
        <Date>{formattedDate}</Date>
      </RollingPaperFooter>
      
      <Corner $isRollingPaper={isRollingPaper} />
    </RollingPaperWrapper>
  );
};

const RollingPaperWrapper = styled.div<{ $isRollingPaper: boolean }>`
  width: calc(50% - 16px);
  margin: 0 8px 24px;
  position: relative;
  background-color: ${colors.white};
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  padding: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    margin: 0 0 16px;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: ${props => props.$isRollingPaper ? gradients.bandiGra3 : gradients.bandiGra2};
  }
`;

const RollingPaperContent = styled.div<{ isExpanded: boolean }>`
  margin-bottom: 16px;
  max-height: ${props => props.isExpanded ? '1000px' : '120px'};
  overflow: ${props => props.isExpanded ? 'visible' : 'hidden'};
  transition: max-height 0.4s ease;
`;

const Content = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${colors.gray60};
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${colors.bandiBlue55};
  font-size: 12px;
  font-weight: 600;
  padding: 6px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 8px;
  
  &:hover {
    color: ${colors.bandiPurple};
    text-decoration: underline;
  }
  
  &:after {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-right: 2px solid ${colors.bandiBlue55};
    border-bottom: 2px solid ${colors.bandiBlue55};
    margin-left: 4px;
    transform: rotate(45deg);
  }
`;

const RollingPaperFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid ${colors.gray20};
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AuthorImage = styled.div<{ $isRollingPaper: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$isRollingPaper ? gradients.bandiGra3 : gradients.bandiGra2};
`;

const Author = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.gray70};
`;

const Date = styled.span`
  font-size: 12px;
  color: ${colors.gray50};
`;

const Corner = styled.div<{ $isRollingPaper: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: white;
  z-index: 10;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 20px 20px 0;
    border-color: transparent ${props => props.$isRollingPaper ? colors.bandiPurple : colors.bandiBlue55} transparent transparent;
  }
`;

export default RollingPaper; 