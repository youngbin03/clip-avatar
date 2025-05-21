import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import HomePage from './pages/HomePage';
import ClubsPage from './pages/ClubsPage';
import ClubPage from './pages/ClubPage';
import RankingPage from './pages/RankingPage';
import { ClubProvider, useClubs } from './context/ClubContext';
import Layout from './components/layout/Layout';
import { useEffect, useState } from 'react';
import MemberAvatarCreator from './components/avatar/MemberAvatarCreator';

const MockDataToggle = () => {
  const { useMockDataEnabled, toggleMockData } = useClubs();
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 1000,
      backgroundColor: useMockDataEnabled ? '#4CAF50' : '#f44336',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }} onClick={toggleMockData}>
      <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: useMockDataEnabled ? 'white' : '#ffcccc' }}></span>
      {useMockDataEnabled ? '예제 데이터 모드 ON' : 'Firebase 모드 ON'}
    </div>
  );
};

const AppRoutes = () => {
  const { loading, error } = useClubs();
  
  if (loading) {
    return <div>로딩 중...</div>;
  }
  
  if (error) {
    return <div>오류 발생: {error}</div>;
  }
  
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/clubs/:clubId" element={<ClubPage />} />
        <Route path="/clubs/:clubId/add-member" element={<MemberAvatarCreator />} />
        <Route path="/ranking" element={<RankingPage />} />
      </Routes>
      <MockDataToggle />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ClubProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </ClubProvider>
    </ThemeProvider>
  );
}

export default App;
