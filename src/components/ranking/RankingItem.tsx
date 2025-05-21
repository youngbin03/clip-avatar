import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors, gradients } from '../../styles/theme';
import type { RankingClub } from '../../types';
import Card from '../common/Card';

interface RankingItemProps {
  club: RankingClub;
  index: number;
}

const RankingItem = ({ club, index }: RankingItemProps) => {
  const isTopThree = index < 3;
  
  return (
    <StyledRankingItem
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link to={`/clubs/${club.id}`}>
        <Card variant={isTopThree ? 'highlighted' : 'default'} padding="20px">
          <RankingContent>
            <RankBadge isTopThree={isTopThree} rank={index + 1}>
              {index + 1}
            </RankBadge>
            <ClubInfo>
              <ClubName>{club.name}</ClubName>
              <MemberCount>{club.members.length}명의 멤버</MemberCount>
              <ClubDescription>{club.description}</ClubDescription>
            </ClubInfo>
            <MembersPreview>
              {club.members.slice(0, 3).map((member, idx) => (
                <MemberAvatar key={member.id} src={member.profileImage || `/src/assets/characters/blue_character${(idx % 4) + 1}.png`} alt={member.name} />
              ))}
              {club.members.length > 3 && (
                <MoreMembers>+{club.members.length - 3}</MoreMembers>
              )}
            </MembersPreview>
          </RankingContent>
        </Card>
      </Link>
    </StyledRankingItem>
  );
};

const StyledRankingItem = styled.div`
  margin-bottom: 16px;
  
  a {
    display: block;
  }
`;

const RankingContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const RankBadge = styled.div<{ isTopThree: boolean; rank: number }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  font-size: 18px;
  
  ${({ isTopThree, rank }) => {
    if (isTopThree) {
      if (rank === 1) {
        return `
          background: ${gradients.bandiGra2};
          color: ${colors.white};
          box-shadow: 0 4px 12px rgba(133, 91, 255, 0.3);
        `;
      } else if (rank === 2) {
        return `
          background: ${gradients.bandiGra3};
          color: ${colors.white};
          box-shadow: 0 4px 12px rgba(69, 95, 209, 0.3);
        `;
      } else {
        return `
          background: ${gradients.bandiGra4};
          color: ${colors.white};
          box-shadow: 0 4px 12px rgba(194, 201, 208, 0.3);
        `;
      }
    } else {
      return `
        background: ${colors.gray20};
        color: ${colors.gray50};
      `;
    }
  }}
`;

const ClubInfo = styled.div`
  flex: 1;
`;

const ClubName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: ${colors.gray70};
`;

const MemberCount = styled.div`
  font-size: 14px;
  color: ${colors.bandiBlue55};
  font-weight: 600;
  margin-bottom: 8px;
`;

const ClubDescription = styled.p`
  font-size: 14px;
  color: ${colors.gray50};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MembersPreview = styled.div`
  display: flex;
  align-items: center;
`;

const MemberAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${colors.white};
  margin-left: -8px;
  
  &:first-child {
    margin-left: 0;
  }
`;

const MoreMembers = styled.div`
  width: 32px;
  height: 32px;
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

export default RankingItem; 