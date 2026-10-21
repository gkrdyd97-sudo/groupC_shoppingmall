import { cn } from '@/shared/utils/cn';
import {
    DELIVERY_STEPS,
    ORDER_STATUS_LABEL,
} from '../constants/order.constants';
import type { OrderStatus } from '../types/order.types';

// 결제완료 → 상품준비중 → 배송중 → 배송완료 단계 표시
export default function DeliveryStatus({ status }: { status: OrderStatus }) {
    if (status === 'PENDING' || status === 'CANCELED') {
        return (
            <p className="py-4 text-center font-bold text-gray-500">
                {ORDER_STATUS_LABEL[status]}
            </p>
        );
    }

    const currentIndex = DELIVERY_STEPS.indexOf(status);

    return (
        <ol className="flex py-4">
            {DELIVERY_STEPS.map((step, index) => {
                const isDone = index <= currentIndex;
                return (
                    <li
                        key={step}
                        className="relative flex flex-1 flex-col items-center gap-2"
                        aria-current={index === currentIndex ? 'step' : undefined}
                    >
                        {/* 단계 사이 연결선 */}
                        {index > 0 && (
                            <span
                                className={cn(
                                    'absolute top-3 right-1/2 h-0.5 w-full -translate-y-1/2',
                                    isDone ? 'bg-blue-500' : 'bg-gray-200',
                                )}
                            />
                        )}
                        <span
                            className={cn(
                                'relative z-10 flex size-6 items-center justify-center rounded-full text-xs text-white',
                                isDone ? 'bg-blue-500' : 'bg-gray-200',
                            )}
                        >
                            {index + 1}
                        </span>
                        <span
                            className={cn(
                                'text-xs md:text-sm',
                                index === currentIndex
                                    ? 'font-bold text-blue-500'
                                    : isDone
                                      ? ''
                                      : 'text-gray-400',
                            )}
                        >
                            {ORDER_STATUS_LABEL[step]}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
