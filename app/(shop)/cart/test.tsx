'use client';

import { useState } from 'react';

export default function Counter(){
    const[number, setNumber] = useState(10);

    const increase= () => {
        setNumber(number + 1);
    };

    return (
        <div>
            <h1>{number}</h1>
            <button onClick={increase}>+1</button>
        </div>
    )
}