'use client';
import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { auth, db } from '../../../firebase';
import { getDictionary } from '../dictionaries'
const ClientComponent: React.FC<{ params: { lang: string } }> = ({ params: { lang } }) => {
  const [userLang, setUserLang] = useState<string | null>(null);
  const [dict, setDict] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          console.log('Authenticated user:', user.uid);
          const reference = ref(db, 'users/' + user.uid + '/info/lang');
          const snapshot = await get(reference);
          const userLangFromDB = snapshot.val();
          setDict(await getDictionary(lang))
          setUserLang(userLangFromDB);
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // `onAuthStateChanged` kullanarak oturum durumunu kontrol edin
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchData();
      } else {
        console.log('User is not authenticated');
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <div>
      {dict && dict.mainpage}
      {userLang && <div>User Language from Firebase: {userLang}</div>}
    </div>
  );
};

export default ClientComponent;