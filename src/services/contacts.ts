import { uuid } from "../util/identifier.ts";

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
  id: string;
  name: string;
  numbers: Number[];
  photo?: string;
  bio?: string;
}

export enum QueryKeys {
  contacts = "contacts",
  contact = "contact",
  features = "features",
}

interface Data {
  contacts: Contact[];
  features: Contact[];
}

let contacts: Contact[] | null = null;


export async function get(id: string): Promise<Contact> {
  console.log(`Fetching contact ${id}`)
  return fetchAll().then(contacts => {
    const contact = contacts.find(contact => contact.id === id)
    if (!contact) {
      throw new Error("Contact not found");
    }
    return contact;
  });
}

export async function getAll(): Promise<Contact[]> {
  console.log('Fetching contacts');
  return fetchAll();
}

async function fetchAll(): Promise<Contact[]> {
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

export async function save(contact: Contact): Promise<Contact> {
  console.log("Save contact", contact.id);

  await fetchAll()

  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      const oldContact = contacts!.find(c => c.id === contact.id)
      if (oldContact) {
        oldContact.name = contact.name;
        oldContact.numbers = contact.numbers;
        oldContact.photo = contact.photo;
        oldContact.bio = contact.bio;
      } else {
        contact.id = uuid();
        contacts!.push(contact);
      }
      resolve(contact);
    });
  });
}

export async function remove(id: string): Promise<boolean> {
  console.log("Deleting contact");

  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      contacts = contacts!.filter(contact => contact.id !== id);
      resolve(true);
    }, 1000);
  })
}

export async function getFeatureAll(): Promise<Contact[]> {
  const response = await fetch('/data.json');

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
  }

  const data: Data = await response.json();
  return data.features;
}

export async function importContacts(newContacts: Contact[]): Promise<boolean> {
  fetchAll();

  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      newContacts = newContacts.map(c => { return {
        id: uuid(),
        name: c.name,
        numbers: c.numbers,
        bio: c.bio,
      }})
      contacts!.push(...newContacts);
      resolve(true);
    }, 1000)
  });
}

export interface Contact {
  id: string;
  name: string;
  numbers: Number[];
  photo?: string;
  bio?: string;
}

export default {
  QueryKeys,
  getAll,
  get,
  save,
  remove,
  getFeatureAll,
};
