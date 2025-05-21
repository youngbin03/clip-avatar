import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, gradients } from '../../styles/theme';
import type { Club, RankingClub } from '../../types';
import RankingItem from './RankingItem';

interface RankingListProps {
  clubs: Club[];
}

const RankingList = ({ clubs }: RankingListProps) => {
  // 멤버 수에 따라 정렬하고 랭킹 부여
  const sortedClubs: RankingClub[] = [...clubs]
    .sort((a, b) => b.members.length - a.members.length)
    .map((club, index) => ({
      ...club,
      rank: index + 1,
    }));

  // 상위 3개 동아리와 나머지 동아리 분리
  const topClubs = sortedClubs.slice(0, 3);
  const otherClubs = sortedClubs.slice(3);

  return (
    <StyledRankingList>
      <Title
        as={motion.h2}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        동아리 랭킹
      </Title>
      <Subtitle
        as={motion.p}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        멤버 수 기준 상위 동아리
      </Subtitle>

      <TopRankingContainer>
        {topClubs.map((club, index) => (
          <RankingItem key={club.id} club={club} index={index} />
        ))}
      </TopRankingContainer>

      <OtherRankingsTitle>다른 동아리</OtherRankingsTitle>
      <OtherRankingContainer>
        {otherClubs.map((club, index) => (
          <RankingItem key={club.id} club={club} index={index + 3} />
        ))}
      </OtherRankingContainer>
    </StyledRankingList>
  );
};

const StyledRankingList = styled.div`
  margin-bottom: 60px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  background: ${gradients.bandiGra2};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${colors.gray50};
  text-align: center;
  margin-bottom: 32px;
`;

const TopRankingContainer = styled.div`
  margin-bottom: 40px;
`;

const OtherRankingsTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${colors.gray60};
`;

const OtherRankingContainer = styled.div``;

export default RankingList; 