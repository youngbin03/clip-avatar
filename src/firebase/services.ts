import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from './config';
import type { Club, Member, Activity, RankingClub } from '../types';

// 디버깅을 위한 로그 함수
const logInfo = (message: string, data?: any) => {
  console.log(`[Firebase] ${message}`, data ? data : '');
};

const logError = (message: string, error: any) => {
  console.error(`[Firebase Error] ${message}`, error);
};

// Collection references
const clubsCollection = collection(db, 'clubs');

// Club 관련 함수
export const getClubs = async (): Promise<Club[]> => {
  try {
    logInfo('클럽 목록 불러오기 시작');
    const snapshot = await getDocs(clubsCollection);
    const clubs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Club[];
    logInfo(`${clubs.length}개의 클럽을 불러왔습니다`);
    return clubs;
  } catch (error) {
    logError('클럽 목록 불러오기 실패', error);
    throw error;
  }
};

export const getClubById = async (id: string): Promise<Club | null> => {
  try {
    logInfo(`클럽 ID로 조회: ${id}`);
    const docRef = doc(db, 'clubs', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      logInfo('클럽 조회 성공');
      return { id: docSnap.id, ...docSnap.data() } as Club;
    }
    
    logInfo('클럽을 찾을 수 없음');
    return null;
  } catch (error) {
    logError(`클럽 조회 실패: ${id}`, error);
    throw error;
  }
};

export const createClub = async (clubData: Omit<Club, 'id'>): Promise<Club> => {
  try {
    logInfo('새 클럽 생성 시작', clubData);
    const id = uuidv4();
    const newClub = { 
      ...clubData, 
      id,
      createdAt: serverTimestamp()
    };
    
    const clubRef = doc(db, 'clubs', id);
    await setDoc(clubRef, newClub);
    
    logInfo('새 클럽 생성 완료', newClub);
    return {
      ...newClub,
      createdAt: new Date().toISOString() // 클라이언트에서 사용할 ISO 문자열로 변환
    } as Club;
  } catch (error) {
    logError('클럽 생성 실패', error);
    throw error;
  }
};

export const updateClub = async (id: string, clubData: Partial<Club>): Promise<void> => {
  try {
    logInfo(`클럽 업데이트: ${id}`, clubData);
    const clubRef = doc(db, 'clubs', id);
    await updateDoc(clubRef, {
      ...clubData,
      updatedAt: serverTimestamp()
    });
    logInfo('클럽 업데이트 완료');
  } catch (error) {
    logError(`클럽 업데이트 실패: ${id}`, error);
    throw error;
  }
};

export const deleteClub = async (id: string): Promise<void> => {
  try {
    logInfo(`클럽 삭제: ${id}`);
    await deleteDoc(doc(db, 'clubs', id));
    logInfo('클럽 삭제 완료');
  } catch (error) {
    logError(`클럽 삭제 실패: ${id}`, error);
    throw error;
  }
};

// Member 관련 함수
export const addMember = async (clubId: string, memberData: Omit<Member, 'id'>): Promise<Member> => {
  try {
    logInfo(`${clubId} 클럽에 멤버 추가`, memberData);
    const id = uuidv4();
    
    // 일반 타임스탬프 사용 (serverTimestamp를 배열 내부에서 사용할 수 없음)
    const currentTime = new Date().toISOString();
    
    const newMember = { 
      ...memberData, 
      id,
      createdAt: currentTime  // serverTimestamp() 대신 일반 문자열 타임스탬프 사용
    };
    
    const clubRef = doc(db, 'clubs', clubId);
    const clubDoc = await getDoc(clubRef);
    
    if (clubDoc.exists()) {
      const clubData = clubDoc.data() as Club;
      const updatedMembers = [...clubData.members, newMember];
      
      // 문서 자체의 updatedAt에만 serverTimestamp 사용
      await updateDoc(clubRef, { 
        members: updatedMembers,
        updatedAt: serverTimestamp()
      });
      
      logInfo('멤버 추가 완료', newMember);
      return newMember;
    }
    
    logError(`클럽을 찾을 수 없음: ${clubId}`, '');
    throw new Error('Club not found');
  } catch (error) {
    logError(`멤버 추가 실패: ${clubId}`, error);
    throw error;
  }
};

// Activity (롤링페이퍼) 관련 함수
export const addActivity = async (clubId: string, activityData: Omit<Activity, 'id'>): Promise<Activity> => {
  try {
    logInfo(`${clubId} 클럽에 활동 추가`, activityData);
    const id = uuidv4();
    const newActivity = { 
      ...activityData, 
      id,
      createdAt: activityData.createdAt || new Date().toISOString()
    };
    
    const clubRef = doc(db, 'clubs', clubId);
    const clubDoc = await getDoc(clubRef);
    
    if (clubDoc.exists()) {
      const clubData = clubDoc.data() as Club;
      const updatedActivities = [newActivity, ...clubData.activities];
      
      // 문서 자체의 updatedAt에만 serverTimestamp 사용
      await updateDoc(clubRef, { 
        activities: updatedActivities,
        updatedAt: serverTimestamp()
      });
      
      logInfo('활동 추가 완료', newActivity);
      return newActivity;
    }
    
    logError(`클럽을 찾을 수 없음: ${clubId}`, '');
    throw new Error('Club not found');
  } catch (error) {
    logError(`활동 추가 실패: ${clubId}`, error);
    throw error;
  }
};

// RollingPaper 관련 함수 추가
export const addRollingPaper = async (clubId: string, rollingPaperData: Omit<Activity, 'id'>): Promise<Activity> => {
  try {
    logInfo(`${clubId} 클럽에 롤링페이퍼 추가`, rollingPaperData);
    const id = uuidv4();
    const newRollingPaper = { 
      ...rollingPaperData, 
      id,
      createdAt: rollingPaperData.createdAt || new Date().toISOString()
    };
    
    const clubRef = doc(db, 'clubs', clubId);
    const clubDoc = await getDoc(clubRef);
    
    if (clubDoc.exists()) {
      const clubData = clubDoc.data() as Club;
      // 기존 롤링페이퍼 배열이 없으면 새로 생성
      const currentRollingPapers = clubData.rollingPaper || [];
      const updatedRollingPapers = [newRollingPaper, ...currentRollingPapers];
      
      // 문서 자체의 updatedAt에만 serverTimestamp 사용
      await updateDoc(clubRef, { 
        rollingPaper: updatedRollingPapers,
        updatedAt: serverTimestamp()
      });
      
      logInfo('롤링페이퍼 추가 완료', newRollingPaper);
      return newRollingPaper;
    }
    
    logError(`클럽을 찾을 수 없음: ${clubId}`, '');
    throw new Error('Club not found');
  } catch (error) {
    logError(`롤링페이퍼 추가 실패: ${clubId}`, error);
    throw error;
  }
};

// 실시간 데이터 동기화
export const subscribeToClubs = (callback: (clubs: Club[]) => void): (() => void) => {
  try {
    logInfo('클럽 목록 실시간 구독 시작');
    const q = query(clubsCollection, orderBy('name'));
    
    return onSnapshot(q, (snapshot) => {
      const clubs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Club[];
      
      logInfo(`${clubs.length}개의 클럽 데이터 업데이트됨`);
      callback(clubs);
    }, (error) => {
      logError('클럽 목록 구독 오류', error);
    });
  } catch (error) {
    logError('클럽 목록 구독 시작 실패', error);
    // 오류 발생 시 빈 콜백 반환
    return () => {};
  }
};

export const subscribeToClub = (clubId: string, callback: (club: Club | null) => void): (() => void) => {
  try {
    logInfo(`클럽 ID: ${clubId} 실시간 구독 시작`);
    const clubRef = doc(db, 'clubs', clubId);
    
    return onSnapshot(clubRef, (docSnap) => {
      if (docSnap.exists()) {
        const club = { id: docSnap.id, ...docSnap.data() } as Club;
        logInfo('클럽 데이터 업데이트됨', club.name);
        callback(club);
      } else {
        logInfo(`클럽을 찾을 수 없음: ${clubId}`);
        callback(null);
      }
    }, (error) => {
      logError(`클럽 구독 오류: ${clubId}`, error);
    });
  } catch (error) {
    logError(`클럽 구독 시작 실패: ${clubId}`, error);
    // 오류 발생 시 빈 콜백 반환
    return () => {};
  }
};

// 데이터 초기화 함수 수정 - rollingPaper 추가
export const initializeFirebaseData = async (mockClubs: Club[]): Promise<void> => {
  try {
    logInfo('Firebase 데이터 초기화 시작');
    // Firebase에 데이터가 없는 경우에만 초기화
    const snapshot = await getDocs(clubsCollection);
    
    if (snapshot.docs.length === 0) {
      logInfo('데이터가 없어 초기화를 진행합니다');
      // 모든 클럽 데이터 일괄 저장
      const batch = [];
      
      for (const club of mockClubs) {
        // 타임스탬프 추가
        const clubWithTimestamp = {
          ...club,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        // rollingPaper 필드가 없을 경우 빈 배열로 초기화
        if (!clubWithTimestamp.rollingPaper) {
          clubWithTimestamp.rollingPaper = [];
        }
        
        const docRef = doc(db, 'clubs', club.id);
        batch.push(setDoc(docRef, clubWithTimestamp));
      }
      
      await Promise.all(batch);
      logInfo('Firebase 데이터 초기화 완료');
    } else {
      logInfo('이미 데이터가 존재합니다. 데이터 업데이트를 진행합니다.');
      
      // 모든 클럽 데이터를 최신 예제 데이터로 업데이트
      const batch = [];
      
      // 기존 문서 ID를 유지하면서 mockClubs의 신규/업데이트된 데이터로 업데이트
      for (const mockClub of mockClubs) {
        // 기존 문서가 있는지 확인
        const existingClubDoc = snapshot.docs.find(doc => doc.id === mockClub.id);
        const clubRef = doc(db, 'clubs', mockClub.id);
        
        if (existingClubDoc) {
          // 기존 문서가 있으면 필드 업데이트 (기존 데이터 유지하면서 새 필드 추가)
          const existingData = existingClubDoc.data() as Club;
          
          // 롤링페이퍼 필드 추가/업데이트
          if (!existingData.rollingPaper || existingData.rollingPaper.length === 0) {
            batch.push(updateDoc(clubRef, { 
              rollingPaper: mockClub.rollingPaper || [],
              updatedAt: serverTimestamp()
            }));
            logInfo(`클럽 ID: ${mockClub.id}에 롤링페이퍼 필드 추가됨`);
          }
        } else {
          // 기존 문서가 없으면 새로 생성
          const clubWithTimestamp = {
            ...mockClub,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            rollingPaper: mockClub.rollingPaper || []
          };
          
          batch.push(setDoc(clubRef, clubWithTimestamp));
          logInfo(`새 클럽 문서 생성: ${mockClub.id}`);
        }
      }
      
      // 배치 작업 실행
      if (batch.length > 0) {
        await Promise.all(batch);
        logInfo(`${batch.length}개의 클럽 데이터 업데이트 완료`);
      } else {
        logInfo('업데이트할 데이터가 없습니다');
      }
    }
  } catch (error) {
    logError('Firebase 데이터 초기화 실패', error);
    throw error;
  }
};

// 동아리 랭킹 계산
export const getRankedClubs = (clubs: Club[]): RankingClub[] => {
  // 멤버 수를 기준으로 정렬
  return [...clubs]
    .sort((a, b) => b.members.length - a.members.length)
    .map((club, index) => ({
      ...club,
      rank: index + 1,
    }));
};

// 이미지 업로드
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    logInfo(`이미지 업로드 시작: ${path}`);
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    logInfo('이미지 업로드 완료', downloadUrl);
    return downloadUrl;
  } catch (error) {
    logError(`이미지 업로드 실패: ${path}`, error);
    throw error;
  }
};

// 멤버 추가 및 프로필 이미지 업로드
export const addClubMemberWithAvatar = async (
  clubId: string, 
  memberData: Omit<Member, 'id'>,
  avatarDataUrl?: string
): Promise<Member> => {
  try {
    logInfo(`${clubId} 클럽에 멤버 추가`, memberData);
    
    // 아바타 이미지가 있으면 먼저 Storage에 업로드
    let profileImage = memberData.profileImage;
    
    if (avatarDataUrl) {
      // 데이터 URL을 파일로 변환
      const byteString = atob(avatarDataUrl.split(',')[1]);
      const mimeString = avatarDataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], `avatar-${Date.now()}.png`, { type: 'image/png' });
      
      // 이미지 Storage에 업로드
      const avatarPath = `avatars/${clubId}/${Date.now()}-${file.name}`;
      profileImage = await uploadImage(file, avatarPath);
      logInfo('아바타 이미지 업로드 완료', profileImage);
    }
    
    // 멤버 데이터에 이미지 URL 추가
    const updatedMemberData = {
      ...memberData,
      profileImage
    };
    
    // 멤버 추가 함수 호출
    return await addMember(clubId, updatedMemberData);
    
  } catch (error) {
    logError(`멤버 추가 및 아바타 업로드 실패: ${clubId}`, error);
    throw error;
  }
};

// 기존 멤버의 아바타 업데이트
export const updateMemberAvatar = async (
  clubId: string,
  memberId: string,
  avatarDataUrl: string
): Promise<string> => {
  try {
    logInfo(`멤버 아바타 업데이트: ${clubId}/${memberId}`);
    
    // 데이터 URL을 파일로 변환
    const byteString = atob(avatarDataUrl.split(',')[1]);
    const mimeString = avatarDataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], `avatar-${Date.now()}.png`, { type: 'image/png' });
    
    // 이미지 Storage에 업로드
    const avatarPath = `avatars/${clubId}/${memberId}-${Date.now()}.png`;
    const profileImageUrl = await uploadImage(file, avatarPath);
    
    // 클럽 문서 조회
    const clubRef = doc(db, 'clubs', clubId);
    const clubDoc = await getDoc(clubRef);
    
    if (!clubDoc.exists()) {
      throw new Error('클럽을 찾을 수 없습니다.');
    }
    
    const clubData = clubDoc.data() as Club;
    
    // 멤버 찾기 및 업데이트
    const memberIndex = clubData.members.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) {
      throw new Error('멤버를 찾을 수 없습니다.');
    }
    
    // 멤버의 프로필 이미지 업데이트
    const updatedMembers = [...clubData.members];
    updatedMembers[memberIndex] = {
      ...updatedMembers[memberIndex],
      profileImage: profileImageUrl
    };
    
    // Firestore에 업데이트
    await updateDoc(clubRef, { 
      members: updatedMembers,
      updatedAt: serverTimestamp()
    });
    
    logInfo('멤버 아바타 업데이트 완료', profileImageUrl);
    return profileImageUrl;
    
  } catch (error) {
    logError(`멤버 아바타 업데이트 실패: ${clubId}/${memberId}`, error);
    throw error;
  }
}; 