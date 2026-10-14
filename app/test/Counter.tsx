'use client';

import { useState } from 'react';

export default function Counter() {
    const [number, setNumber] = useState(10);
    console.log("Counter() 호출!");

    const increase = () => setNumber(number + 1); // 함수 호출
    const decrease = () => setNumber(number - 1);

    return (
        <div>
            <h1>{number}</h1>
            <button type="button" onClick={increase}>+1</button>
            <button type="button" onClick={decrease}>-1</button>
        </div>
    );
}
