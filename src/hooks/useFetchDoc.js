import { useEffect, useState } from "react";

export default function useFetchDoc({ getDayInfo: queryFn, day }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState({});
  const [refetch, setRefetch] = useState(true);

  useEffect(() => {
    async function fetchDoc() {
      try {
        setIsLoading(true);
        setError(false);

        const data = await queryFn(day);

        setData(data);
        setError(false);
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDoc();
  }, [queryFn, day, refetch]);

  return {
    isLoading,
    error,
    data,
    setData,
    setRefetch,
  };
}
