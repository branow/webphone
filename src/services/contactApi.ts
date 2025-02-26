export enum NumberType {
  WORK = "work",
  HOME = "home",
  MOBILE = "mobile",
}

export interface Number {
  id: string;
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

export enum ContactQueryKeys {
  CONTACTS = "contacts",
}

interface Data {
  contacts: Contact[];
}

let contacts: Contact[] | null = null;

export async function fetchContacts(): Promise<Contact[]> {
  console.log('Fetching contacts');

  if (contacts) {
    return contacts;
  }

  const response = await fetch('/data.json');

  if (!response.ok) {
    throw new Error(`Failed to fetch contacts: ${response.status} ${response.statusText}`)
  }

  const data: Data = await response.json();
  contacts = data.contacts;
  return data.contacts;
}

export interface SaveContact {
  id?: number;
  name: string;
  numbers: Number[];
  photo: string;
  bio: string;
}

export async function saveContact(contact: SaveContact): Promise<Contact> {
  return contact.id ? createContact(contact) : updateContact(contact);
}

async function createContact(contact: SaveContact): Promise<Contact> {
  console.log("Creating contact");

  const newContact = {
    id: Math.round(Math.random() * 1000),
    name: contact.name,
    numbers: contact.numbers,
    photo: contact.photo,
    bio: contact.bio,
  };
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      // _reject(new Error("Some error occurs during creation"));
      contacts!.push(newContact);
      resolve(newContact);
    }, 1000);
  })
}

async function updateContact(contact: SaveContact): Promise<Contact> {
  console.log("Updating contact");

  const newContact = {
    id: contact.id!,
    name: contact.name,
    numbers: contact.numbers,
    photo: contact.photo,
    bio: contact.bio,
  };
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      contacts = contacts!.map(c => {
        if (c.id === newContact.id) {
          return contact as Contact;
        } else {
          return c;
        }
      })
      resolve(newContact);
    }, 1000);
  })
}

export async function deleteContact(id: number): Promise<boolean> {
  console.log("Deleting contact");

  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      contacts = contacts!.filter(contact => contact.id !== id);
      resolve(true);
    }, 1000);
  })
}
