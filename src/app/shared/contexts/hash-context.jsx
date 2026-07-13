import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const HashContext = createContext({
  currentHash: '',
});
HashContext.displayName = 'hash-context';

function HashProvider(props) {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const data = {
    currentHash,
  };

  /* eslint-disable react/jsx-props-no-spreading */
  return <HashContext.Provider value={data} {...props} />;
  /* eslint-enable react/jsx-props-no-spreading */
}

HashProvider.propTypes = {
};

function useHashContext() {
  return useContext(HashContext);
}

export {
  HashContext, HashProvider, useHashContext,
};
