import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@stores/auth/authSlice";
import { render } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

export const renderWithProvider = (ui: React.ReactElement,{
   preloadedState = {},
   // Create a fresh store for every test to avoid state leakage
    store = configureStore({ 
      reducer: { auth: authSlice }, 
      preloadedState 
    }),
    ...renderOptions
} = {}) => {
    function Wrapper({ children }: PropsWithChildren) {
         return (
         <Provider store={store}>
               {children}
         </Provider>)
    }
    return { store,...render(ui, { wrapper: Wrapper, ...renderOptions })}
}