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

// export const ColorContext = React.createContext();

// export const AppStateProvider = (props) => {
//   const contextValue = { ...yourContext };

//   return (
//     <AppStateContext.Provider value={contextValue}>
//       {props.children}
//     </AppStateContext.Provider>
//   );
// };
