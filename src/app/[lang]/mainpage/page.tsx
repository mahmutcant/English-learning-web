'use client';
import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { auth, db } from '../../../firebase';
import { getDictionary } from '../dictionaries'
const ClientComponent: React.FC<{ params: { lang: string } }> = async ({ params: { lang } }) => {
  const dict = await getDictionary(lang)

  return (
    <>
      {dict && <div className='h-screen bg-white'>
        
        <span className='text-black'>{dict && dict.mainpage}</span>
      </div>}
    </>
  );
};

export default ClientComponent;