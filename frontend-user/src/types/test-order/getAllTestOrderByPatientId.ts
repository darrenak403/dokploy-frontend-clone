export interface TestOrderResponse {
  statusCode: number;
  error: string | null;
  message: string;
  data: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    data: TestOrderData[];
  };
}

export interface TestOrderData {
  id?: number;
  patientId?: number;
  accessionNumber?: string;
  patientName?: string;
  email?: string;
  address?: string;
  phone?: string;
  gender?: string;
  yob?: string;
  age?: number;
  priority?: string;
  instrumentId?: number;
  instrumentName?: string;
  createdBy?: string;
  runBy?: string;
  status?: string;
  createdAt?: string;
}

export interface TestOrderProps {
  lastTestOrder: TestOrderData | undefined;
}

export interface TestOrderHistoryListProps {
  testOrders?: TestOrderData[];
}

export const lastTestOrder = (testOrders: TestOrderData[] | undefined) => {
  return testOrders?.sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime()
  )?.[0];
};

export const formatDate = (d?: string) => {
  if (!d) return "Chưa có";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const isAccessionNumber = (accessionNumber?: string) => {
  if (!accessionNumber) return false;
  return accessionNumber;
};
