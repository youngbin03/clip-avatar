import OpenAI from 'openai';
import { storage } from '../firebase/config';
import { ref, getDownloadURL } from 'firebase/storage';

// 로깅 함수 - Firebase 서비스의 로깅 함수를 직접 구현
const logInfo = (message: string, data?: any) => {
  console.log(`[OpenAI] ${message}`, data ? data : '');
};

const logError = (message: string, error?: any) => {
  console.error(`[OpenAI] ${message}`, error ? error : '');
};

// OpenAI API 클라이언트 초기화
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
if (!apiKey) {
  console.warn('OpenAI API 키가 설정되지 않았습니다. .env 파일에 VITE_OPENAI_API_KEY를 추가해주세요.');
}

const openai = new OpenAI({
  apiKey: apiKey, // .env 파일에 API 키 필요
  dangerouslyAllowBrowser: true // 브라우저 환경에서 실행 허용 (실제 프로덕션에서는 서버 사이드로 이동 권장)
});

// 스타일 이미지 경로 목록
const STYLE_IMAGES = [
  '/src/assets/styles/dylan-1747776730297.png',
  '/src/assets/styles/dylan-1747776732343.png',
  '/src/assets/styles/dylan-1747776734884.png',
  '/src/assets/styles/dylan-1747776737337.png',
  '/src/assets/styles/dylan-1747776739302.png',
  '/src/assets/styles/dylan-1747776742048.png',
  '/src/assets/styles/dylan-1747776746317.png',
  '/src/assets/styles/dylan-1747776747931.png',
  '/src/assets/styles/dylan-1747776750730.png',
  '/src/assets/styles/dylan-1747776752903.png',
  '/src/assets/styles/dylan-1747776755022.png',
  '/src/assets/styles/dylan-1747776757803.png',
  '/src/assets/styles/dylan-1747776760378.png',
  '/src/assets/styles/dylan-1747776762628.png',
  '/src/assets/styles/dylan-1747776764936.png',
  '/src/assets/styles/dylan-1747776767139.png'
];

// 이미지 데이터 URL을 File 객체로 변환 (PNG 형식으로)
const dataURLtoFile = async (dataURL: string, filename: string): Promise<File> => {
  // 데이터 URL이 PNG가 아닌 경우 캔버스를 사용하여 PNG로 변환
  if (!dataURL.startsWith('data:image/png')) {
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');
    
    // 이미지 로드 완료 후 캔버스에 그리기
    return new Promise<File>((resolve) => {
      img.onload = () => {
        // 이미지 크기 설정 (필요시 리사이징)
        const maxSize = 800; // 최대 너비/높이
        let width = img.width;
        let height = img.height;
        
        // 이미지 크기 조정 (큰 이미지의 경우)
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round(height * (maxSize / width));
            width = maxSize;
          } else {
            width = Math.round(width * (maxSize / height));
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // 캔버스에 이미지 그리기
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // PNG 형식으로 데이터 URL 추출
        const pngDataURL = canvas.toDataURL('image/png');
        
        // 데이터 URL에서 파일 생성
        const arr = pngDataURL.split(',');
        const mime = 'image/png';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        
        // PNG 파일 생성
        resolve(new File([u8arr], filename, { type: mime }));
      };
      
      // 이미지 소스 설정
      img.src = dataURL;
    });
  } else {
    // 이미 PNG인 경우 기존 처리
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
};

/**
 * 스타일 이미지를 로드하고 File 객체로 변환하는 함수
 * @param stylePath 스타일 이미지 경로
 * @returns 스타일 이미지 File 객체
 */
const loadStyleImage = async (stylePath: string): Promise<File> => {
  try {
    let imageUrl;
    
    // 스토리지 경로 형식인지 확인
    if (stylePath.startsWith('/src/assets/styles/')) {
      // 파일명만 추출
      const fileName = stylePath.split('/').pop() || '';
      // Firebase Storage 경로 구성
      const storagePath = `styles/${fileName}`;
      
      try {
        // Firebase Storage에서 다운로드 URL 가져오기 시도
        const storageRef = ref(storage, storagePath);
        imageUrl = await getDownloadURL(storageRef);
        logInfo(`Firebase Storage에서 이미지 URL 가져옴: ${imageUrl}`);
      } catch (storageError) {
        // Storage에서 가져오기 실패하면 로컬 경로 사용
        logInfo(`Firebase Storage 경로 실패, 로컬 경로 사용: ${stylePath}`);
        imageUrl = stylePath;
      }
    } else {
      // 일반 경로 사용
      imageUrl = stylePath;
    }
    
    // 절대 경로인지 확인하고 조정
    if (imageUrl.startsWith('/')) {
      // 상대 경로를 현재 URL 기준으로 변환
      const baseUrl = window.location.origin;
      imageUrl = `${baseUrl}${imageUrl}`;
    }
    
    logInfo(`이미지 로드 시도: ${imageUrl}`);
    
    // 이미지 로드 시도
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`스타일 이미지 로드 실패: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return new File([blob], `style-image-${Date.now()}.png`, { type: 'image/png' });
  } catch (error) {
    logError(`스타일 이미지 로드 실패: ${stylePath}`, error);
    throw error;
  }
};

/**
 * 웹캠으로 촬영한 이미지를 캐릭터 스타일로 변환
 * @param imageDataUrl 웹캠으로 촬영한 이미지 (data URL 형식)
 * @returns 변환된 캐릭터 이미지 (URL 형식)
 */
export const generateCharacterAvatar = async (imageDataUrl: string): Promise<string> => {
  try {
    logInfo('캐릭터 아바타 생성 시작');
    
    // 이미지 데이터 URL을 PNG File 객체로 변환
    const imageFile = await dataURLtoFile(imageDataUrl, 'webcam-photo.png');
    
    // 파일 크기 확인 (4MB 제한)
    if (imageFile.size > 4 * 1024 * 1024) {
      throw new Error('이미지 크기가 4MB를 초과합니다. 더 작은 이미지로 시도해주세요.');
    }
    
    // 스타일 이미지 선택 (랜덤)
    const styleImages = [
      '/src/assets/styles/dylan-1747776730297.png',
      '/src/assets/styles/dylan-1747776732343.png',
      '/src/assets/styles/dylan-1747776734884.png',
      '/src/assets/styles/dylan-1747776737337.png',
      '/src/assets/styles/dylan-1747776739302.png',
      '/src/assets/styles/dylan-1747776742048.png',
      '/src/assets/styles/dylan-1747776746317.png',
      '/src/assets/styles/dylan-1747776747931.png',
      '/src/assets/styles/dylan-1747776750730.png',
      '/src/assets/styles/dylan-1747776752903.png',
      '/src/assets/styles/dylan-1747776755022.png',
      '/src/assets/styles/dylan-1747776757803.png',
      '/src/assets/styles/dylan-1747776760378.png',
      '/src/assets/styles/dylan-1747776762628.png',
      '/src/assets/styles/dylan-1747776764936.png',
      '/src/assets/styles/dylan-1747776767139.png'
    ];
    
    // 랜덤하게 스타일 이미지 선택
    const selectedStyleImage = styleImages[Math.floor(Math.random() * styleImages.length)];
    logInfo(`선택된 스타일 이미지: ${selectedStyleImage}`);
    
    try {
      // 스타일 이미지 로드
      const styleImageFile = await loadStyleImage(selectedStyleImage);
      logInfo('스타일 이미지 로드 성공');
      
      // 프롬프트 구성 (스타일 참조 이미지 설명)
      const prompt = `
        이 사진을 제공된 스타일 이미지와 유사한 캐릭터로 변환해주세요.
        - 파란색 또는 노란색 계열의 귀여운 캐릭터 스타일로 만들어주세요
        - 얼굴 형태와 머리 스타일은 원본 사진을 참고하세요
        - 배경은 투명하거나 단색으로 만들어주세요
        - 단순화된 귀여운 캐릭터 스타일로 변환해주세요
        - 선명하고 깔끔한 외곽선을 사용해주세요
      `;
      
      logInfo('OpenAI API 호출 - 이미지 편집 시작');
      logInfo('이미지 형식: ' + imageFile.type + ', 크기: ' + (imageFile.size / 1024 / 1024).toFixed(2) + 'MB');
      
      // OpenAI edit API를 사용하여 이미지 변환
      const response = await openai.images.edit({
        model: "gpt-image-1",
        image: imageFile,
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "high",
        response_format: "b64_json"
      });
      
      // 응답 구조 출력
      console.log('OpenAI 응답:', JSON.stringify(response, null, 2));
      
      // 응답에서 이미지 데이터 추출
      if (!response.data || response.data.length === 0) {
        throw new Error('이미지 생성 실패: 응답에 이미지 데이터가 없습니다.');
      }
      
      // URL 또는 base64 데이터 확인
      const imageData = response.data[0];
      let resultImageUrl: string;
      
      if (imageData.url) {
        // URL이 있는 경우 해당 URL 사용
        resultImageUrl = imageData.url;
        logInfo('URL 형식으로 이미지 생성 완료', resultImageUrl);
      } else if (imageData.b64_json) {
        // base64 인코딩된 이미지가 있는 경우 data URL로 변환
        resultImageUrl = `data:image/png;base64,${imageData.b64_json}`;
        logInfo('Base64 형식으로 이미지 생성 완료');
      } else {
        throw new Error('이미지 생성 실패: 응답에서 이미지 데이터를 찾을 수 없습니다.');
      }
      
      return resultImageUrl;
      
    } catch (styleError) {
      // 스타일 이미지 로드 실패 또는 API 오류 시 fallback 방식으로 일반 생성 API 사용
      logError('스타일 이미지 처리 실패, 일반 생성 API로 대체합니다', styleError);
      
      // 캐릭터 스타일 프롬프트 (스타일 이미지 없이)
      const fallbackPrompt = `
        사람 얼굴을 귀여운 캐릭터로 변환해주세요:
        
        스타일 특성:
        1. 간결하고 귀여운 일러스트레이션 스타일로 표현
        2. 파란색 및 노란색 계열 색상 사용 (메인 캐릭터 파렛트)
        3. 깔끔한 외곽선과 단순화된 특징
        4. 배경은 투명하거나 매우 간단한 단색으로 처리
        5. 얼굴 비율을 귀엽게 변형하되 원본 인물의 특징 유지
        6. 양식화된 표현을 사용하여 캐릭터 느낌 강조
        
        사람의 얼굴형, 헤어스타일, 눈/코/입의 특징을 유지하면서도 귀여운 캐릭터로 변환해주세요.
      `;
      
      // fallback: 일반 이미지 생성 API 사용
      const fallbackResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: fallbackPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "vivid",
        response_format: "b64_json"
      });
      
      // 응답 구조 출력
      console.log('OpenAI Fallback 응답:', JSON.stringify(fallbackResponse, null, 2));
      
      // 응답에서 이미지 데이터 추출
      if (!fallbackResponse.data || fallbackResponse.data.length === 0) {
        throw new Error('이미지 생성 실패: 응답에 이미지 데이터가 없습니다.');
      }
      
      // URL 또는 base64 데이터 확인
      const imageData = fallbackResponse.data[0];
      let resultImageUrl: string;
      
      if (imageData.url) {
        // URL이 있는 경우 해당 URL 사용
        resultImageUrl = imageData.url;
        logInfo('URL 형식으로 이미지 생성 완료 (fallback)', resultImageUrl);
      } else if (imageData.b64_json) {
        // base64 인코딩된 이미지가 있는 경우 data URL로 변환
        resultImageUrl = `data:image/png;base64,${imageData.b64_json}`;
        logInfo('Base64 형식으로 이미지 생성 완료 (fallback)');
      } else {
        throw new Error('이미지 생성 실패: 응답에서 이미지 데이터를 찾을 수 없습니다.');
      }
      
      return resultImageUrl;
    }
    
  } catch (error) {
    logError('캐릭터 아바타 생성 실패', error);
    console.error('OpenAI API 오류 상세 정보:', error);
    
    // 에러가 OpenAI API 형식이면 보다 구체적인 메시지 추출
    const errorObj = error as any;
    if (errorObj.response && errorObj.response.data && errorObj.response.data.error) {
      console.error('OpenAI API 오류 메시지:', errorObj.response.data.error.message);
    }
    
    throw error;
  }
};

// 에러 메시지로부터 사용자 친화적인 메시지 생성
export const getOpenAIErrorMessage = (error: any): string => {
  if (error.status === 429) {
    return '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
  } else if (error.status === 400) {
    return '이미지 처리 중 오류가 발생했습니다. 다른 사진으로 시도해주세요.';
  } else if (error.status === 401) {
    return 'API 인증에 실패했습니다. 관리자에게 문의하세요.';
  }
  
  return '캐릭터 생성 중 오류가 발생했습니다. 다시 시도해주세요.';
}; 
