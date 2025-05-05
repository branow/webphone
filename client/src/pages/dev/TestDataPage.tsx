import { FC } from "react";
import HistoryApi, { Record, CreateRecord, CallStatus } from "../../services/history";
import ContactApi, { ContactDetails, Number, NumberType, CreateContact } from "../../services/contacts";

const TestDataPage: FC = () => {
  const handleGenerate = () => {
    createModels(10).then(m => console.log(m));
  }

  return (
    <div>
      <p>Test Data</p>
      <button onClick={handleGenerate}>Generate</button>
    </div>
  )
}


const firstNames = [
  "James", "John", "Robert", "Michael", "William", "Daving", "Richard", "Olivia",
  "Charlotte", "Sophia", "Isabella", "Emma", "Amelia", "Mia", "Ava", "Evelyn", "Oliver",
  "Jack", "Harry", "Jacob", "Charlie", "Thomas", "George", "Oscar", "Isla", "Poppy",
  "Jessica", "Lily"
];
const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", 
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzales", "Wilson", "Anderson",
  "Taylor", "Evans", "Roberts", "O'Brien", "Murphy", "O'Kelly", "O'Sullivan",
  "Walsh", "Byrne", "O'Ryan", "O'Connor", "O'Neill"
];
const numberTypes = [NumberType.HOME, NumberType.WORK, NumberType.MOBILE];
const callStatuses = [CallStatus.INCOMING, CallStatus.OUTCOMING, CallStatus.FAILED, CallStatus.MISSED];


interface Model {
  contact: ContactDetails;
  records: Record[];
}

async function createModels(n: number): Promise<Model[]> {
  const models: Model[] = [];
  for (let i = 0; i < n; i++) {
    createModel().then(model => models.push(model));
  }
  return models;
}

async function createModel(): Promise<Model> {
  const contact = await createContact();
  const n = randBoolean(0.75) ? randNumber({ max: 10 }) :
      (randBoolean(0.75) ? randNumber({ max: 20 }) :
      (randBoolean(0.5) ? randNumber({ max: 50 }) : randNumber({ max: 100 })));

  const records = [];
  for (let i = 0; i < n; i++) {
    records.push(await createRecord(contact));
  }

  for (let i = 0; i < randNumber({ max: 5 }); i++) {
    records.push(await createRecord());
  }

  return { contact, records };
}

async function createContact(): Promise<ContactDetails> {
  return ContactApi.create(await generateContact());
}

async function createRecord(contact?: ContactDetails): Promise<Record> {
  return HistoryApi.create(generateRecord(contact));
}


async function generateContact(): Promise<CreateContact> {
  const name = randItem(firstNames) + " " + randItem(lastNames);
  const photo = randBoolean(0.75) ? 
    `https://dummyjson.com/image/400x400/${randColor()}/${randColor()}?fontFamily=pacifico&text=${name.replace(" ", "+")}` : 
    undefined
  const bio = randBoolean(1) ? await generateBio() : undefined;
  return {
    name: name,
    numbers: generateNumbers(),
    photoUrl: photo,
    bio: bio,
  };
}

function generateRecord(contact?: ContactDetails): CreateRecord {
  const number = contact ? randItem(contact.numbers).number : randNumber({ max: 999_999_999 }).toString();
  const startDate = randDate({ min: new Date(2024, 10, 1), max: new Date() });
  const endDate = randBoolean(0.8) ? randDate({ min: startDate, max: new Date(startDate.getTime() + 1000 * 60 * 60 * 5) }) : undefined;
  return {
    status: randItem(callStatuses),
    number: number,
    startDate: startDate,
    endDate: endDate,
  }
}

async function generateBio(): Promise<string> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${randNumber({ min: 1, max: 500 })}`);
  const comment = await response.json();
  return comment.body;
}

function generateNumbers(): Number[] {
  const n = randNumber({ min: 1, max: 3 });
  const numbers = [];
  for (let i = 0; i < n; i++) {
    numbers.push(generateNumber());
  }
  return numbers;
}

function generateNumber(): Number {
  return {
    type: randItem(numberTypes),
    number: randNumber({ max: 999_999_999 }).toString(),
  }
}


function randDate({ min, max }: { min?: Date, max: Date }): Date {
  return new Date(randNumber({ min: min?.getTime(), max: max.getTime() }));
}

function randColor(): string {
  return Array.from({ length: 6 }).map(() => randNumber({ max: 15 }).toString(16)).join("");
}

function randBoolean(probability: number): boolean {
  return Math.random() <= probability;
}

function randItem<T>(list: T[]): T {
  return list[randNumber({ max: list.length - 1 })]
}

function randNumber({ min, max } : { min?: number, max: number }): number {
  min = min || 0;
  return Math.ceil(Math.random() * (max - min)) + min
}


export default TestDataPage;
