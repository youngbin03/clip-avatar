import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import ClubDetail from '../components/clubs/ClubDetail';
import { useClubs } from '../context/ClubContext';
import type { Club, Activity } from '../types';
import { colors } from '../styles/theme';
import { mockClubs } from '../data/mockData';

const ClubPage = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const { getClub, addClubMember, addClubActivity, subscribeToClubData, useMockDataEnabled } = useClubs();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 최초 로딩 시 mock 데이터에서 club 정보 가져오기
  useEffect(() => {
    if (!clubId) return;
    
    // 페이지 최초 로딩 시 mock 데이터에서 먼저 표시 (로딩 시간 단축)
    const mockClub = mockClubs.find(c => c.id === clubId);
    if (mockClub) {
      setClub(mockClub);
      setLoading(false);
    }
    
    // 이후 실시간 데이터 구독
    const unsubscribe = subscribeToClubData(clubId, (updatedClub) => {
      if (updatedClub) {
        setClub(updatedClub);
      }
      setLoading(false);
    });
    
    return unsubscribe;
  }, [clubId, subscribeToClubData, useMockDataEnabled]);

  const handleAddActivity = async (activityData: Omit<Activity, 'id'>) => {
    if (!club || !clubId) return;
    
    try {
      await addClubActivity(clubId, activityData);
      // 실시간 업데이트가 자동으로 이루어집니다
    } catch (err) {
      setError('활동을 추가하는데 실패했습니다.');
    }
  };

  const handleAddMember = async (name: string) => {
    if (!club || !clubId) return;
    
    try {
      const defaultCharacters = [
        '/src/assets/characters/blue_character1.png',
        '/src/assets/characters/blue_character2.png',
        '/src/assets/characters/blue_character3.png',
        '/src/assets/characters/blue_character4.png',
        '/src/assets/characters/yellow_character1.png',
        '/src/assets/characters/yellow_character2.png',
        '/src/assets/characters/yellow_character3.png',
        '/src/assets/characters/yellow_character4.png'
      ];
      
      const memberData = {
        name,
        profileImage: defaultCharacters[Math.floor(Math.random() * defaultCharacters.length)]
      };
      
      await addClubMember(clubId, memberData);
      // 실시간 업데이트가 자동으로 이루어집니다
    } catch (err) {
      setError('멤버를 추가하는데 실패했습니다!');
    }
  };

  if (loading && !club) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingText>동아리 정보를 불러오고 있어요...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <Button onClick={() => navigate('/clubs')}>동아리 목록으로</Button>
        </ErrorContainer>
      </Container>
    );
  }

  if (!club) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorText>해당 동아리를 찾을 수 없습니다.</ErrorText>
          <Button onClick={() => navigate('/clubs')}>동아리 목록으로</Button>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <ClubDetail 
        club={club} 
        onAddActivity={handleAddActivity} 
        onAddMember={handleAddMember}
      />
    </Container>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const LoadingText = styled.p`
  font-size: 18px;
  color: ${colors.gray50};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  gap: 24px;
`;

const ErrorText = styled.p`
  font-size: 20px;
  color: ${colors.gray60};
  font-weight: 600;
`;

export default ClubPage; 