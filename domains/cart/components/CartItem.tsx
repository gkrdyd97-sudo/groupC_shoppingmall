import { FaTrashAlt } from 'react-icons/fa';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { type Cart } from '../types/Cart.types';
import { FaPlus, FaMinus } from 'react-icons/fa';
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
            <div className="flex items-center gap-3">
                <div className="cursor-pointer" onClick={() => onToggle(id)}>
                    {check ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                </div>

                <Image
                    src={imageUrl}
                    width={100}
                    height={100}
                    alt={productName}
                    className="object-fit mr-2 w-20"
                />
                <div>
                    <div>{productName}</div>
                    <div>{(price * quantity).toLocaleString()}원</div>
                </div>
            </div>
            <div className="flex items-center">
                <Button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => onChangeItem(id, 'minus')}
                >
                    <FaMinus />
                </Button>
                <Input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-13 text-right"
                />
                <Button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => onChangeItem(id, 'plus')}
                >
                    <FaPlus />
                </Button>

                <FaTrashAlt
                    onClick={() => onRemoveItem(id)}
                    className="ml-4 align-middle text-[25px]"
                />
            </div>
        </div>
    );
}
