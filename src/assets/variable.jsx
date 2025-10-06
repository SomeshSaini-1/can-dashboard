import React, { createContext, useState } from 'react'
export const Variables = createContext();

 const variable = ({ children }) => {
    const [id_data,setid_data] = useState("");

  return (
    <Variables.Provider value={{id_data,setid_data}} >
        {children}
    </Variables.Provider >
  )
}

export default variable
