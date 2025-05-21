import type { Club } from '../types';
import { v4 as uuidv4 } from 'uuid';

// 멤버 이름 목록
const memberNames = [
  '김민지', '이준호', '박서연', '정우진', '최예린', 
  '한도윤', '유준영', '오하은', '신동민', '황민서',
  '백지원', '서동현', '임세진', '권나영', '장현우',
  '윤소희', '조민준', '강지은', '문준혁', '노하린'
];

// 학과 목록
const departments = [
  '컴퓨터공학과', '전자공학과', '경영학과', '심리학과', '디자인학과',
  '생명공학과', '기계공학과', '화학공학과', '건축학과', '의학과',
  '영문학과', '국문학과', '수학과', '물리학과', '철학과'
];

// 랜덤 아바타 이미지 URL 생성 함수
const getRandomAvatar = () => {
  const characterTypes = ['blue', 'yellow'];
  const characterType = characterTypes[Math.floor(Math.random() * characterTypes.length)];
  const characterNumber = Math.floor(Math.random() * 4) + 1;
  return `/src/assets/characters/${characterType}_character${characterNumber}.png`;
};

// 랜덤 날짜 생성 함수 (n일 전)
const getDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const mockClubs: Club[] = [
  {
    id: uuidv4(),
    name: '하모니',
    description: '음악을 사랑하는 학생들이 모여 다양한 장르의 음악을 연주하고 공연하는 동아리입니다. 매년 정기공연과 교내 행사 참여를 통해 활발히 활동하고 있습니다.',
    department: '음악학과',
    members: Array.from({ length: 18 }, (_, i) => ({
      id: uuidv4(),
      name: memberNames[i % memberNames.length],
      profileImage: getRandomAvatar(),
    })),
    activities: [
      {
        id: uuidv4(),
        content: '하모니 가을 정기공연 "별빛 속에"를 성황리에 마쳤습니다. 총 300명의 관객이 참석해주셨고, 앙코르 요청도 많이 받았습니다. 모든 멤버들의 노력에 감사드립니다!',
        author: '동아리장 김민지',
        createdAt: getDaysAgo(2)
      },
      {
        id: uuidv4(),
        content: '교내 축제 무대 공연을 위한 리허설을 진행했습니다. 남은 일주일 동안 마지막 연습에 최선을 다하겠습니다. 많은 응원 부탁드려요!',
        author: '총무 이준호',
        createdAt: getDaysAgo(10)
      },
      {
        id: uuidv4(),
        content: '신입 멤버 오디션 결과, 10명의 새로운 멤버가 하모니 가족이 되었습니다! 환영합니다~ 앞으로 함께 멋진 음악을 만들어가요.',
        author: '부동아리장 박서연',
        createdAt: getDaysAgo(15)
      }
    ],
    rollingPaper: [
      {
        id: uuidv4(),
        content: '하모니 덕분에 대학 생활이 정말 즐거워요! 매주 합주하는 시간이 제일 행복합니다. 특히 이준호 선배님의 기타 연주는 정말 감동적이에요. 앞으로도 좋은 음악 많이 들려주세요!',
        author: '익명',
        createdAt: getDaysAgo(5)
      },
      {
        id: uuidv4(),
        content: '지난 정기공연 때 "별빛 속에" 노래가 너무 좋았어요. CD 나오면 꼭 사고싶습니다! 하모니 파이팅!',
        author: '음악 애호가',
        createdAt: getDaysAgo(8)
      }
    ]
  },
  {
    id: uuidv4(),
    name: '코딩사파리',
    description: '프로그래밍과 소프트웨어 개발에 관심 있는 학생들이 모여 다양한 프로젝트를 진행하고 스터디를 운영하는 동아리입니다. 초보자부터 전문가까지 모두 환영합니다.',
    department: '컴퓨터공학과',
    members: Array.from({ length: 30 }, (_, i) => ({
      id: uuidv4(),
      name: memberNames[(i + 3) % memberNames.length],
      profileImage: getRandomAvatar(),
    })),
    activities: [
      {
        id: uuidv4(),
        content: '코딩사파리 2023 해커톤이 성공적으로 마무리되었습니다! 총 8개 팀, 32명의 학생들이 참가해 24시간 동안 열정적으로 코딩했습니다. 최우수상은 "에코트래커" 팀의 환경 모니터링 앱이 차지했습니다. 모든 참가자분들 정말 고생하셨고, 후원해주신 기업들에게도 감사드립니다. 다음 해커톤은 내년 봄학기에 더 큰 규모로 찾아올 예정입니다!',
        author: '정우진',
        createdAt: getDaysAgo(2)
      },
      {
        id: uuidv4(),
        content: '웹 개발 입문 스터디 모집합니다! HTML, CSS, JavaScript 기초부터 React까지 12주 커리큘럼으로 진행됩니다. 프로그래밍 경험이 없어도 괜찮습니다. 모집 인원은 15명이며, 매주 화요일 저녁 6시에 공학관 403호에서 만납니다. 신청은 동아리 홈페이지에서 가능합니다!',
        author: '신동민',
        createdAt: getDaysAgo(7)
      },
      {
        id: uuidv4(),
        content: '안드로이드 앱 개발 워크샵을 이번 주 토요일에 진행합니다. Kotlin을 사용한 간단한 투두리스트 앱을 만들어보는 시간을 가질 예정입니다. 노트북과 안드로이드 스튜디오 설치만 미리 해오시면 됩니다. 비회원도 참가 가능하니 관심 있는 친구들에게 공유해주세요!',
        author: '황민서',
        createdAt: getDaysAgo(12)
      }
    ],
    rollingPaper: [
      {
        id: uuidv4(),
        content: '코딩사파리 덕분에 개발자의 꿈을 키울 수 있었어요! 특히 웹개발 스터디가 정말 도움이 많이 되었습니다. 신동민 선배님 강의 최고였어요!',
        author: '컴공 20학번',
        createdAt: getDaysAgo(4)
      },
      {
        id: uuidv4(),
        content: '해커톤 정말 재미있었습니다! 비전공자임에도 팀원들이 잘 이끌어줘서 무사히 프로젝트를 완성할 수 있었어요. 다음 해커톤도 꼭 참가할게요!',
        author: '경영학과 학생',
        createdAt: getDaysAgo(9)
      }
    ]
  },
  {
    id: uuidv4(),
    name: '창업연구회',
    description: '창업에 관심 있는 학생들이 모여 비즈니스 아이디어를 발전시키고, 실제 창업 프로젝트를 진행하는 동아리입니다. 다양한 전공의 학생들이 모여 시너지를 만들어냅니다.',
    department: '경영학과',
    members: Array.from({ length: 16 }, (_, i) => ({
      id: uuidv4(),
      name: memberNames[(i + 15) % memberNames.length],
      profileImage: getRandomAvatar(),
    })),
    activities: [
      {
        id: uuidv4(),
        content: '교내 창업 경진대회에서 우리 동아리 "스마트러닝" 팀이 대상을 수상했습니다! AI 기반 맞춤형 학습 플랫폼이라는 아이디어로, 심사위원들로부터 "실현 가능성과 시장성이 뛰어나다"는 평가를 받았습니다. 특히 비즈니스 모델 설계가 탁월했다고 합니다. 백지원, 황민서, 서동현 팀원 모두 축하합니다! 🏆💡',
        author: '백지원',
        createdAt: getDaysAgo(6)
      },
      {
        id: uuidv4(),
        content: '다음 주 수요일에 "스타트업 자금조달 전략" 특강이 있습니다. 강사는 벤처캐피탈 "Next Investment"의 김태호 대표님이십니다. 창업 초기 단계에서 투자 유치를 위한 실질적인 전략과 팁을 알려주실 예정입니다. 장소는 경영관 108호, 시간은 오후 4시부터 6시까지입니다. 비회원도 참석 가능합니다!',
        author: '권나영',
        createdAt: getDaysAgo(11)
      },
      {
        id: uuidv4(),
        content: '2023년 2학기 신입 회원을 모집합니다! 창업에 관심 있는 모든 학생들을 환영합니다. 전공 제한은 없으며, 다양한 배경을 가진 학생들의 지원을 기다립니다. 모집 기간은 9월 4일부터 15일까지이며, 지원서는 동아리 홈페이지에서 다운로드 받을 수 있습니다. 궁금한 점은 인스타그램 DM으로 문의해주세요.',
        author: '서동현',
        createdAt: getDaysAgo(18)
      }
    ],
    rollingPaper: [
      {
        id: uuidv4(),
        content: '창업연구회 덕분에 사업 아이디어를 구체화할 수 있었어요! 멘토링 프로그램이 특히 도움이 많이 되었습니다. 감사합니다!',
        author: '예비창업자',
        createdAt: getDaysAgo(3)
      },
      {
        id: uuidv4(),
        content: '경영학과 학생이 아님에도 친절하게 받아주셔서 감사해요. 다양한 전공의 사람들과 아이디어를 나눌 수 있어 정말 좋은 경험이었습니다!',
        author: '공대생',
        createdAt: getDaysAgo(14)
      }
    ]
  },
  {
    id: uuidv4(),
    name: '그린어스',
    description: '환경 보호와 지속 가능한 생활을 추구하는 동아리입니다. 캠퍼스 내 환경 개선 활동, 지역 사회 환경 캠페인, 제로 웨이스트 워크샵 등을 정기적으로 진행합니다.',
    department: '환경공학과',
    members: Array.from({ length: 22 }, (_, i) => ({
      id: uuidv4(),
      name: memberNames[(i + 7) % memberNames.length],
      profileImage: getRandomAvatar(),
    })),
    activities: [
      {
        id: uuidv4(),
        content: '지난 주말 한강 정화 활동에 참여해주신 25명의 회원분들께 감사드립니다! 총 32kg의 쓰레기를 수거했으며, 특히 플라스틱 쓰레기가 가장 많았습니다. 활동 사진은 인스타그램에 업로드되었으니 확인해주세요. 다음 정화 활동은 다음 달 첫째 주 토요일에 북한산에서 진행될 예정입니다.',
        author: '조민준',
        createdAt: getDaysAgo(4)
      },
      {
        id: uuidv4(),
        content: '이번 주 목요일 오후 5시부터 학생회관 2층에서 제로웨이스트 생활용품 만들기 워크샵을 진행합니다! 천연 비누와 샴푸바를 직접 만들어볼 예정이니 관심 있으신 분들은 참가신청 해주세요. 재료비는 5천원이며, 완성품은 가져가실 수 있습니다. 비회원도 참여 가능합니다!',
        author: '노하린',
        createdAt: getDaysAgo(9)
      },
      {
        id: uuidv4(),
        content: '교내 분리수거 개선 프로젝트 최종 보고서가 완성되었습니다! 지난 학기 동안 진행한 캠퍼스 쓰레기통 실태조사와 개선안을 담았습니다. 다음 주에 학교 시설관리처에 제출할 예정이니, 혹시 추가 의견 있으신 분들은 내일까지 알려주세요. 보고서는 동아리 드라이브에 업로드했습니다.',
        author: '문준혁',
        createdAt: getDaysAgo(14)
      }
    ],
    rollingPaper: [
      {
        id: uuidv4(),
        content: '그린어스의 활동 덕분에 환경에 대한 인식이 많이 바뀌었어요! 특히 제로웨이스트 워크샵이 실생활에 도움이 많이 되었습니다. 앞으로도 좋은 활동 부탁드려요!',
        author: '환경 지킴이',
        createdAt: getDaysAgo(6)
      },
      {
        id: uuidv4(),
        content: '한강 정화 활동에 참여했었는데, 정말 의미 있는 시간이었습니다. 작은 실천이 모여 큰 변화를 만든다는 것을 느꼈어요. 그린어스 파이팅!',
        author: '참가자',
        createdAt: getDaysAgo(10)
      }
    ]
  },
  {
    id: uuidv4(),
    name: '미래탐험대',
    description: '과학기술의 최신 트렌드를 탐구하고 미래 기술에 대한 이해를 넓히는 동아리입니다. 로봇공학, 인공지능, 우주과학, 바이오테크놀로지 등 다양한 분야의 스터디와 프로젝트를 진행합니다.',
    department: '물리학과',
    members: Array.from({ length: 30 }, (_, i) => ({
      id: uuidv4(),
      name: memberNames[(i + 11) % memberNames.length],
      profileImage: getRandomAvatar(),
    })),
    activities: [
      {
        id: uuidv4(),
        content: '10월 과학기술 심포지엄 발표자를 모집합니다! 올해 주제는 "2050년, 기술이 바꿀 우리의 일상"입니다. 미래 기술에 관한 자유로운 주제로 15-20분 발표를 준비해주시면 됩니다. 신청은 이번 주 금요일까지 구글폼으로 받습니다. 발표자로 선정되시면 소정의 상품과 활동 증명서를 드립니다!',
        author: '한도윤',
        createdAt: getDaysAgo(5)
      },
      {
        id: uuidv4(),
        content: 'AI 연구팀에서 개발한 "캠퍼스 길찾기 AI 어시스턴트"가 학교 공식 앱에 탑재될 예정입니다! 1년간 열심히 개발한 프로젝트가 드디어 결실을 맺게 되었네요. 특히 이준호, 윤소희, 서동현 팀원들 정말 수고 많으셨습니다. 다음 달부터 학생들이 사용할 수 있을 것으로 예상됩니다.',
        author: '이준호',
        createdAt: getDaysAgo(8)
      },
      {
        id: uuidv4(),
        content: '로봇공학팀의 신규 프로젝트 "스마트 리사이클러" 첫 회의가 다음 주 월요일 오후 6시에 공학관 305호에서 진행됩니다. 쓰레기를 자동으로 분류하는 로봇 개발이 목표입니다. 기계공학, 전자공학, 소프트웨어 개발에 관심 있으신 분들의 참여를 환영합니다. 회의 참석 여부를 카카오톡 단체방에 알려주세요!',
        author: '최예린',
        createdAt: getDaysAgo(13)
      }
    ],
    rollingPaper: [
      {
        id: uuidv4(),
        content: '미래탐험대 덕분에 과학에 대한 흥미가 생겼어요! 특히 우주과학 세미나는 정말 눈이 열리는 경험이었습니다. 앞으로도 더 많은 세미나 기대할게요!',
        author: '우주 덕후',
        createdAt: getDaysAgo(7)
      },
      {
        id: uuidv4(),
        content: '로봇 프로젝트에 참여할 수 있어서 영광이었습니다. 비전공자임에도 친절하게 알려주셔서 많이 배울 수 있었어요. 다음 프로젝트도 참여하고 싶습니다!',
        author: '로봇 좋아하는 문과생',
        createdAt: getDaysAgo(11)
      }
    ]
  },
  {
    id: uuidv4(),
    name: '문학동아리 책갈피',
    description: '문학 작품을 읽고 토론하며, 직접 글을 쓰고 발표하는 독서 및 창작 동아리입니다. 매년 문집을 발간하고 시 낭송회를 개최합니다.',
    department: '인문학과',
    members: Array.from({ length: 14 }, (_, i) => ({
      id: uuidv4(),
      name: memberNames[(i + 20) % memberNames.length],
      profileImage: getRandomAvatar(),
    })),
    activities: [
      {
        id: uuidv4(),
        content: '책갈피 문집 "별들의 조각"이 마침내 출간되었습니다! 20명의 회원들이 1년간 쓴 시, 소설, 에세이를 모아 만든 이번 문집은 500부 한정으로 제작되었습니다. 학교 축제 기간 동안 중앙도서관 앞에서 배부할 예정이니 많은 관심 부탁드립니다. 모든 회원분들, 특히 편집을 맡아주신 고우진, 이지안 님 정말 수고 많으셨습니다! 📚✒️',
        author: '고우진',
        createdAt: getDaysAgo(1)
      },
      {
        id: uuidv4(),
        content: '이번 주 독서 토론은 한강의 "채식주의자"였습니다. 주인공의 선택에 대한 다양한 해석과, 사회적 억압에 대한 심도 있는 토론이 이어졌습니다. 특히 "식물이 되고 싶은 욕망"에 대한 상징성 논의가 흥미로웠습니다. 다음 주는 김영하의 "살인자의 기억법"입니다.',
        author: '이지안',
        createdAt: getDaysAgo(11)
      },
      {
        id: uuidv4(),
        content: '지역 문학상 공모전에서 우리 동아리 회원 박민지 님이 단편소설 부문 우수상을 수상했습니다! "푸른 방의 기억"이라는 작품으로, 심사위원들로부터 "섬세한 감정 묘사와 독창적 구성"이라는 호평을 받았습니다. 모두 축하해주세요!',
        author: '김지원',
        createdAt: getDaysAgo(17)
      },
      {
        id: uuidv4(),
        content: '교내 시 낭송회를 개최했습니다. "봄의 속삭임"이라는 주제로, 15명의 회원들이 자작시와 좋아하는 시를 낭송하는 시간이었습니다. 특히 배경 음악과 조명을 활용한 연출이 분위기를 더욱 특별하게 만들었습니다. 다음 낭송회는 가을에 예정되어 있습니다.',
        author: '이서준',
        createdAt: getDaysAgo(26)
      }
    ],
    rollingPaper: [
      {
        id: uuidv4(),
        content: '책갈피 덕분에 독서의 즐거움을 다시 찾았어요! 다양한 작품을 접하고 깊이 있게 토론하는 시간이 정말 소중합니다. 특히 창작 워크샵은 제 글쓰기 실력 향상에 큰 도움이 되었어요.',
        author: '문학 애호가',
        createdAt: getDaysAgo(2)
      },
      {
        id: uuidv4(),
        content: '시 낭송회에서 처음으로 제 시를 발표했는데, 따뜻한 피드백과 격려를 받아 정말 감동적이었습니다. 책갈피는 서로의 작품을 존중하고 발전시키는 멋진 공간이에요!',
        author: '시 쓰는 대학생',
        createdAt: getDaysAgo(12)
      }
    ]
  }
]; 