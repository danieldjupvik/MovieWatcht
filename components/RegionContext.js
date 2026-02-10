import React from 'react';

const RegionContext = React.createContext();

export const RegionProvider = (props) => {
  return (
    <RegionContext.Provider value={{ region: 'hei' }}>
      {props.children}
    </RegionContext.Provider>
  );
};

export default RegionContext;
