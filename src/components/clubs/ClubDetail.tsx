import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { colors, gradients } from '../../styles/theme';
import type { Club, Activity } from '../../types';
import RollingPaper from './RollingPaper';
import Button from '../common/Button';
import Card from '../common/Card';
import { useNavigate } from 'react-router-dom';

// 기본 프로필 이미지 배열
const DEFAULT_PROFILE_IMAGES = [
  '/assets/characters/blue_character1.png',
  '/assets/characters/blue_character2.png',
  '/assets/characters/blue_character3.png',
  '/assets/characters/blue_character4.png',
  '/assets/characters/yellow_character1.png',
  '/assets/characters/yellow_character2.png',
  '/assets/characters/yellow_character3.png',
  '/assets/characters/yellow_character4.png'
];

// 랜덤 프로필 이미지 선택 함수
const getRandomProfileImage = () => {
  return DEFAULT_PROFILE_IMAGES[Math.floor(Math.random() * DEFAULT_PROFILE_IMAGES.length)];
};

interface ClubDetailProps {
  club: Club;
  onAddActivity: (activity: Activity) => void;
  onAddMember: (name: string) => void;
}

const ClubDetail = ({ club, onAddActivity, onAddMember }: ClubDetailProps) => {
  const [newActivityContent, setNewActivityContent] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  
  const navigate = useNavigate();

  // 이미지 오류 처리
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = getRandomProfileImage();
  };

  const handleAddActivity = () => {
    if (!newActivityContent.trim()) return;
    
    const newActivity: Activity = {
      id: uuidv4(),
      content: newActivityContent,
      author: '익명',
      createdAt: new Date().toISOString()
    };
    
    onAddActivity(newActivity);
    setNewActivityContent('');
    setShowActivityForm(false);
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    
    onAddMember(newMemberName);
    setNewMemberName('');
    setShowMemberForm(false);
  };

  const handleAddMemberWithAvatar = () => {
    navigate(`/clubs/${club.id}/add-member`);
  };

  return (
    <StyledClubDetail>
      <Header>
        <ClubHeader>
          <ClubTitle>{club.name}</ClubTitle>
          <ClubDescription>{club.description}</ClubDescription>
          <DepartmentBadge>소속: {club.department}</DepartmentBadge>
          <SolutionInfo>CLIP 동아리 운영관리 솔루션으로 관리되고 있어요</SolutionInfo>
        </ClubHeader>
        <MemberCount
          as={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          현재 멤버 {club.members.length}명
        </MemberCount>
      </Header>

      <Section>
        <SectionTitle>동아리 활동</SectionTitle>
        <AddButtonWrapper>
          <Button variant="secondary" onClick={() => setShowActivityForm(true)}>
            새 활동 추가하기
          </Button>
        </AddButtonWrapper>

        {showActivityForm && (
          <FormCard
            as={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <textarea
              value={newActivityContent}
              onChange={(e) => setNewActivityContent(e.target.value)}
              placeholder="새로운 동아리 활동을 기록해주세요"
              rows={4}
            />
            <ButtonGroup>
              <Button variant="outlined" onClick={() => setShowActivityForm(false)}>
                취소
              </Button>
              <Button onClick={handleAddActivity}>추가하기</Button>
            </ButtonGroup>
          </FormCard>
        )}

        <RollingPaperGrid>
          {club.activities && club.activities.length > 0 ? (
            club.activities.map((activity) => (
              <RollingPaper key={activity.id} activity={activity} />
            ))
          ) : (
            <EmptyState>아직 동아리 활동이 없습니다. 첫 활동을 추가해보세요!</EmptyState>
          )}
        </RollingPaperGrid>
      </Section>

      <Section>
        <SectionTitle>동아리 멤버</SectionTitle>
        <AddButtonWrapper>
          <ButtonContainer>
            <Button variant="secondary" onClick={() => setShowMemberForm(true)}>
              일반 멤버 추가
            </Button>
            <Button variant="primary" onClick={handleAddMemberWithAvatar}>
              AI 아바타로 추가
            </Button>
          </ButtonContainer>
        </AddButtonWrapper>

        {showMemberForm && (
          <FormCard
            as={motion.div}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="새 멤버 이름"
            />
            <ButtonGroup>
              <Button variant="outlined" onClick={() => setShowMemberForm(false)}>
                취소
              </Button>
              <Button onClick={handleAddMember}>추가하기</Button>
            </ButtonGroup>
          </FormCard>
        )}

        <MemberGrid>
          {club.members && club.members.length > 0 ? (
            club.members.map((member) => (
              <MemberCard key={member.id}>
                <MemberAvatar 
                  src={member.profileImage || getRandomProfileImage()} 
                  alt={member.name}
                  onError={handleImageError}
                />
                <MemberName>{member.name}</MemberName>
              </MemberCard>
            ))
          ) : (
            <EmptyState>아직 동아리 멤버가 없습니다. 첫 멤버를 추가해보세요!</EmptyState>
          )}
        </MemberGrid>
      </Section>
      
      {club.rollingPaper && club.rollingPaper.length > 0 && (
        <Section>
          <SectionTitle>롤링 페이퍼</SectionTitle>
          <RollingPaperGrid>
            {club.rollingPaper.map((paper) => (
              <RollingPaper key={paper.id} activity={paper} isRollingPaper />
            ))}
          </RollingPaperGrid>
        </Section>
      )}
    </StyledClubDetail>
  );
};

const StyledClubDetail = styled.div`
  padding: 20px 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const ClubHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const ClubTitle = styled.h1`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 8px;
  background: ${gradients.bandiGra2};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const ClubDescription = styled.p`
  font-size: 18px;
  color: ${colors.gray60};
  margin-bottom: 16px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const DepartmentBadge = styled.div`
  display: inline-block;
  padding: 6px 12px;
  background-color: ${colors.gray10};
  color: ${colors.gray70};
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin: 10px 0;
`;

const SolutionInfo = styled.div`
  font-size: 14px;
  color: ${colors.bandiBlue55};
  margin-top: 12px;
  padding: 8px 12px;
  background-color: ${colors.white};
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  
  &:before {
    content: "✓";
    margin-right: 8px;
    font-weight: bold;
  }
`;

const MemberCount = styled.div`
  display: inline-block;
  padding: 8px 16px;
  background: ${gradients.bandiGra3};
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
`;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: ${colors.gray70};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${gradients.bandiGra3};
  }
`;

const RollingPaperGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -16px;
`;

const AddButtonWrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-end;
`;

const FormCard = styled(Card)`
  margin-bottom: 24px;
  overflow: hidden;
  
  textarea, input {
    width: 100%;
    padding: 12px;
    border: 1px solid ${colors.gray20};
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 16px;
    
    &:focus {
      border-color: ${colors.bandiBlue35};
      box-shadow: 0 0 0 2px rgba(104, 131, 245, 0.2);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const MemberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
`;

const MemberCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const MemberAvatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 12px;
  object-fit: cover;
  background-color: ${colors.gray10};
`;

const MemberName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.gray60};
  text-align: center;
`;

const EmptyState = styled.div`
  width: 100%;
  padding: 30px;
  text-align: center;
  background-color: ${colors.gray10};
  border-radius: 12px;
  color: ${colors.gray50};
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export default ClubDetail; 