import type { PIPELINE_STAGES } from "./constants";

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export type Lead = {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  type: string;
  product: string;
  stage: PipelineStage;
  interestLevel: string;
  businessPotential: string;
  assignedTo: string;
  createdAt: string;
  nextFollowUp: string | null;
  lastContact: string | null;
  notes: string;
};

export type DashboardStats = {
  totalLeads: number;
  qualifiedLeads: number;
  potentialClients: number;
  potentialPartners: number;
  closedDeals: number;
};
