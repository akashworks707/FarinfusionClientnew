export interface ILead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  hasOrderedToday?: boolean;
  assignedBy: {
    name: string;
    role: string;
    email: string;
  };
  status?: string;
  priority?: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
};

export interface ILeadResponse {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  priority: string;
  assignedBy: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ILeadApiResponse {
  data: ILead;
}
