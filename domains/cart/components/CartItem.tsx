import { GoX } from 'react-icons/go';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { type Cart } from '../types/Cart.types';
// import { FaPlus, FaMinus } from 'react-icons/fa';
import { TfiPlus, TfiMinus } from 'react-icons/tfi';

import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
import Image from 'next/image';
type CartProps = Cart & {
    onChangeItem: (id: number, type: 'plus' | 'minus') => void;
    onRemoveItem: (id: number) => void;
    onToggle: (id: number) => void;
};

export default function CartItem({
    id,
    imageUrl,
    productName,
    quantity,
    price,
    check,
    onChangeItem,
    onRemoveItem,
    onToggle,
}: CartProps) {
    return (
        <div className="md:item-center flex flex-col gap-3 border-b-1 py-4 md:flex-row md:justify-between lg:px-4">
            <div className="flex min-w-0 items-center gap-3 md:gap-5">
                <div
                    className="shrink-0 cursor-pointer"
                    onClick={() => onToggle(id)}
                >
                    {check ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                </div>

                <Image
                    src={imageUrl}
                    width={100}
                    height={100}
                    alt={productName}
                    className="h-auto w-20 shrink-0 object-contain md:mr-2 md:w-30"
                />
                <div className="min-w-0">
                    <div className="line-clamp-2 break-words">
                        {productName}
                    </div>
                    <div>{(price * quantity).toLocaleString()}원</div>
                </div>
            </div>
            <div className="flex items-center justify-between md:justify-end">
                <div className="flex">
                    <button
                        type="button"
                        className="mr-1 cursor-pointer rounded-sm border px-2"
                        onClick={() => onChangeItem(id, 'minus')}
                    >
                        <TfiMinus />
                    </button>
                    <Input
                        type="number"
                        value={quantity}
                        readOnly
                        className="w-15 rounded-sm text-right"
                    />
                    <button
                        type="button"
                        className="ml-1 cursor-pointer rounded-sm border px-2"
                        onClick={() => onChangeItem(id, 'plus')}
                    >
                        <TfiPlus />
                    </button>
                </div>
                <GoX
                    onClick={() => onRemoveItem(id)}
                    className="h-8 w-8 shrink-0 cursor-pointer p-1 md:ml-6"
                />
            </div>
        </div>
    );
}
