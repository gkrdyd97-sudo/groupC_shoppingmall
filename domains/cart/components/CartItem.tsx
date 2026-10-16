// import { FaXmark } from 'react-icons/fa6';
import { GoX } from "react-icons/go";
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
        <div className="flex justify-between border-b-1 p-4">
            <div className="flex items-center gap-5">
                <div className="cursor-pointer" onClick={() => onToggle(id)}>
                    {check ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                </div>

                <Image
                    src={imageUrl}
                    width={100}
                    height={100}
                    alt={productName}
                    className="object-fit mr-2 w-30"
                />
                <div>
                    <div>{productName}</div>
                    <div>{(price * quantity).toLocaleString()}원</div>
                </div>
            </div>
            <div className="flex items-center ">
                <div className="flex">
                    <button
                        type="button"
                        className="mr-1 cursor-pointer rounded-sm border px-2 "
                        onClick={() => onChangeItem(id, 'minus')}
                    >
                        <TfiMinus />
                    </button>
                    <Input
                        type="number"
                        value={quantity}
                        readOnly
                        className="w-15 text-right rounded-sm"
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
                    className="ml-6 align-middle cursor-pointer w-8 h-8 p-1"
                />
            </div>
        </div>
    );
}
