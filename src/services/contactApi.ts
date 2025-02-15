export enum NumberType {
  WORK = "work",
  HOME = "home",
  MOBILE = "mobile",
}

export interface Number {
  type: NumberType;
  number: string;
}

export interface Contact {
  id: number;
  name: string;
  numbers: Number[];
  photo: string;
  bio: string;
}

interface Data {
  contacts: Contact[];
}

export async function fetchContacts(): Promise<Contact[]> {
  console.log('fetching contacts');
  const response = await fetch('/data.json');

  if (!response.ok) {
    throw new Error(`Failed to fetch contacts: ${response.status} ${response.statusText}`)
  }

  const data: Data = await response.json();
  return data.contacts;
}

