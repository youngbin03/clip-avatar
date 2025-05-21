import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, gradients } from '../styles/theme';
import Container from '../components/common/Container';
import RankingList from '../components/ranking/RankingList';
import { useClubs } from '../context/ClubContext';
import Card from '../components/common/Card';

const RankingPage = () => {
  const { rankedClubs, loading, error } = useClubs();
  const [filterBy, setFilterBy] = useState<'members' | 'activities'>('members');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  
  // 학과 목록 추출
  const departments = rankedClubs.length > 0
    ? ['all', ...new Set(rankedClubs.map(club => club.department))]
    : ['all'];
  
  // 필터링된 클럽 목록
  const filteredClubs = rankedClubs
    .filter(club => selectedDepartment === 'all' || club.department === selectedDepartment)
    .sort((a, b) => {
      if (filterBy === 'members') {
        return b.members.length - a.members.length;
      } else {
        return b.activities.length - a.activities.length;
      }
    })
    .map((club, index) => ({
      ...club,
      rank: index + 1
    }));

  return (
    <Container>
      <PageHeader
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageTitle>동아리 랭킹</PageTitle>
        <PageDescription>
          가장 많은 멤버를 보유한 동아리를 확인해보세요.
        </PageDescription>
      </PageHeader>

      {error && (
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      )}

      <FilterSection>
        <FilterGroup>
          <FilterLabel>정렬 기준:</FilterLabel>
          <FilterOptions>
            <FilterOption 
              active={filterBy === 'members'} 
              onClick={() => setFilterBy('members')}
            >
              멤버 수
            </FilterOption>
            <FilterOption 
              active={filterBy === 'activities'} 
              onClick={() => setFilterBy('activities')}
            >
              활동 수
            </FilterOption>
          </FilterOptions>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>학과:</FilterLabel>
          <SelectFilter 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'all' ? '모든 학과' : dept}
              </option>
            ))}
          </SelectFilter>
        </FilterGroup>
      </FilterSection>

      {loading ? (
        <LoadingContainer>
          <LoadingText>랭킹 정보를 불러오고 있어요...</LoadingText>
        </LoadingContainer>
      ) : filteredClubs.length > 0 ? (
        <>
          <RankingSummary>
            <SummaryCard>
              <SummaryTitle>총 동아리 수</SummaryTitle>
              <SummaryValue>{rankedClubs.length}개</SummaryValue>
            </SummaryCard>
            
            <SummaryCard>
              <SummaryTitle>총 멤버 수</SummaryTitle>
              <SummaryValue>
                {rankedClubs.reduce((sum, club) => sum + club.members.length, 0)}명
              </SummaryValue>
            </SummaryCard>
            
            <SummaryCard>
              <SummaryTitle>총 활동 수</SummaryTitle>
              <SummaryValue>
                {rankedClubs.reduce((sum, club) => sum + club.activities.length, 0)}개
              </SummaryValue>
            </SummaryCard>
          </RankingSummary>
          
          <RankingList clubs={filteredClubs} />
        </>
      ) : (
        <NoResultContainer>
          <NoResultText>선택하신 필터에 해당하는 동아리가 없습니다.</NoResultText>
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

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: ${colors.gray10};
  padding: 16px;
  border-radius: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterLabel = styled.span`
  font-weight: 600;
  color: ${colors.gray60};
  font-size: 14px;
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterOption = styled.button<{ active: boolean }>`
  padding: 6px 14px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.active ? gradients.bandiGra2 : colors.white};
  color: ${props => props.active ? colors.white : colors.gray60};
  font-weight: ${props => props.active ? '600' : '400'};
  box-shadow: ${props => props.active ? '0 2px 8px rgba(104, 131, 245, 0.3)' : 'none'};
  
  &:hover {
    background: ${props => props.active ? gradients.bandiGra2 : colors.gray20};
  }
`;

const SelectFilter = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${colors.gray30};
  background-color: white;
  font-size: 14px;
  color: ${colors.gray70};
  cursor: pointer;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${colors.bandiBlue35};
    box-shadow: 0 0 0 2px rgba(104, 131, 245, 0.1);
  }
`;

const RankingSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const SummaryCard = styled(Card)`
  padding: 20px;
  text-align: center;
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SummaryTitle = styled.h3`
  font-size: 16px;
  color: ${colors.gray60};
  margin: 0;
`;

const SummaryValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${colors.gray70};
  background: linear-gradient(135deg, ${colors.bandiPurple}, ${colors.bandiBlue55});
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const NoResultContainer = styled.div`
  padding: 40px 0;
  text-align: center;
`;

const NoResultText = styled.p`
  font-size: 18px;
  color: ${colors.gray50};
`;

export default RankingPage; 