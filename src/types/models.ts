export type EventType = 'Participating' | 'NonParticipating';
export type EventStatus = 'Past' | 'Ongoing';

export interface Event {
  _id: string;
  image?: string;
  title: string;
  eventDate: string;
  description: string;
  cordinatorName: string;
  cordinatorMobile: string;
  eventType: EventType;
  eventStatus: EventStatus;
}

export type InvestmentStage = 'PreSeed' | 'Seed' | 'SeriesA' | 'SeriesB' | 'Growth';

export interface Investor {
  _id: string;
  profileImage?: string;
  name: string;
  firmName: string;
  bio: string;
  investmentFocus: string;
  investmentStage: InvestmentStage;
  investmentRange: string;
  location: string;
  linkedin?: string;
}

export type FundingStage = 'Idea' | 'PreSeed' | 'Seed' | 'SeriesA' | 'SeriesB' | 'Bootstrapped';

export interface Startup {
  _id: string;
  logo?: string;
  companyName: string;
  tagline: string;
  description: string;
  industry: string;
  fundingStage: FundingStage;
  foundedYear: number;
  teamSize: number;
  location: string;
  website?: string;
}
