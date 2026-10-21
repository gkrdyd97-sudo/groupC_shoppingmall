import { Input } from '@/shared/components/ui/input';
import type { ShippingInput } from '../types/order.types';

export type ShippingFormValues = ShippingInput & {
    receiverAddressDetail: string;
};

export const INITIAL_SHIPPING: ShippingFormValues = {
    receiverName: '',
    receiverPhone: '',
    receiverZipcode: '',
    receiverAddress: '',
    receiverAddressDetail: '',
};

interface ShippingFormProps {
    values: ShippingFormValues;
    errors: Record<string, string>;
    onChange: (name: keyof ShippingFormValues, value: string) => void;
}

const FIELDS: {
    name: keyof ShippingFormValues;
    label: string;
    placeholder: string;
    inputMode?: 'tel' | 'numeric';
    maxLength?: number;
}[] = [
    { name: 'receiverName', label: '받는 분', placeholder: '이름' },
    {
        name: 'receiverPhone',
        label: '연락처',
        placeholder: '010-0000-0000',
        inputMode: 'tel',
        maxLength: 13,
    },
    {
        name: 'receiverZipcode',
        label: '우편번호',
        placeholder: '5자리 숫자',
        inputMode: 'numeric',
        maxLength: 5,
    },
    { name: 'receiverAddress', label: '주소', placeholder: '도로명 / 지번 주소' },
    {
        name: 'receiverAddressDetail',
        label: '상세주소',
        placeholder: '동, 호수 등 (선택)',
    },
];

export default function ShippingForm({
    values,
    errors,
    onChange,
}: ShippingFormProps) {
    return (
        <div className="flex flex-col gap-4 py-4">
            {FIELDS.map((field) => (
                <div
                    key={field.name}
                    className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4"
                >
                    <label
                        htmlFor={field.name}
                        className="shrink-0 md:w-24 md:pt-1.5"
                    >
                        {field.label}
                    </label>
                    <div className="grow">
                        <Input
                            id={field.name}
                            name={field.name}
                            value={values[field.name]}
                            placeholder={field.placeholder}
                            inputMode={field.inputMode}
                            maxLength={field.maxLength}
                            aria-invalid={!!errors[field.name]}
                            className="h-10"
                            onChange={(e) =>
                                onChange(field.name, e.target.value)
                            }
                        />
                        {errors[field.name] && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors[field.name]}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
