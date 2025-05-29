import { Side } from "../components/common/motion/SmoothMotion";

export enum Order {
  Asc = "asc",
  Des = "des",
}

export enum Direction {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

interface Order2D {
  order: Order;
  direction: Direction;
}

export type Matrix = string[][];

export function calcSides(matrixes: Matrix[], cur: string, prev?: string): Side[] {
  if (!prev || cur === prev) return [Side.None, Side.None];

  let order2D;
  for (const matrix of matrixes) {
    order2D = getOrder2D(cur, prev, matrix);
    if (order2D) break; 
  }
  
  if (!order2D) {
    console.log("Failed to evaluate order:", { cur, prev, matrixes });
    return [Side.None, Side.None];
  }

  const { order, direction } = order2D;

  const sides = direction === Direction.Horizontal
    ? [Side.Left, Side.Right]
    : [Side.Top, Side.Bottom];

  return order === Order.Asc ? sides : sides.reverse();
}

function getOrder2D(cur: string, prev: string, matrix: string[][]): Order2D | undefined {
  let order = getOrder1D(cur, prev, matrix);
  if (order) return { direction: Direction.Horizontal, order };

  order = getOrder1D(cur, prev, transpose(matrix));
  if (order) return { direction: Direction.Vertical, order };
}

function transpose<T>(matrix: T[][]) {
  return matrix[0].map((_col, c) => matrix.map((_row, r) => matrix[r][c]));
}

function getOrder1D(cur: string, prev: string, matrix: string[][]): Order | undefined {
  for (const row of matrix) {
    if (row.includes(cur) && row.includes(prev)) {
      return calcOrder(cur, prev, row);
    }
  }
}

function calcOrder(cur: string, prev: string, order: string[]): Order {
  const cI = order.indexOf(cur);
  const pI = order.indexOf(prev);

  if (cI < pI) {
    if (order.length > 2 && cI === 0 && pI === order.length - 1) return Order.Des;
    return Order.Asc;
  } else {
    if (order.length > 2 && cI === order.length - 1 && pI === 0) return Order.Asc;
    return Order.Des;
  }
}
