import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, gradients } from '../styles/theme';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useClubs } from '../context/ClubContext';
import type { Club, Member, Activity } from '../types';

const HomePage = () => {
  const navigate = useNavigate();
  const { rankedClubs, loading, error, createNewClub, addClubMember, addClubActivity } = useClubs();
  const [topClubs, setTopClubs] = useState<Club[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [activityContent, setActivityContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('/src/assets/characters/blue_character1.png');
  const [profileStep, setProfileStep] = useState(1);
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [clubDepartment, setClubDepartment] = useState("");
  const [isCreatingClub, setIsCreatingClub] = useState(false);
  const [isLoading, setLoading] = useState(false);

  // 멤버이름 랜덤 생성
  const generateRandomName = () => {
    const nicknames = [
      "꿈꾸는 나무", "안경잽이", "춤추는 고양이", "눈치코치 먹방러", "별빛 수집가",
      "코딩하는 펭귄", "도토리 마스터", "웃는 해바라기", "헤엄치는 펭귄", "과일 좋아",
      "행복한 미소", "아기 상어", "망고 덕후", "바람 소리", "낙엽 밟기",
      "구름 위의 산책", "나래 타임", "달님 친구", "양말 도둑", "유령 사냥꾼",
      "말랑말랑 젤리", "빙글빙글 팽이", "복숭아 소년", "투명 망토", "힐링 캠프",
      "티켓 수집가", "우주 여행자", "시간의 마법사", "마음의 소리", "멜로디 메이커"
    ];
    
    return nicknames[Math.floor(Math.random() * nicknames.length)];
  };

  // 상위 3개 클럽 설정
  useEffect(() => {
    if (rankedClubs.length > 0) {
      setTopClubs(rankedClubs.slice(0, 3));
    }
  }, [rankedClubs]);

  // 클럽 검색
  const filteredClubs = searchTerm
    ? rankedClubs.filter(club => club.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // 새 클럽 생성
  const handleCreateNewClub = async () => {
    if (!clubName.trim() || !clubDescription.trim() || !clubDepartment.trim()) {
      return;
    }
    
    try {
      setLoading(true); // 로딩 상태 활성화
      
      const newClub = await createNewClub({
        name: clubName,
        description: clubDescription,
        department: clubDepartment,
        members: [],
        activities: []
      });
      
      setSelectedClub(newClub);
      setProfileStep(2);
      setIsCreatingClub(false);
      setLoading(false); // 로딩 상태 비활성화
    } catch (err) {
      console.error('클럽 생성 실패:', err);
      setLoading(false); // 로딩 상태 비활성화
      alert('동아리 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 멤버 추가
  const handleAddMember = async () => {
    if (!selectedClub || !activityContent.trim()) return;
    
    try {
      // 멤버 추가
      const memberName = generateRandomName();
      await addClubMember(selectedClub.id, {
        name: memberName,
        profileImage: selectedImage
      });
      
      // 활동 추가
      await addClubActivity(selectedClub.id, {
        content: activityContent,
        author: memberName,
        createdAt: new Date().toISOString()
      });
      
      // 초기화
      resetForm();
      
      // 추가된 클럽으로 이동
      navigate(`/clubs/${selectedClub.id}`);
    } catch (err) {
      console.error('멤버/활동 추가 실패:', err);
    }
  };

  const resetForm = () => {
    setShowAddModal(false);
    setSearchTerm('');
    setSelectedClub(null);
    setActivityContent('');
    setSelectedImage('/src/assets/characters/blue_character1.png');
    setProfileStep(1);
    setClubName("");
    setClubDescription("");
    setClubDepartment("");
    setIsCreatingClub(false);
  };

  const profileImages = [
    '/src/assets/characters/blue_character1.png',
    '/src/assets/characters/blue_character2.png',
    '/src/assets/characters/blue_character3.png',
    '/src/assets/characters/blue_character4.png',
    '/src/assets/characters/yellow_character1.png',
    '/src/assets/characters/yellow_character2.png',
    '/src/assets/characters/yellow_character3.png',
    '/src/assets/characters/yellow_character4.png',
  ];

  // 모달 열기 로직 수정 - 동아리 추가 모달 이벤트 추가
  useEffect(() => {
    // URL 쿼리 파라미터로 모달 열기
    const params = new URLSearchParams(window.location.search);
    if (params.get('openModal') === 'true') {
      setShowAddModal(true);

      // 새 동아리 생성 모드인 경우
      if (params.get('newClub') === 'true') {
        setSearchTerm("");
        setSelectedClub(null);
      }
      
      // URL에서 쿼리 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 멤버 추가 이벤트 리스너
    const handleOpenModal = () => {
      setShowAddModal(true);
    };

    // 동아리 추가 이벤트 리스너
    const handleOpenClubModal = () => {
      setSearchTerm("");
      setSelectedClub(null);
      setIsCreatingClub(true);
      setShowAddModal(true);
    };

    window.addEventListener('openAddMemberModal', handleOpenModal);
    window.addEventListener('openAddClubModal', handleOpenClubModal);

    // 클린업 함수
    return () => {
      window.removeEventListener('openAddMemberModal', handleOpenModal);
      window.removeEventListener('openAddClubModal', handleOpenClubModal);
    };
  }, []);

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <Title
            as={motion.h1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TitleHighlight>CLIP</TitleHighlight> 동아리 운영관리 솔루션
          </Title>
          <Subtitle
            as={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            동아리 활동을 기록하고 쉽게 관리하며, 멤버와 함께 소통해보세요!
          </Subtitle>
          <ButtonGroup
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ButtonsContainer>
              <AddMemberButton onClick={() => setShowAddModal(true)}>
                <ButtonIcon src="/src/assets/characters/blue_character2.png" />
                멤버 추가하기
              </AddMemberButton>
              <AddClubButton onClick={() => {
                setSearchTerm("");
                setSelectedClub(null);
                setIsCreatingClub(true);
                setShowAddModal(true);
              }}>
                <ButtonIcon src="/src/assets/characters/yellow_character2.png" />
                동아리 추가하기
              </AddClubButton>
              <Link to="/clubs">
                <Button variant="secondary" size="large">동아리 살펴보기</Button>
              </Link>
            </ButtonsContainer>
          </ButtonGroup>
        </HeroContent>
        <HeroImageContainer
          as={motion.div}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <HeroImage src="/src/assets/characters/character_gruop1.png" alt="캐릭터 그룹" />
          <Blob />
        </HeroImageContainer>
      </HeroSection>

      {error && (
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      )}

      <TopRankingSection>
        <RankingTitle
          as={motion.h2}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          동아리 랭킹 TOP 3
        </RankingTitle>
        
        {loading ? (
          <LoadingText>랭킹 정보를 불러오는 중...</LoadingText>
        ) : (
          <RankingCards>
            {topClubs.map((club, index) => (
              <RankCard
                as={motion.div}
                key={club.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <RankBadge rank={index + 1}>
                  {index + 1}
                </RankBadge>
                <ClubAvatar>
                  <img src={`/src/assets/characters/blue_character${(index % 4) + 1}.png`} alt={club.name} />
                </ClubAvatar>
                <RankCardContent>
                  <RankCardTitle>{club.name}</RankCardTitle>
                  <MemberCount>{club.members.length}명</MemberCount>
                  <Link to={`/clubs/${club.id}`}>
                    <ViewButton>자세히 보기</ViewButton>
                  </Link>
                </RankCardContent>
              </RankCard>
            ))}
          </RankingCards>
        )}
      </TopRankingSection>

      <FeaturesSection>
        <SectionTitle>주요 기능</SectionTitle>
        <FeatureCards>
          <FeatureCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <FeatureIcon src="/src/assets/characters/blue_character1.png" alt="기능 아이콘" />
            <FeatureTitle>동아리 랭킹</FeatureTitle>
            <FeatureDescription>
              동아리 멤버 수에 따른 랭킹을 확인할 수 있어요.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <FeatureIcon src="/src/assets/characters/blue_character2.png" alt="기능 아이콘" />
            <FeatureTitle>활동 기록</FeatureTitle>
            <FeatureDescription>
              롤링페이퍼 형식으로 동아리 활동을 기록하고 공유해요.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <FeatureIcon src="/src/assets/characters/blue_character3.png" alt="기능 아이콘" />
            <FeatureTitle>멤버 관리</FeatureTitle>
            <FeatureDescription>
              동아리 멤버를 추가하고 관리할 수 있어요.
            </FeatureDescription>
          </FeatureCard>
        </FeatureCards>
      </FeaturesSection>

      {showAddModal && (
        <ModalOverlay 
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => resetForm()}
        >
          <ModalContent
            as={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>새 멤버 추가하기</ModalTitle>
              <CloseButton onClick={() => resetForm()}>✕</CloseButton>
            </ModalHeader>

            {profileStep === 1 && (
              <StepContent>
                {isCreatingClub ? (
                  // 동아리 생성 폼
                  <>
                    <StepTitle>새 동아리 만들기</StepTitle>
                    <InputGroup>
                      <InputLabel>동아리 이름</InputLabel>
                      <StyledInput
                        type="text"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        placeholder="동아리 이름을 입력하세요"
                      />
                    </InputGroup>
                    
                    <InputGroup>
                      <InputLabel>동아리 설명</InputLabel>
                      <StyledTextarea
                        value={clubDescription}
                        onChange={(e) => setClubDescription(e.target.value)}
                        placeholder="동아리에 대한 설명을 입력하세요"
                        rows={3}
                      />
                    </InputGroup>
                    
                    <InputGroup>
                      <InputLabel>소속 학과</InputLabel>
                      <StyledInput
                        type="text"
                        value={clubDepartment}
                        onChange={(e) => setClubDepartment(e.target.value)}
                        placeholder="소속 학과를 입력하세요"
                      />
                    </InputGroup>
                    
                    <ButtonRow>
                      <Button
                        variant="outlined"
                        onClick={() => setIsCreatingClub(false)}
                        disabled={isLoading}
                      >
                        돌아가기
                      </Button>
                      <Button
                        onClick={handleCreateNewClub}
                        disabled={!clubName.trim() || !clubDescription.trim() || !clubDepartment.trim() || isLoading}
                      >
                        {isLoading ? '생성 중...' : '동아리 만들기'}
                      </Button>
                    </ButtonRow>
                  </>
                ) : (
                  // 기존 동아리 검색 UI
                  <>
                    <StepTitle>1단계: 동아리 선택</StepTitle>
                    
                    <SearchContainer>
                      <SearchInput
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="동아리 이름 검색..."
                      />
                    </SearchContainer>

                    {searchTerm && (
                      <SearchResults>
                        {filteredClubs.length > 0 ? (
                          <>
                            {filteredClubs.map((club) => (
                              <SearchResultItem 
                                key={club.id}
                                onClick={() => {
                                  setSelectedClub(club);
                                  setProfileStep(2);
                                }}
                              >
                                <SearchItemInfo>
                                  <SearchItemName>{club.name}</SearchItemName>
                                  <SearchItemDepartment>{club.department}</SearchItemDepartment>
                                </SearchItemInfo>
                                <SearchItemMembers>{club.members.length}명</SearchItemMembers>
                              </SearchResultItem>
                            ))}
                          </>
                        ) : (
                          <NoResultText>
                            "{searchTerm}" 동아리가 없습니다.
                            <ButtonsRow>
                              <CreateClubButton onClick={() => setIsCreatingClub(true)}>
                                새 동아리 생성하기
                              </CreateClubButton>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={() => resetForm()}
                              >
                                취소
                              </Button>
                            </ButtonsRow>
                          </NoResultText>
                        )}
                      </SearchResults>
                    )}
                    
                    <OrDivider>
                      <OrLine />
                      <OrText>또는</OrText>
                      <OrLine />
                    </OrDivider>
                    
                    <CreateClubCTA>
                      <Button 
                        variant="outlined" 
                        full 
                        onClick={() => setIsCreatingClub(true)}
                      >
                        새 동아리 만들기
                      </Button>
                    </CreateClubCTA>
                  </>
                )}
              </StepContent>
            )}

            {profileStep === 2 && (
              <StepContent>
                <StepTitle>2단계: 프로필 선택</StepTitle>
                <ProfileGrid>
                  {profileImages.map((image, index) => (
                    <ProfileImageOption
                      key={index}
                      selected={selectedImage === image}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img src={image} alt={`프로필 ${index + 1}`} />
                      {selectedImage === image && <SelectedBadge>✓</SelectedBadge>}
                    </ProfileImageOption>
                  ))}
                </ProfileGrid>
                <ButtonRow>
                  <Button
                    variant="outlined"
                    onClick={() => setProfileStep(1)}
                  >
                    이전
                  </Button>
                  <Button
                    onClick={() => setProfileStep(3)}
                  >
                    다음
                  </Button>
                </ButtonRow>
              </StepContent>
            )}

            {profileStep === 3 && (
              <StepContent>
                <StepTitle>3단계: 활동 이야기 작성</StepTitle>
                
                <ClubInfoBanner>
                  <ClubBannerImage src={selectedImage} />
                  <ClubBannerText>
                    <span>동아리:</span> {selectedClub?.name}
                  </ClubBannerText>
                </ClubInfoBanner>
                
                <StoryTextarea
                  value={activityContent}
                  onChange={(e) => setActivityContent(e.target.value)}
                  placeholder="동아리에서의 재미있는 이야기, 바라는 점, 친구들에게 하고 싶은 이야기 등을 자유롭게 작성해주세요."
                  rows={5}
                />
                
                <ButtonRow>
                  <Button
                    variant="outlined"
                    onClick={() => setProfileStep(2)}
                  >
                    이전
                  </Button>
                  <Button
                    onClick={handleAddMember}
                    disabled={!activityContent.trim()}
                  >
                    완료
                  </Button>
                </ButtonRow>
              </StepContent>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50vh;
  padding: 40px 0;
  gap: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 44px;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.2;
  color: ${colors.gray70};
`;

const TitleHighlight = styled.span`
  background: ${gradients.bandiGra2};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: ${colors.gray50};
  margin-bottom: 32px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin: 32px 0;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
`;

const AddMemberButton = styled(Button)`
  background: ${gradients.bandiGra2} !important;
  color: ${colors.white};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(133, 91, 255, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(133, 91, 255, 0.4);
  }
`;

const ButtonIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const HeroImageContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeroImage = styled.img`
  max-width: 80%;
  height: auto;
  position: relative;
  z-index: 1;
`;

const Blob = styled.div`
  width: 120%;
  height: 120%;
  position: absolute;
  top: -10%;
  left: -10%;
  background: ${gradients.bandiGra3};
  filter: blur(60px);
  opacity: 0.2;
  border-radius: 50%;
  z-index: 0;
`;

const TopRankingSection = styled.section`
  padding: 60px 0;
  background: linear-gradient(to bottom, ${colors.white}, ${colors.gray10});
  border-radius: 30px;
  margin: 20px 0 60px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const RankingTitle = styled.h2`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 40px;
  text-align: center;
  background: linear-gradient(135deg, ${colors.bandiPurple}, ${colors.bandiBlue55});
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    height: 4px;
    width: 80px;
    background: linear-gradient(to right, ${colors.bandiPurple}, ${colors.bandiBlue55});
    border-radius: 4px;
  }
`;

const RankingCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  padding: 20px 20px;
`;

const RankCard = styled(Card)`
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${gradients.bandiGra2};
  }
`;

const RankBadge = styled.div<{ rank: number }>`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  border-radius: 50%;
  z-index: 5;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  
  ${({ rank }) => {
    if (rank === 1) {
      return `background: linear-gradient(135deg, #FFD700, #FFA500);`;
    } else if (rank === 2) {
      return `background: linear-gradient(135deg, #C0C0C0, #A9A9A9);`;
    } else if (rank === 3) {
      return `background: linear-gradient(135deg, #CD7F32, #8B4513);`;
    }
  }}
`;

const ClubAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 16px;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RankCardContent = styled.div`
  width: 100%;
  margin-top: 8px;
`;

const RankCardTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${colors.gray70};
`;

const MemberCount = styled.div`
  font-size: 16px;
  color: ${colors.bandiBlue55};
  margin-bottom: 16px;
  font-weight: 600;
`;

const ViewButton = styled.button`
  background: ${colors.bandiBlue35};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.bandiBlue55};
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 0;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
  color: ${colors.gray70};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: ${gradients.bandiGra2};
  }
`;

const FeatureCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
`;

const FeatureCard = styled.div`
  background-color: ${colors.white};
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const FeatureIcon = styled.img`
  width: 100px;
  height: auto;
  margin: 0 auto 24px;
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${colors.bandiBlue55};
`;

const FeatureDescription = styled.p`
  font-size: 16px;
  color: ${colors.gray50};
  line-height: 1.5;
`;

// 모달 관련 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 95%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${colors.gray20};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, ${colors.bandiBlue55}, ${colors.bandiBlue35});
  color: white;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: white;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

const StepContent = styled.div`
  padding: 24px;
`;

const StepTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${colors.gray60};
  text-align: center;
`;

const SearchContainer = styled.div`
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${colors.gray20};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  
  &:focus {
    border-color: ${colors.bandiBlue35};
    outline: none;
    box-shadow: 0 0 0 3px rgba(104, 131, 245, 0.1);
  }
`;

const SearchResults = styled.div`
  max-height: 200px;
  overflow-y: auto;
  background: ${colors.gray10};
  border-radius: 8px;
  margin-top: 8px;
`;

const SearchResultItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${colors.gray20};
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: ${colors.gray20};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NoResultText = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${colors.gray50};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const CreateClubButton = styled.button`
  background: ${colors.bandiBlue35};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: ${colors.bandiBlue55};
  }
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const ProfileImageOption = styled.div<{ selected: boolean }>`
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 3px solid ${({ selected }) => selected ? colors.bandiBlue55 : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const SelectedBadge = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  width: 20px;
  height: 20px;
  background: ${colors.bandiBlue55};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

const ClubInfoBanner = styled.div`
  background: ${colors.gray10};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ClubBannerImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
`;

const ClubBannerText = styled.div`
  font-size: 14px;
  
  span {
    font-weight: 600;
    color: ${colors.gray60};
  }
`;

const StoryTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid ${colors.gray20};
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
  
  &:focus {
    border-color: ${colors.bandiBlue35};
    outline: none;
    box-shadow: 0 0 0 3px rgba(104, 131, 245, 0.1);
  }
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 18px;
  color: ${colors.gray50};
  margin: 30px 0;
`;

const ErrorContainer = styled.div`
  background-color: #fff1f0;
  border: 1px solid #ffccc7;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

const ErrorText = styled.p`
  color: #cf1322;
  font-size: 16px;
`;

const AddClubButton = styled(Button)`
  background: linear-gradient(90deg, ${colors.orange}, ${colors.bandiPurple}) !important;
  color: ${colors.white};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(255, 107, 0, 0.4);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: ${colors.gray60};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid ${colors.gray20};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  
  &:focus {
    border-color: ${colors.bandiBlue35};
    outline: none;
    box-shadow: 0 0 0 3px rgba(104, 131, 245, 0.1);
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid ${colors.gray20};
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
  
  &:focus {
    border-color: ${colors.bandiBlue35};
    outline: none;
    box-shadow: 0 0 0 3px rgba(104, 131, 245, 0.1);
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
`;

const OrLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${colors.gray20};
`;

const OrText = styled.span`
  padding: 0 16px;
  color: ${colors.gray50};
  font-size: 14px;
`;

const CreateClubCTA = styled.div`
  margin-top: 16px;
`;

const SearchItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchItemName = styled.span`
  font-weight: 600;
  color: ${colors.gray70};
`;

const SearchItemDepartment = styled.span`
  font-size: 12px;
  color: ${colors.gray50};
  margin-top: 4px;
`;

const SearchItemMembers = styled.span`
  font-size: 14px;
  color: ${colors.bandiBlue55};
  font-weight: 500;
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  justify-content: center;
`;

export default HomePage; 