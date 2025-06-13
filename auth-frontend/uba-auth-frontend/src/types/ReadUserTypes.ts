export interface Internship {
  id: number;
  joinedDate: string;
  completionDate: string | null;
  isCertified: boolean;
  mentorName: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: string;
  internships: Internship[];
}

export type FilterType = 'all' | 'withInternships' | 'withoutInternships' | 'certified' | 'uncertified';