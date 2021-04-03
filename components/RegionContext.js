import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
