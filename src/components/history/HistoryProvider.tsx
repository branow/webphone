import { FC, ReactNode, createContext, useState, useEffect } from "react";
import Storage from "../../lib/storage.ts";

interface Props {
  children: ReactNode;
}

export enum CallStatus {
  INCOMING = "incoming",
  OUTCOMING = "outcoming",
  MISSED = "missed",
  FAILED = "failed",
}

export interface Node {
  number: string;
  status: CallStatus;
  startDate: Date;
  endDate?: Date;
}

const nodeStorage = new Storage<Node[]>("history");
const HistoryStorage = {
  get: (): Node[] | null => {
    const nodes = nodeStorage.get();
    return (nodes ? nodes.map(node => {
      return {
        number: node.number as string,
        status: node.status as CallStatus,
        startDate: new Date(node.startDate),
        endDate: node.endDate ? new Date(node.endDate) : node.endDate,
      };
    }) : null);
  },
  set: (nodes: Node[]) => nodeStorage.set(nodes),
  remove: () => nodeStorage.remove(),
}

interface HistoryValue {
  nodes: Node[];
  addNode: (node: Node) => void;
  removeNode: (node: Node) => void;
  clean: () => void;
}

export const HistoryContext = createContext<HistoryValue | null>(null);

const HistoryProvider: FC<Props> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    const savedNodes = HistoryStorage.get();
    if (savedNodes) {
      setNodes(savedNodes);
    }
  }, []);

  const addNode = (node: Node) => {
    const newNodes = [...nodes, node];
    HistoryStorage.set(newNodes);
    setNodes(newNodes);
  };

  const removeNode = (node: Node) => {
    const newNodes = nodes.filter(n => n.startDate !== node.startDate);
    HistoryStorage.set(newNodes);
    setNodes(newNodes);
  }

  const clean = () => {
    const newNodes: Node[] = [];
    HistoryStorage.set(newNodes);
    setNodes(newNodes);
  }

  return (
    <HistoryContext.Provider value={{ nodes, addNode, removeNode, clean }}>
      {children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
