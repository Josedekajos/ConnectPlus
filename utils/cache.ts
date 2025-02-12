const cache = <T>(fn: () => Promise<T>) => {
  let cache: T | undefined;
  let loading = false;

  return async () => {
    if (cache !== undefined) {
      return cache;
    }
    if (loading) {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (cache !== undefined) {
            clearInterval(interval);
            resolve(cache);
          }
        }, 100);
      });
    }
    loading = true;
    try {
      cache = await fn();
    } catch (error) {
      console.error("Error caching:", error);
      loading = false;
      throw error;
    }
    loading = false;
    return cache;
  };
};

export { cache };

