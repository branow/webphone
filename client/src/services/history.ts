import { uuid } from "../util/identifier.ts";

export enum CallStatus {
  INCOMING = "incoming",
  OUTCOMING = "outcoming",
  MISSED = "missed",
  FAILED = "failed",
}

export interface Node {
  id: string;
  number: string;
  status: CallStatus;
  startDate: Date;
  endDate?: Date;
}

export enum QueryKeys {
  history = "history",
}

interface Data {
  history: Node[];
}

let history: Node[] | null = null;

export async function create(node: Node): Promise<Node> {
  console.log("Creating history node");
  await fetchAll();

  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      node.id = uuid();
      history!.push(node);
      console.log(history);
      resolve(node);
    }, 1000);
  });
}


export async function getAll(): Promise<Node[]> {
  console.log("Fetching history");
  return fetchAll();
}


export async function fetchAll(): Promise<Node[]> {
  if (history) {
    return history;
  }

  const response = await fetch('/data.json');

  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.status} ${response.statusText}`)
  }

  const data: Data = await response.json();

  history = data.history.map(node => ({
    ...node,
    startDate: new Date(node.startDate),
    endDate: node.endDate ? new Date(node.endDate) : undefined,
  }));

  return history;
}


export async function removeAll(): Promise<boolean> {
  console.log("Deleting history");
  
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      history = [];
      resolve(true);
    }, 1000);
  })
}


export async function remove(id: string): Promise<boolean> {
  console.log("Deleting history node");
  
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      history = history!.filter(node => node.id !== id);
      resolve(true);
    }, 1000);
  })
}


export default {
  QueryKeys,
  getAll,
  remove,
  removeAll,
};
