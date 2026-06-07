export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export interface SupportTicket {
  _id: string;
  requesterType: 'patient' | 'pharmacy';
  name?: string;
  email?: string;
  subject: string;
  message: string;
  status: TicketStatus;
  adminResponse?: string;
  createdAt: string;
}

export interface AdminStats {
  pendingVerifications: number;
  openTickets: number;
  disabledPharmacies: number;
  totalPharmacies: number;
}
