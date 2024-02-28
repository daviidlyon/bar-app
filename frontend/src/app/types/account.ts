export type Account = {
  owner: string;
  items: {
    [brand: string]: number;
  };
  total: number;
};