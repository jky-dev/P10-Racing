import React, { createContext, ReactNode, useState } from 'react'

const Context = createContext(null)

Context.displayName = 'Context'

const useContext = () => {
  return 'placeholder'
}

export interface Props {
  children?: ReactNode
}

export const useDatabaseContext = () => {
  const context = React.useContext(Context)

  if (context === undefined) {
    throw new Error(
      'Database Context undefined. Make sure you use the DatbaseProvider before using the context.'
    )
  }
  return context
}

export const ContextProvider = ({ children }: Props) => {
  const value = useContext()

  return <Context.Provider value={value}>{children}</Context.Provider>
}
