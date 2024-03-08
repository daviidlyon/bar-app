export type Beer = {
  brand: string;
  price: number;
};

export type BeerMap = {
  [beerBrand: string]: Beer & { quantity: number };
};