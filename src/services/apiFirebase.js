import { db } from "@/config/firebase";
import { format } from "date-fns";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

function setDocRef(dateState) {
  const yearCollectionRef = collection(db, "years");
  const yearDocRef = doc(yearCollectionRef, format(dateState, "yyyy"));
  const monthCollectionRef = collection(yearDocRef, "months");
  const monthDocRef = doc(monthCollectionRef, format(dateState, "MMMM"));
  const dayCollectionRef = collection(monthDocRef, "days");
  const dayDocRef = doc(dayCollectionRef, format(dateState, "d"));
  const dayTotalSalesDocRef = doc(dayCollectionRef, "totalSalesForEachDay");
  const dayPreviousCashBalanceDocRef = doc(
    dayCollectionRef,
    "previousCashBalance",
  );

  return {
    dayCollectionRef,
    dayDocRef,
    dayTotalSalesDocRef,
    dayPreviousCashBalanceDocRef,
  };
}

export async function getDayInfo(day) {
  const dateState = new Date(day);
  const { dayDocRef, dayTotalSalesDocRef } = setDocRef(dateState);

  const dayAndTotalSalesData = {};

  const dayDocSnap = await getDoc(dayDocRef);

  if (dayDocSnap.exists()) {
    dayAndTotalSalesData.dayData = dayDocSnap.data();
  }

  const totalSalesDocSnap = await getDoc(dayTotalSalesDocRef);

  if (totalSalesDocSnap.exists()) {
    dayAndTotalSalesData.monthlyTotalSalesData = totalSalesDocSnap.data();
  }

  return dayAndTotalSalesData;
}

export async function getAllDaysInfo(dateString) {
  const dateState = new Date(dateString);

  const { dayCollectionRef } = setDocRef(dateState);
  const docsSnap = await getDocs(dayCollectionRef);

  if (!docsSnap.empty) {
    const dataObject = {};

    docsSnap.forEach((doc) => {
      dataObject[doc.id] = doc.data();
    });

    // Get the parent's parent's id for differentiating monthData
    dataObject.id = docsSnap.docs[0].ref.parent.parent.id;

    // console.log(docsSnap.docs[0].ref.parent.parent.id);

    return dataObject;
  }

  return {};
}

export async function setDayInfo(
  dateState,
  { formattedData, updatedTotalSales },
) {
  const { dayDocRef, dayTotalSalesDocRef } = setDocRef(dateState);
  await setDoc(dayDocRef, formattedData);

  // const totalSalesForEachDay = {};

  // for (let key in data) {
  //   if (Object.hasOwnProperty.call(data, key)) {
  //     if (key === "todayTotalSales") {
  //       totalSalesForEachDay[format(dateState, "d")] = data[key];
  //     }
  //   }
  // }

  return await setDoc(dayTotalSalesDocRef, updatedTotalSales);
}

export async function setPreviousCashBalance(day, previousCashBalance) {
  const dateState = new Date(day);

  const { dayPreviousCashBalanceDocRef } = setDocRef(dateState);

  return await setDoc(dayPreviousCashBalanceDocRef, previousCashBalance);
}
