'use client'

import React, { useEffect, useState } from 'react'

type Props = {}

const useDebounce = (value:string, delay:number) => {

    const [debounceValue, setDebounceValue] = useState('');

    useEffect(() => {
        
   const timeOut= setTimeout(()=>{
    setDebounceValue(value)
   }, delay);

   return ()=>{
    clearTimeout(timeOut)
   }
       
    }, [value, delay]);

    return debounceValue;
    
  
}

export default useDebounce