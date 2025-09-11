
export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
};

export type Organization = {
  id: string;
  name: string;
  website?: string;
};

export type Deposit = {
  id: string;
  contact_id: string;
  organization_id?: string;
  amount_cents: number;
  status: 'pending' | 'committed' | 'refunded';
  created_at: string;
};

export const contacts: Contact[] = [
  { id: 'c_1', first_name: 'Ada', last_name: 'Lovelace', email: 'ada@example.com' },
  { id: 'c_2', first_name: 'Grace', last_name: 'Hopper', phone: '+1-555-0101' },
];

export const organizations: Organization[] = [
  { id: 'o_1', name: 'Breeder Guild', website: 'https://breeders.example.com' },
  { id: 'o_2', name: 'Happy Paws Rescue' },
];

export const deposits: Deposit[] = [
  { id: 'd_1', contact_id: 'c_1', organization_id: 'o_1', amount_cents: 50000, status: 'committed', created_at: new Date().toISOString() },
  { id: 'd_2', contact_id: 'c_2', amount_cents: 20000, status: 'pending', created_at: new Date().toISOString() },
];
