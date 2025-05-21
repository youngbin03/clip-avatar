import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { colors } from '../../styles/theme';
import Button from '../common/Button';
import Card from '../common/Card';
import Container from '../common/Container';
import AvatarGenerator from './AvatarGenerator';
import { addClubMemberWithAvatar } from '../../firebase/services';
import { useClubs } from '../../context/ClubContext';

const MemberAvatarCreator = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const { clubs } = useClubs();
  const [memberName, setMemberName] = useState('');
  const [showAvatarGenerator, setShowAvatarGenerator] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 현재 클럽 정보 가져오기
  const currentClub = clubs.find(club => club.id === clubId);
  
  const handleOpenAvatarGenerator = () => {
    setShowAvatarGenerator(true);
  };
  
  const handleCloseAvatarGenerator = () => {
    setShowAvatarGenerator(false);
  };
  
  const handleAvatarGenerated = (generatedAvatarUrl: string) => {
    setAvatarUrl(generatedAvatarUrl);
    setShowAvatarGenerator(false);
  };
  
  const handleAddMember = async () => {
    if (!clubId || !memberName.trim()) {
      setError('멤버 이름을 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 멤버 추가 함수 호출
      await addClubMemberWithAvatar(
        clubId, 
        { name: memberName }, 
        avatarUrl || undefined
      );
      
      // 멤버 추가 성공 시 클럽 페이지로 이동
      navigate(`/clubs/${clubId}`);
    } catch (err) {
      console.error('멤버 추가 실패:', err);
      setError('멤버 추가 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container>
      <PageHeader>
        <Title>멤버 추가하기</Title>
        {currentClub && (
          <ClubName>클럽: {currentClub.name}</ClubName>
        )}
      </PageHeader>
      
      <StyledCard>
        <FormGroup>
          <Label>이름</Label>
          <Input 
            type="text" 
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="멤버 이름을 입력하세요"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>프로필 이미지</Label>
          <AvatarSection>
            {avatarUrl ? (
              <AvatarPreview>
                <AvatarImage src={avatarUrl} alt="생성된 아바타" />
                <ChangeButton 
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenAvatarGenerator}
                >
                  변경하기
                </ChangeButton>
              </AvatarPreview>
            ) : (
              <AvatarPlaceholder
                as={motion.div}
                whileHover={{ scale: 1.05 }}
                onClick={handleOpenAvatarGenerator}
              >
                <PlaceholderIcon>+</PlaceholderIcon>
                <PlaceholderText>AI 아바타 만들기</PlaceholderText>
              </AvatarPlaceholder>
            )}
          </AvatarSection>
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ButtonGroup>
          <Button 
            variant="outlined" 
            onClick={() => navigate(`/clubs/${clubId}`)}
          >
            취소
          </Button>
          <Button 
            onClick={handleAddMember}
            disabled={isLoading || !memberName.trim()}
          >
            {isLoading ? '처리 중...' : '멤버 추가하기'}
          </Button>
        </ButtonGroup>
      </StyledCard>
      
      {showAvatarGenerator && (
        <AvatarGenerator 
          onAvatarGenerated={handleAvatarGenerated}
          onCancel={handleCloseAvatarGenerator}
        />
      )}
    </Container>
  );
};

const PageHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${colors.gray70};
  margin-bottom: 8px;
`;

const ClubName = styled.p`
  font-size: 16px;
  color: ${colors.gray60};
`;

const StyledCard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px;
`;

const FormGroup = styled.div`
  margin-bottom: 30px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: ${colors.gray70};
  margin-bottom: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${colors.gray30};
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${colors.bandiBlue55};
    box-shadow: 0 0 0 2px rgba(104, 131, 245, 0.2);
  }
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  background-color: ${colors.gray10};
  border: 2px dashed ${colors.gray40};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.bandiBlue55};
    background-color: rgba(104, 131, 245, 0.1);
  }
`;

const PlaceholderIcon = styled.span`
  font-size: 32px;
  color: ${colors.gray50};
  margin-bottom: 4px;
`;

const PlaceholderText = styled.span`
  font-size: 14px;
  color: ${colors.gray60};
  text-align: center;
  padding: 0 8px;
`;

const AvatarPreview = styled.div`
  position: relative;
`;

const AvatarImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid ${colors.bandiBlue35};
`;

const ChangeButton = styled.button`
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 6px 0;
  width: 100%;
  font-size: 14px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${AvatarPreview}:hover & {
    opacity: 1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  background-color: ${colors.errorLight};
  color: ${colors.error};
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
`;

export default MemberAvatarCreator; 