import {
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from 'firebase';
import { NumBoolean } from 'store/reducers/SettingsSlice';
import { parseArray } from './utils';

export interface IFirestoreData {
  id?: string;
  isCache: number | NumBoolean;
  isStats: number | NumBoolean;
  activeKey: string;
  tabs: string[] | Tab[];
}

export const getFirestoreData = async (uid: string) => {
  try {
    const tabCollectionsRef = collection(db, 'settings');

    const data = await getDocs(tabCollectionsRef);
    const filteredData = data.docs
      .map((docs) => ({
        ...docs.data(),
        id: docs.id,
      }))
      .filter((item) => item.id === uid);
    const initValue = !filteredData.length ? null : filteredData[0];

    if (initValue) {
      const stringTabsArray = (initValue as IFirestoreData).tabs as string[];

      const tabsArr = parseArray(stringTabsArray).map((item) => ({
        ...item,
        response: { data: '', isLoading: false, error: undefined },
      }));

      return {
        ...initValue,
        tabs: tabsArr,
      } as IFirestoreData;
    }

    return initValue;
  } catch (error) {
    return console.error(error);
  }
};

export const updateFirestoreData = async (
  id: string,
  data: { [x: string]: string | number | string[] | Tab[] }
) => {
  try {
    const userSettingsRef = doc(db, 'settings', id);
    await updateDoc(userSettingsRef, data);
  } catch (error) {
    console.error(error);
    // TODO: throw error?
  }
};

export const createFirestoreData = async (uid: string) => {
  try {
    await setDoc(doc(db, 'settings', uid), {
      isCache: 0,
      isStats: 1,
      activeKey: '1',
      tabs: [
        '{"label":"Tab 1","query":{"data":"","variables":"","headers":""},"response":{"data":"","isLoading":false},"key":"1","closable":false}',
      ],
    });
  } catch (error) {
    console.error(error);
  }
};
