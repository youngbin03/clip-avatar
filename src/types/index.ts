export interface Club {
  id: string;
  name: string;
  description: string;
  department: string;
  members: Member[];
  activities: Activity[];
  rollingPaper?: RollingPaperEntry[];
}

export interface Member {
  id: string;
  name: string;
  profileImage?: string;
  role?: string;
  department?: string;
  avatar?: string;
}

export interface Activity {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface RollingPaperEntry {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface RankingClub extends Club {
  rank: number;
} 