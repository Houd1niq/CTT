import {Navigate} from "react-router-dom";
import {userApiSlice} from "@entities/user";
import React from "react";

export const AdminRequired: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const {data: user, isLoading} = userApiSlice.useGetMeQuery();

  if (isLoading) {
    return <div></div>
  }

  if (!user || user.role.name !== 'admin') {
    return <Navigate to={'/'}/>
  }

  return children;
};
