import { refresh } from "@api/auth";
import { loginUser } from "@stores/auth/authSlice";
import type { RootState } from "@stores/store";
import { useQuery } from "@tanstack/react-query";
import { type PropsWithChildren } from "react"
import { useDispatch, useSelector } from "react-redux"

const CheckMe = ({ children }: PropsWithChildren) => {
  
   const isPersistent = useSelector((state: RootState) => state.auth.isPersistent);
   const dispatch = useDispatch();
   const { isLoading } = useQuery({
      queryKey: ["authCheck"],
      queryFn: async() => {
         let data;
         if(isPersistent) {
            data = await refresh();
            dispatch(loginUser({ accessToken: data.data.accessToken,isPersistent }));
         }
         if(!data) data = "data";
         return data;
      },
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity
   })

   if(isLoading) return null;
   return children;
}

export default CheckMe