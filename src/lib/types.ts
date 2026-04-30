export type Language = 'en' | 'th';

export type StaffRole = 'dean' | 'assoc_dean' | 'faculty' | 'researcher' | 'staff' | 'secretary';

export interface StaffMember {
  id: string;
  name: string;
  nameTH: string;
  title: string;
  titleTH: string;
  role: StaffRole;
  department: string;
  departmentTH: string;
  email: string;
  phone?: string;
  photo: string;
  bio: string;
  bioTH: string;
  expertise: string[];
  expertiseTH: string[];
  orcidId?: string;
  order: number;
  active: boolean;
}

export type HighlightType = 'event' | 'celebration' | 'announcement' | 'achievement';

export interface Highlight {
  id: string;
  title: string;
  titleTH: string;
  description: string;
  descriptionTH: string;
  image: string;
  type: HighlightType;
  startDate: string;
  endDate?: string;
  ctaText?: string;
  ctaTextTH?: string;
  ctaUrl?: string;
  active: boolean;
  order: number;
}

export type NewsCategory = 'news' | 'event' | 'research' | 'achievement' | 'announcement';

export interface NewsItem {
  id: string;
  title: string;
  titleTH: string;
  content: string;
  contentTH: string;
  image: string;
  category: NewsCategory;
  publishDate: string;
  author: string;
  authorTH: string;
  featured: boolean;
  active: boolean;
}

export interface AppData {
  staff: StaffMember[];
  highlights: Highlight[];
  news: NewsItem[];
  programImages: Record<string, string>;
}
