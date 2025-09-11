const API_URL = import.meta.env.VITE_API_URL

export type Contact = {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
}

export async function listContacts(): Promise<Contact[]> {
  const res = await fetch(`${API_URL}/contacts`)
  if (!res.ok) throw new Error('Failed to load contacts')
  return res.json()
}

export async function createContact(c: Omit<Contact,'id'>): Promise<Contact> {
  const res = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': import.meta.env.VITE_ADMIN_TOKEN as string,
    },
    body: JSON.stringify(c),
  })
  if (!res.ok) throw new Error('Failed to create contact')
  return res.json()
}
