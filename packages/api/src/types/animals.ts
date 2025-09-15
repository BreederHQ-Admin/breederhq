export type AnimalDTO = {
  id: string;
  name: string;
  sex: "female"|"male";
  breed?: string | null;
  birthdate?: string | null;
  owners?: Array<{ contact_id:string; name:string; is_primary_contact?:boolean; is_resident?:boolean }>;
  last_cycle_at?: string | null;
  documents?: Array<{ id:string; title:string; url:string }>;
  audit?: Array<{ at:string; action:string; by:string }>;
};
