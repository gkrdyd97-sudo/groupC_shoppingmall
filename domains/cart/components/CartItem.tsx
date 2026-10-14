import { FaTrashAlt } from 'react-icons/fa';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { type Cart } from '../types/Cart.types';

type CartProps = Cart & {
    onChangeItem: (id: number, type: 'plus' | 'minus') => void;
    onRemoveItem: (id: number) => void;
};

export default function CartItem({
    id,
    imageUrl,
    productName,
    quantity,
    price,
    onChangeItem,
    onRemoveItem,
}: CartProps) {
    return (
        <div className="flex">
            <img src={imageUrl} alt={productName} className="mr-2 w-20" />
            <div>{productName}</div>
            <div>{price * quantity}</div>
            <div className="flex">
                <Button type="button" onClick={() => onChangeItem(id, 'minus')}>
                    -
                </Button>
                <Input type="number" value={quantity} readOnly />
                <Button type="button" onClick={() => onChangeItem(id, 'minus')}>
                    -
                </Button>
                <Button type="button" onClick={() => onChangeItem(id, 'plus')}>
                    +
                </Button>

                <FaTrashAlt onClick={() => onRemoveItem(id)} />   
            </div>
        </div>
    );
}
