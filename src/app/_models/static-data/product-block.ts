export interface ProductBlock {
  title: string;
  leftBlock: Block;
  rightBlock: Block;
}

interface Block {
  img: string;
  title: string;
  description: string;
}

export enum ProductBlockEnum {
  title = 51,
  leftBlock,
  rightBlock,
}
