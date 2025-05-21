// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase 구성 정보
const firebaseConfig = {
  apiKey: "AIzaSyDLNteroLxDRLU6Q6cqDYPLXsTLvn3rtVo",
  authDomain: "clip-avatar.firebaseapp.com",
  projectId: "clip-avatar",
  storageBucket: "clip-avatar.appspot.com",
  messagingSenderId: "972885904094",
  appId: "1:972885904094:web:ade7264d0ba3982543904f",
  measurementId: "G-40K3KMKMSD"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 개발 환경에서 오류 로깅 강화
if (import.meta.env.DEV) {
  console.log('개발 환경에서 실행 중 - Firebase 디버깅 활성화');
}

// localStorage에 mock 데이터 사용 여부 설정 (기본값: false로 설정)
export const useMockData = () => {
  const mockDataSetting = localStorage.getItem('useMockData');
  // mockDataSetting이 명시적으로 'true'로 설정된 경우에만 true 반환
  return mockDataSetting === 'true';
};

// mock 데이터 사용 설정
export const setUseMockData = (use: boolean) => {
  localStorage.setItem('useMockData', use ? 'true' : 'false');
  console.log(`모의 데이터 모드 ${use ? '활성화' : '비활성화'}`);
  // 변경 후 페이지 새로고침 (설정 즉시 적용)
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

// 초기 설정: 기본적으로 Firebase 실제 데이터 사용
if (localStorage.getItem('useMockData') === null) {
  localStorage.setItem('useMockData', 'false');
}

export { app, db, storage, analytics }; 