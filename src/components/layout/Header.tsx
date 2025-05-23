import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { colors, gradients } from '../../styles/theme';
import Container from '../common/Container';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleAddMemberClick = () => {
    // 홈페이지로 이동 후 모달 열기
    if (location.pathname !== '/') {
      navigate('/?openModal=true');
    } else {
      // 이미 홈페이지에 있으면 이벤트 발생
      const addMemberEvent = new CustomEvent('openAddMemberModal');
      window.dispatchEvent(addMemberEvent);
    }
  };

  const handleAddClubClick = () => {
    // 홈페이지로 이동 후 모달 열기 (검색어 초기화)
    if (location.pathname !== '/') {
      navigate('/?openModal=true&newClub=true');
    } else {
      // 이미 홈페이지에 있으면 이벤트 발생
      const addClubEvent = new CustomEvent('openAddClubModal');
      window.dispatchEvent(addClubEvent);
    }
  };
  
  return (
    <StyledHeader>
      <GlassBackground />
      <Container>
        <HeaderContent>
          <LeftSection>
            <Logo to="/">
              <LogoImage src="/assets/icons/logo.png" alt="CLIP 로고" />
            </Logo>
          </LeftSection>
          
          <RightSection>
            <NavLinks>
              <NavItem>
                <NavLink to="/" $isActive={isActive('/')}>
                  홈
                  <NavLinkHighlight $isActive={isActive('/')} />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/clubs" $isActive={isActive('/clubs')}>
                  동아리
                  <NavLinkHighlight $isActive={isActive('/clubs')} />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/ranking" $isActive={isActive('/ranking')}>
                  랭킹
                  <NavLinkHighlight $isActive={isActive('/ranking')} />
                </NavLink>
              </NavItem>
            </NavLinks>
            
            <ButtonsSection>
              <AddMemberButton
                as={motion.div}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddMemberClick}
              >
                <AddMemberLinkStyle>
                  <AddIcon>+</AddIcon>
                  멤버 추가
                </AddMemberLinkStyle>
              </AddMemberButton>
              
              <AddClubButton
                as={motion.div}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddClubClick}
              >
                <AddClubLinkStyle>
                  <AddClubIcon>+</AddClubIcon>
                  동아리 추가
                </AddClubLinkStyle>
              </AddClubButton>
            </ButtonsSection>
            
            <BlueBadge>
              <img src="/assets/characters/blue_character1.png" alt="캐릭터" width="24" height="24" />
              <span>2025 라치오스 축제</span>
            </BlueBadge>
          </RightSection>
        </HeaderContent>
      </Container>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  width: 100%;
  height: 80px;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const GlassBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  z-index: -1;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  justify-content: flex-end;
`;

const ButtonsSection = styled.div`
  display: flex;
  gap: 12px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  position: relative;
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 32px;
  margin-right: 20px;
`;

const NavItem = styled.div`
  position: relative;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ $isActive }) => $isActive ? colors.bandiBlue55 : colors.gray60};
  position: relative;
  transition: color 0.3s ease;
  padding: 8px 0;
  display: inline-block;
  
  &:hover {
    color: ${colors.bandiBlue55};
  }
`;

const NavLinkHighlight = styled(motion.div)<{ $isActive: boolean }>`
  position: absolute;
  bottom: -2px;
  left: 0;
  width: ${({ $isActive }) => $isActive ? '100%' : '0%'};
  height: 3px;
  background: ${gradients.bandiGra2};
  transition: width 0.3s ease;
  border-radius: 4px;
  
  ${NavLink}:hover & {
    width: 100%;
  }
`;

const AddMemberButton = styled.div`
  background: linear-gradient(90deg, ${colors.bandiPurple}, ${colors.bandiBlue35});
  border-radius: 50px;
  padding: 2px;
  box-shadow: 0 4px 12px rgba(133, 91, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      transparent, 
      rgba(255, 255, 255, 0.4), 
      transparent, 
      transparent
    );
    animation: rotate 4s linear infinite;
    z-index: 0;
  }
  
  @keyframes rotate {
    100% {
      transform: rotate(1turn);
    }
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(133, 91, 255, 0.4);
  }
`;

const AddMemberLinkStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${colors.white};
  border-radius: 48px;
  color: ${colors.bandiBlue55};
  font-weight: 700;
  font-size: 15px;
  position: relative;
  z-index: 1;
  cursor: pointer;
  
  &:hover {
    color: ${colors.bandiPurple};
  }
`;

const AddIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: ${colors.bandiBlue35};
  border-radius: 50%;
  color: white;
  font-size: 16px;
  font-weight: 700;
`;

const AddClubButton = styled.div`
  background: linear-gradient(90deg, ${colors.orange}, ${colors.bandiPurple});
  border-radius: 50px;
  padding: 2px;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      transparent, 
      rgba(255, 255, 255, 0.4), 
      transparent, 
      transparent
    );
    animation: rotate 4s linear infinite;
    z-index: 0;
  }
  
  @keyframes rotate {
    100% {
      transform: rotate(1turn);
    }
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(255, 107, 0, 0.4);
  }
`;

const AddClubLinkStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${colors.white};
  border-radius: 48px;
  color: ${colors.orange};
  font-weight: 700;
  font-size: 15px;
  position: relative;
  z-index: 1;
  cursor: pointer;
  
  &:hover {
    color: ${colors.bandiPurple};
  }
`;

const AddClubIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: ${colors.orange};
  border-radius: 50%;
  color: white;
  font-size: 16px;
  font-weight: 700;
`;

const BlueBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, ${colors.bandiBlue55}, ${colors.bandiBlue35});
  color: ${colors.white};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(104, 131, 245, 0.3);
  overflow: visible;
  white-space: nowrap;
  
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${colors.white};
  }
  
  span {
    white-space: nowrap;
  }
`;

export default Header; 