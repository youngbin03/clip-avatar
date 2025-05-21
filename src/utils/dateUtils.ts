/**
 * 날짜 문자열을 포맷팅하는 함수
 * @param dateString ISO 포맷의 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 (YYYY-MM-DD)
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return '날짜 없음';
    }
    
    // 연, 월, 일 추출
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // 시간 추출
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // 오늘 날짜와 비교
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && 
                   date.getMonth() === today.getMonth() && 
                   date.getFullYear() === today.getFullYear();
                   
    if (isToday) {
      return `오늘 ${hours}:${minutes}`;
    }
    
    // 하루 전인지 확인
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() && 
                        date.getMonth() === yesterday.getMonth() && 
                        date.getFullYear() === yesterday.getFullYear();
                        
    if (isYesterday) {
      return `어제 ${hours}:${minutes}`;
    }
    
    // 일주일 이내인지 확인
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    if (date >= oneWeekAgo) {
      const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
      const dayOfWeek = daysOfWeek[date.getDay()];
      return `${dayOfWeek}요일 ${hours}:${minutes}`;
    }
    
    // 그 외의 경우
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('날짜 포맷팅 에러:', error);
    return '날짜 오류';
  }
}; 