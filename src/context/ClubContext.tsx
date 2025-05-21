import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { 
  getClubs, 
  subscribeToClubs, 
  getClubById, 
  subscribeToClub, 
  createClub, 
  updateClub, 
  addMember, 
  addActivity,
  addRollingPaper,
  getRankedClubs
} from '../firebase/services';
import { mockClubs } from '../data/mockData';
import type { Club, Member, Activity, RankingClub, RollingPaperEntry } from '../types';
import { useMockData, setUseMockData } from '../firebase/config';

interface ClubContextType {
  clubs: Club[];
  rankedClubs: RankingClub[];
  loading: boolean;
  error: string | null;
  getClub: (id: string) => Promise<Club | null>;
  subscribeToClubData: (id: string, callback: (club: Club | null) => void) => () => void;
  createNewClub: (clubData: Omit<Club, 'id'>) => Promise<Club>;
  updateClubData: (id: string, clubData: Partial<Club>) => Promise<void>;
  addClubMember: (clubId: string, memberData: Omit<Member, 'id'>) => Promise<Member>;
  addClubActivity: (clubId: string, activityData: Omit<Activity, 'id'>) => Promise<Activity>;
  addClubRollingPaper: (clubId: string, rollingPaperData: Omit<RollingPaperEntry, 'id'>) => Promise<RollingPaperEntry>;
  isInitialized: boolean;
  retryInitialization: () => Promise<void>;
  isLoading: boolean;
  useMockDataEnabled: boolean;
  toggleMockData: () => void;
}

const ClubContext = createContext<ClubContextType>({
  clubs: [],
  rankedClubs: [],
  loading: true,
  error: null,
  getClub: async () => null,
  subscribeToClubData: () => () => {},
  createNewClub: async () => ({ id: '', name: '', description: '', department: '', members: [], activities: [] }),
  updateClubData: async () => {},
  addClubMember: async () => ({ id: '', name: '' }),
  addClubActivity: async () => ({ id: '', content: '', author: '', createdAt: '' }),
  addClubRollingPaper: async () => ({ id: '', content: '', author: '', createdAt: '' }),
  isInitialized: false,
  retryInitialization: async () => {},
  isLoading: false,
  useMockDataEnabled: true,
  toggleMockData: () => {},
});

export const useClubs = () => useContext(ClubContext);

interface ClubProviderProps {
  children: ReactNode;
}

export const ClubProvider = ({ children }: ClubProviderProps) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [rankedClubs, setRankedClubs] = useState<RankingClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockDataEnabled, setUseMockDataEnabled] = useState<boolean>(() => {
    // localStorage에서 설정 불러오기 또는 기본값 true 설정
    return localStorage.getItem('useMockData') === 'false' ? false : true;
  });

  // mock 데이터 사용 토글 함수
  const toggleMockData = useCallback(() => {
    const newValue = !useMockDataEnabled;
    setUseMockDataEnabled(newValue);
    setUseMockData(newValue);
    
    // 데이터 소스 변경 시 데이터 다시 로드
    if (newValue) {
      console.log('Mock 데이터 모드로 전환');
      setClubs(mockClubs);
      setRankedClubs(getRankedClubs(mockClubs));
      setLoading(false);
    } else {
      console.log('Firebase 데이터 모드로 전환');
      setLoading(true);
      startSubscription();
    }
  }, [useMockDataEnabled]);

  // Firebase 데이터 초기화 함수
  const initializeData = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (useMockData()) {
        console.log('Mock 데이터 모드 - Firebase 초기화 생략');
        setClubs(mockClubs);
        setRankedClubs(getRankedClubs(mockClubs));
        setLoading(false);
        setIsInitialized(true);
        setIsLoading(false);
        return true; // 성공으로 처리
      }

      console.log('Firebase 데이터 초기화 중...');
      
      // Firebase 연결 재시도 및 오류 처리 개선
      let retryCount = 0;
      const maxRetries = 3;
      
      const fetchDataWithRetry = async (): Promise<boolean> => {
        try {
          // services.ts의 getClubs 함수 사용
          const clubsData = await getClubs();
          console.log('Firebase에서 가져온 클럽 데이터:', clubsData);
          
          if (clubsData.length === 0) {
            console.log('Firebase에 클럽 데이터가 없습니다. 예제 데이터를 초기 데이터로 추가합니다.');
            // 초기 데이터가 없으면 mockClubs를 초기 데이터로 추가
            for (const club of mockClubs) {
              await createClub({ ...club });
            }
            // 다시 데이터 가져오기
            const updatedClubs = await getClubs();
            setClubs(updatedClubs);
            setRankedClubs(getRankedClubs(updatedClubs));
          } else {
            setClubs(clubsData);
            setRankedClubs(getRankedClubs(clubsData));
          }
          
          console.log('Firebase 데이터 로드 완료');
          return true;
        } catch (err) {
          retryCount++;
          console.error(`Firebase 데이터 로드 실패 (시도 ${retryCount}/${maxRetries}):`, err);
          
          if (retryCount < maxRetries) {
            console.log(`${1000 * retryCount}ms 후 재시도...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            return fetchDataWithRetry();
          }
          
          // 모든 재시도 실패 시 모의 데이터 사용 제안
          console.warn('Firebase 연결 실패. 모의 데이터를 대신 사용합니다.');
          setError('Firebase 데이터를 불러오는 데 실패했습니다. 모의 데이터를 사용합니다.');
          setClubs(mockClubs);
          setRankedClubs(getRankedClubs(mockClubs));
          return false;
        }
      };
      
      const result = await fetchDataWithRetry();
      setIsInitialized(true);
      setLoading(false);
      return result;
    } catch (err) {
      console.error('데이터 초기화 중 오류:', err);
      setError('데이터 초기화 중 오류가 발생했습니다.');
      // 오류 발생 시 모의 데이터로 대체
      setClubs(mockClubs);
      setRankedClubs(getRankedClubs(mockClubs));
      setLoading(false);
      setIsInitialized(true);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 데이터 초기화 재시도 함수
  const retryInitialization = useCallback(async () => {
    setError(null);
    
    // mock 데이터 모드로 전환
    if (!isInitialized) {
      console.log('초기화 실패 시 Mock 데이터 모드로 전환');
      setUseMockDataEnabled(true);
      setUseMockData(true);
      setClubs(mockClubs);
      setRankedClubs(getRankedClubs(mockClubs));
      setLoading(false);
      return;
    }
    
    const success = await initializeData();
    if (success) {
      // 실시간 데이터 구독 다시 시작
      startSubscription();
    }
  }, [initializeData, isInitialized]);

  // 실시간 구독 시작 함수
  const startSubscription = useCallback(() => {
    // mock 데이터 모드인 경우 구독 생략
    if (useMockDataEnabled) {
      console.log('Mock 데이터 모드 - Firebase 구독 생략');
      setClubs(mockClubs);
      setRankedClubs(getRankedClubs(mockClubs));
      setLoading(false);
      return () => {};
    }

    console.log('실시간 구독 시작...');
    let unsubscribe: (() => void) | undefined;
    
    try {
      // 실시간 데이터 구독
      unsubscribe = subscribeToClubs((updatedClubs) => {
        console.log(`${updatedClubs.length}개의 클럽 데이터 업데이트됨`);
        // Firebase에서 데이터가 없거나 에러 발생 시 mockClubs 사용
        if (updatedClubs.length === 0) {
          console.log('Firebase에 데이터가 없어 예제 데이터를 사용합니다');
          setClubs(mockClubs);
          setRankedClubs(getRankedClubs(mockClubs));
        } else {
          setClubs(updatedClubs);
          setRankedClubs(getRankedClubs(updatedClubs));
        }
        setLoading(false);
      });
      
      // 오류 발생 시 재시도 안내 메시지
      if (!unsubscribe) {
        setError('데이터 구독에 실패했습니다. 임시 데이터를 사용합니다.');
        // 에러 발생 시 기본 예제 데이터 표시
        console.log('데이터 구독 실패, 예제 데이터를 사용합니다');
        setClubs(mockClubs);
        setRankedClubs(getRankedClubs(mockClubs));
        setLoading(false);
      }
    } catch (err) {
      console.error('데이터 구독 시작 실패:', err);
      setError('데이터 구독에 실패했습니다. 임시 데이터를 사용합니다.');
      // 에러 발생 시 기본 예제 데이터 표시
      console.log('데이터 구독 시작 실패, 예제 데이터를 사용합니다');
      setClubs(mockClubs);
      setRankedClubs(getRankedClubs(mockClubs));
      setLoading(false);
    }
    
    return unsubscribe;
  }, [useMockDataEnabled]);

  // Firebase 데이터 초기화 및 실시간 구독
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    // 초기 로딩 상태일 때 예제 데이터 표시
    if (loading && clubs.length === 0) {
      console.log('초기 로딩 중 예제 데이터를 표시합니다');
      setClubs(mockClubs);
      setRankedClubs(getRankedClubs(mockClubs));
    }
    
    const setupFirebase = async () => {
      try {
        const success = await initializeData();
        if (success && !useMockDataEnabled) {
          unsubscribe = startSubscription();
        }
      } catch (error) {
        // 에러 발생 시 예제 데이터 표시
        console.error('Firebase 설정 오류:', error);
        setClubs(mockClubs);
        setRankedClubs(getRankedClubs(mockClubs));
        setLoading(false);
      }
    };
    
    setupFirebase();
    
    // cleanup 함수
    return () => {
      if (unsubscribe) {
        console.log('구독 해제');
        unsubscribe();
      }
    };
  }, [initializeData, startSubscription, loading, clubs.length, useMockDataEnabled]);

  // 단일 클럽 조회
  const getClub = async (id: string) => {
    // mock 데이터 모드인 경우
    if (useMockDataEnabled) {
      console.log(`Mock 데이터에서 클럽 ID 조회: ${id}`);
      return mockClubs.find(club => club.id === id) || null;
    }

    try {
      return await getClubById(id);
    } catch (err) {
      console.error('클럽 조회 실패:', err);
      setError('클럽 정보를 불러오는데 실패했습니다.');
      
      // Firebase 오류 시 mock 데이터에서 조회
      return mockClubs.find(club => club.id === id) || null;
    }
  };

  // 실시간 클럽 데이터 구독
  const subscribeToClubData = (id: string, callback: (club: Club | null) => void) => {
    // mock 데이터 모드인 경우
    if (useMockDataEnabled) {
      console.log(`Mock 데이터에서 클럽 ID 구독: ${id}`);
      const mockClub = mockClubs.find(club => club.id === id) || null;
      setTimeout(() => callback(mockClub), 0);
      return () => {};
    }

    return subscribeToClub(id, callback);
  };

  // 새 클럽 생성
  const createNewClub = async (clubData: Omit<Club, 'id'>) => {
    try {
      setIsLoading(true);
      
      // mock 데이터 모드인 경우
      if (useMockDataEnabled) {
        console.log('Mock 데이터 모드 - 새 클럽 생성');
        // 임의의 ID 생성
        const newId = `mock-${Date.now()}`;
        const newClub: Club = {
          id: newId,
          ...clubData,
          members: clubData.members || [],
          activities: clubData.activities || [],
          rollingPaper: clubData.rollingPaper || []
        };
        
        // 현재 목록에 추가
        const updatedClubs = [...clubs, newClub];
        setClubs(updatedClubs);
        setRankedClubs(getRankedClubs(updatedClubs));
        
        return newClub;
      }

      const newClub = await createClub(clubData);
      return newClub;
    } catch (err) {
      console.error('클럽 생성 실패:', err);
      setError('클럽을 생성하는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 클럽 데이터 업데이트
  const updateClubData = async (id: string, clubData: Partial<Club>) => {
    try {
      setIsLoading(true);
      
      // mock 데이터 모드인 경우
      if (useMockDataEnabled) {
        console.log(`Mock 데이터 모드 - 클럽 업데이트: ${id}`);
        // 현재 목록에서 업데이트
        const updatedClubs = clubs.map(club => 
          club.id === id ? { ...club, ...clubData } : club
        );
        setClubs(updatedClubs);
        setRankedClubs(getRankedClubs(updatedClubs));
        return;
      }

      await updateClub(id, clubData);
    } catch (err) {
      console.error('클럽 업데이트 실패:', err);
      setError('클럽 정보를 업데이트하는데 실패했습니다.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 멤버 추가
  const addClubMember = async (clubId: string, memberData: Omit<Member, 'id'>) => {
    try {
      setIsLoading(true);
      
      // mock 데이터 모드인 경우
      if (useMockDataEnabled) {
        console.log(`Mock 데이터 모드 - 멤버 추가: ${clubId}`);
        // 임의의 ID 생성
        const newId = `mock-member-${Date.now()}`;
        const newMember: Member = {
          id: newId,
          ...memberData
        };
        
        // 현재 목록에서 업데이트
        const updatedClubs = clubs.map(club => {
          if (club.id === clubId) {
            return {
              ...club,
              members: [...club.members, newMember]
            };
          }
          return club;
        });
        
        setClubs(updatedClubs);
        setRankedClubs(getRankedClubs(updatedClubs));
        
        return newMember;
      }

      return await addMember(clubId, memberData);
    } catch (err) {
      console.error('멤버 추가 실패:', err);
      setError('멤버를 추가하는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 활동 추가
  const addClubActivity = async (clubId: string, activityData: Omit<Activity, 'id'>) => {
    try {
      setIsLoading(true);
      
      // mock 데이터 모드인 경우
      if (useMockDataEnabled) {
        console.log(`Mock 데이터 모드 - 활동 추가: ${clubId}`);
        // 임의의 ID 생성
        const newId = `mock-activity-${Date.now()}`;
        const newActivity: Activity = {
          id: newId,
          ...activityData,
          createdAt: activityData.createdAt || new Date().toISOString()
        };
        
        // 현재 목록에서 업데이트
        const updatedClubs = clubs.map(club => {
          if (club.id === clubId) {
            return {
              ...club,
              activities: [newActivity, ...club.activities]
            };
          }
          return club;
        });
        
        setClubs(updatedClubs);
        setRankedClubs(getRankedClubs(updatedClubs));
        
        return newActivity;
      }

      return await addActivity(clubId, activityData);
    } catch (err) {
      console.error('활동 추가 실패:', err);
      setError('활동을 추가하는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 롤링페이퍼 추가
  const addClubRollingPaper = async (clubId: string, rollingPaperData: Omit<RollingPaperEntry, 'id'>) => {
    try {
      setIsLoading(true);
      
      // mock 데이터 모드인 경우
      if (useMockDataEnabled) {
        console.log(`Mock 데이터 모드 - 롤링페이퍼 추가: ${clubId}`);
        // 임의의 ID 생성
        const newId = `mock-rollingpaper-${Date.now()}`;
        const newRollingPaper: RollingPaperEntry = {
          id: newId,
          ...rollingPaperData,
          createdAt: rollingPaperData.createdAt || new Date().toISOString()
        };
        
        // 현재 목록에서 업데이트
        const updatedClubs = clubs.map(club => {
          if (club.id === clubId) {
            const currentRollingPapers = club.rollingPaper || [];
            return {
              ...club,
              rollingPaper: [newRollingPaper, ...currentRollingPapers]
            };
          }
          return club;
        });
        
        setClubs(updatedClubs);
        setRankedClubs(getRankedClubs(updatedClubs));
        
        return newRollingPaper;
      }

      console.log('롤링페이퍼 추가 시작:', rollingPaperData);
      const result = await addRollingPaper(clubId, rollingPaperData);
      console.log('롤링페이퍼 추가 완료:', result);
      return result as RollingPaperEntry;
    } catch (err) {
      console.error('롤링페이퍼 추가 실패:', err);
      setError('롤링페이퍼를 추가하는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    clubs,
    rankedClubs,
    loading,
    error,
    getClub,
    subscribeToClubData,
    createNewClub,
    updateClubData,
    addClubMember,
    addClubActivity,
    addClubRollingPaper,
    isInitialized,
    retryInitialization,
    isLoading,
    useMockDataEnabled,
    toggleMockData,
  };

  return (
    <ClubContext.Provider value={value}>
      {children}
    </ClubContext.Provider>
  );
};

export default ClubContext; 