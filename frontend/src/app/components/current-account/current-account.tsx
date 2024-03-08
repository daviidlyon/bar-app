import { Account } from '@/app/types';
import { capitalize } from 'lodash';

type Props = {
  account: Account | null;
  payAccount: () => void;
};
export function CurrentAccount({ account, payAccount }: Props) {
  if (!account) return null;
  const { owner, items, total } = account;

  return (
    <div className='flex flex-col justify-center items-center	 gap-5'>
      <div className='border border-white border-solid rounded p-4'>
        <div>{capitalize(owner)}&apos;s Account:</div>
        Items:
        <ul>
          {Object.entries(items).map(([brand, value], i) => (
            <li className='ml-2' key={`${i}-${brand}`}>
              - {brand} : {value}
            </li>
          ))}
        </ul>
        Total: ${total}
      </div>
      <button onClick={payAccount} className='bg-slate-600 px-2 w-fit'>
        Pay Account
      </button>
    </div>
  );
}
