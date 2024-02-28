import type { BeerMap } from '@/app/types/beer';
import { Beer } from './beer';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  beerMap: BeerMap;
  onChange: (brand: string, value: number) => void;
  addOrder: () => void;
  friends: string[];
  selectedFriend: string;
  onFriendSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};
export function BeerMenu({
  beerMap,
  onChange,
  addOrder,
  friends,
  selectedFriend,
  onFriendSelect,
}: Props) {
  const disableButton = useMemo(() => {
    for (const beer of Object.values(beerMap)) {
      if (beer.quantity > 0) {
        return false;
      }
    }

    return true;
  }, [beerMap]);

  if (!beerMap || !selectedFriend) return null;
  return (
    <div>
      <div className='mb-4'>
        <h1 className='mb-4'>Beers</h1>
        <ul>
          {Object.entries(beerMap).map(([brand, beer], i) => (
            <Beer key={`${i}-${brand}`} beer={beer} onChange={onChange} />
          ))}
        </ul>
      </div>

      <div className='flex justify-center gap-2 rounded'>
        <button
          disabled={disableButton}
          className='bg-slate-600 px-2'
          onClick={addOrder}
        >
          Add
        </button>
        to
        <select value={selectedFriend} onChange={onFriendSelect}>
          {friends.map((friendName, i) => (
            <option key={`${i}-friendName`} value={friendName}>
              {friendName}&apos;s
            </option>
          ))}
        </select>
        tab
      </div>
    </div>
  );
}
