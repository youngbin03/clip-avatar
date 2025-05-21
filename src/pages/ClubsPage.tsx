import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, gradients } from '../styles/theme';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useClubs } from '../context/ClubContext';

const ClubsPage = () => {
  const navigate = useNavigate();
  const { clubs, loading, error } = useClubs();
  const [searchQuery, setSearchQuery] = useState('');
  
  // 검색 기능 구현
  const filteredClubs = searchQuery 
    ? clubs.filter(club => 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clubs;

  // 동아리 추가 버튼 클릭 핸들러
  const handleAddClubClick = () => {
    navigate('/?openModal=true&newClub=true');
  };

  return (
    <Container>
      <PageHeader
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageTitle>동아리 목록</PageTitle>
        <PageDescription>
          다양한 동아리를 살펴보고 활동 내용을 확인해보세요.
        </PageDescription>
      </PageHeader>

      {error && (
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      )}

      <ActionBar>
        <SearchContainer>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="동아리 이름, 설명 또는 학과를 검색하세요..."
          />
          {searchQuery && (
            <ClearButton onClick={() => setSearchQuery('')}>✕</ClearButton>
          )}
        </SearchContainer>
        
        <AddClubButton 
          onClick={handleAddClubClick}
          as={motion.div}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <ButtonIcon>+</ButtonIcon>
          동아리 추가하기
        </AddClubButton>
      </ActionBar>
      
      {loading ? (
        <LoadingContainer>
          <LoadingText>동아리 정보를 불러오고 있어요...</LoadingText>
        </LoadingContainer>
      ) : filteredClubs.length > 0 ? (
        <ClubGrid>
          {filteredClubs.map((club, index) => (
            <Link key={club.id} to={`/clubs/${club.id}`}>
              <ClubCard
                as={motion.div}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card variant="default" padding="0">
                  <CardHeader>
                    <ClubTitle>{club.name}</ClubTitle>
                    <MemberCount>{club.members.length}명</MemberCount>
                  </CardHeader>
                  <CardBody>
                    <ClubDescription>{club.description}</ClubDescription>
                    <DepartmentBadge>{club.department}</DepartmentBadge>
                    <PreviewLabel>최근 활동</PreviewLabel>
                    {club.activities.length > 0 ? (
                      <RecentActivity>
                        {club.activities[0].content.length > 80
                          ? `${club.activities[0].content.substring(0, 80)}...`
                          : club.activities[0].content}
                      </RecentActivity>
                    ) : (
                      <NoActivity>아직 기록된 활동이 없어요.</NoActivity>
                    )}
                  </CardBody>
                  <MembersPreview>
                    {club.members.slice(0, 4).map((member, idx) => (
                      <MemberAvatar
                        key={member.id}
                        src={member.profileImage || `/src/assets/characters/blue_character${(idx % 4) + 1}.png`}
                        alt={member.name}
                      />
                    ))}
                    {club.members.length > 4 && (
                      <MoreMembers>+{club.members.length - 4}</MoreMembers>
                    )}
                  </MembersPreview>
                </Card>
              </ClubCard>
            </Link>
          ))}
        </ClubGrid>
      ) : (
        <NoResultContainer>
          <NoResultText>
            '{searchQuery}'에 대한 검색 결과가 없습니다.
          </NoResultText>
          <Button 
            onClick={handleAddClubClick}
            variant="secondary"
          >
            새 동아리 만들기
          </Button>
        </NoResultContainer>
      )}
    </Container>
  );
};

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${colors.gray70};
`;

const PageDescription = styled.p`
  font-size: 18px;
  color: ${colors.gray50};
  max-width: 600px;
  margin: 0 auto;
`;

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

const ClubGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const ClubCard = styled.div`
  height: 100%;
`;

const CardHeader = styled.div`
  background: ${gradients.bandiGra3};
  padding: 20px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClubTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.white};
`;

const MemberCount = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.white};
`;

const CardBody = styled.div`
  padding: 20px;
`;

const ClubDescription = styled.p`
  font-size: 16px;
  color: ${colors.gray60};
  margin-bottom: 20px;
  line-height: 1.5;
`;

const PreviewLabel = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.gray50};
  margin-bottom: 8px;
`;

const RecentActivity = styled.p`
  font-size: 14px;
  color: ${colors.gray60};
  line-height: 1.4;
  background-color: ${colors.gray10};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const NoActivity = styled.p`
  font-size: 14px;
  color: ${colors.gray40};
  font-style: italic;
  margin-bottom: 20px;
`;

const MembersPreview = styled.div`
  display: flex;
  padding: 0 20px 20px;
`;

const MemberAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid ${colors.white};
  margin-left: -8px;
  
  &:first-child {
    margin-left: 0;
  }
`;

const MoreMembers = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${colors.gray10};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${colors.gray50};
  font-weight: 600;
  margin-left: -8px;
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

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
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

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${colors.gray50};
  font-size: 18px;
  cursor: pointer;
  
  &:hover {
    color: ${colors.gray70};
  }
`;

const AddClubButton = styled.button`
  background: linear-gradient(90deg, ${colors.orange}, ${colors.bandiPurple});
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(255, 107, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(255, 107, 0, 0.3);
  }
`;

const ButtonIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 16px;
  font-weight: 700;
`;

const DepartmentBadge = styled.div`
  display: inline-block;
  padding: 4px 10px;
  background-color: ${colors.gray10};
  color: ${colors.gray60};
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const NoResultContainer = styled.div`
  padding: 60px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const NoResultText = styled.p`
  font-size: 18px;
  color: ${colors.gray50};
  margin-bottom: 20px;
`;

export default ClubsPage; 