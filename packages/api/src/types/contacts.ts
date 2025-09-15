export type ContactDTO = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  emails: Array<{ address: string; verified?: boolean; preferred?: boolean }>;
  phones: Array<{ number: string; label?: "mobile"|"home"|"work"|"other" }>;
  tags: string[];
  created_at: string; updated_at: string;
  // Optionally provided by Finance service for read-only summary in Contacts UI
  invoices?: Array<{ id:string; status:"paid"|"unpaid"|"partial"|"refunded"; assigned_at?:string }>;
};
