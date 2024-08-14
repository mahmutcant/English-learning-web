import React from 'react';
import { getDictionary } from '../dictionaries'
import SearchComponent from './SearchComponent';
const ServerComponent: React.FC<{ params: { lang: string } }> = async ({ params: { lang } }) => {
  const dict = await getDictionary(lang)
  
  return (
    <>
      {dict && <div className=' bg-white flex justify-center items-center'>
        <SearchComponent/>
      </div>}
    </>
  );
};

export default ServerComponent;