import type { Beer } from '@/app/types/beer';

type Props = {
  beer: Beer & { quantity: number };
  onChange: (brand: string, value: number) => void;};

export function Beer(props: Props) {
  const {
    beer: { brand, price, quantity },
    onChange,
  } = props;

  const clickHandler = (value: number) => {
    if (quantity === 0 && value === -1) return;

    onChange(brand, quantity + value);
  };

  return (
    <div className='flex gap-4 p-2 border border-white border-solid rounded'>
      <div>
        <div>Brand: {brand}</div>
        <div>Price: {price}</div>
      </div>
      <div className='ml-auto'>
        <button onClick={() => clickHandler(-1)}>-</button>
        <input
          type='number'
          style={{ width: `3ch ` }}
          value={quantity}
          readOnly
        />
        <button onClick={() => clickHandler(1)}>+</button>
      </div>
    </div>
  );
}
