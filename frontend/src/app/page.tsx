'use client';

import { useEffect, useMemo, useState } from 'react';
import { BeerMenu, CurrentAccount } from './components/';
import type { Account, Beer, BeerMap } from '@/app/types';
import axios from 'axios';

type Order = {
  owner: string;
  items: {
    [brand: string]: number;
  };
};

async function fetchApi(url: string) {
  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }

    return response.data;
  } catch (error) {
    console.log('error: ', error);
  }
}

const BASE_URL = 'http://localhost:8000';

export default function Home() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [beerMap, setBeerMap] = useState<BeerMap>({});
  const [friends, setFriends] = useState<string[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string>('');
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    fetchApi(BASE_URL + '/menu').then((data: Beer[]) => {
      setBeers(data);
      setBeerMap(initializeBeerMap(data));
    });

    fetchApi(BASE_URL + '/friends').then((data: string[]) => {
      setFriends(data);
      setSelectedFriend(data[0]);
    });
  }, []);

  useEffect(() => {
    getAccount(selectedFriend);
  }, [selectedFriend]);

  const getAccount = (friendName: string) => {
    fetchApi(BASE_URL + '/get-account/' + friendName).then((data: Account) => {
      setAccount(data);
    });
  };

  const beerChangeHandler = (brand: string, value: number) => {
    setBeerMap((prev) => {
      const newCount = { ...prev };
      newCount[brand].quantity = value;
      return newCount;
    });
  };

  const selectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFriend(e.target.value);
  };

  const addOrder = () => {
    const order = generateOrder(selectedFriend, beerMap);
    postApi(BASE_URL + '/create-order', order).then(() => {
      setBeerMap(initializeBeerMap(beers));
      getAccount(selectedFriend);
    });
  };

  const payAccount = () => {
    deleteApi(BASE_URL + '/pay-account/' + selectedFriend).then(() => {
      setAccount(null);
    });
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-10 p-24'>
      <BeerMenu
        beerMap={beerMap}
        onChange={beerChangeHandler}
        addOrder={addOrder}
        onFriendSelect={selectHandler}
        friends={friends}
        selectedFriend={selectedFriend}
      />
      <CurrentAccount account={account} payAccount={payAccount} />
    </main>
  );
}

function initializeBeerMap(beers: Beer[]): BeerMap {
  return beers.reduce((acc, beer) => {
    const newAcc = { ...acc };
    newAcc[beer.brand] = {
      ...beer,
      quantity: 0,
    };
    return newAcc;
  }, {} as BeerMap);
}

function generateOrder(owner: string, beerMap: BeerMap): Order {
  const items: { [brand: string]: number } = {};
  Object.entries(beerMap).forEach(([brand, { quantity }]) => {
    items[brand] = quantity;
  });

  return { owner, items };
}

async function postApi(url: string, body: any) {
  try {
    const response = await axios.post(url, body);

    return response;
  } catch (err) {
    console.log(err);
  }
}

async function deleteApi(url: string) {
  try {
    const response = await axios.delete(url);

    return response;
  } catch (err) {
    console.log(err);
  }
}
