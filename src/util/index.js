export function isObjectEmpty(object) {
  if (Object.keys(object).length === 0) {
    return true;
  }
  return false;
}

export function extractCustomers(monthData) {
  if (isObjectEmpty(monthData)) {
    return false;
  }

  const result = {};

  for (let dayKey in monthData) {
    if (
      dayKey === "id" ||
      dayKey === "totalSalesForEachDay" ||
      dayKey === "previousCashBalance"
    ) {
      continue;
    }
    const { todayCustomersInfo } = monthData[dayKey];
    if (isObjectEmpty(todayCustomersInfo)) {
      result[dayKey] = [];
    } else {
      const customers = [];
      for (let customerKey in todayCustomersInfo) {
        customers.push(todayCustomersInfo[customerKey].customerName);
      }
      result[dayKey] = customers;
    }
  }

  return result;
}

export function extractBankIn(monthData) {
  if (isObjectEmpty(monthData)) {
    return false;
  }

  const result = {};

  for (let dayKey in monthData) {
    if (
      dayKey === "id" ||
      dayKey === "totalSalesForEachDay" ||
      dayKey === "previousCashBalance"
    ) {
      continue;
    }

    const { todayBankInInfo } = monthData[dayKey];
    if (isObjectEmpty(todayBankInInfo)) {
      result[dayKey] = false;
    } else {
      result[dayKey] = true;
    }
  }

  return result;
}

export function extractCustomerAttendance(monthData) {
  if (isObjectEmpty(monthData)) {
    return false;
  }

  const result = {};

  for (let dayKey in monthData) {
    if (
      dayKey === "id" ||
      dayKey === "totalSalesForEachDay" ||
      dayKey === "previousCashBalance"
    ) {
      continue;
    }
    const { todayCustomersInfo } = monthData[dayKey];
    if (isObjectEmpty(todayCustomersInfo)) {
      continue;
    } else {
      for (let customerKey in todayCustomersInfo) {
        if (result[customerKey]) {
          result[customerKey].push(dayKey);
        } else {
          result[customerKey] = [dayKey];
        }
      }
    }
  }

  return result;
}
