/**
 * State management for the backend that the app should communicate with as configured by the user.
 */

import { useGetBackendInfoQuery } from "@/app/api";
import { RootState } from "@/app/store";
import { ProjectName } from "@/common/constants";
import { BackendState, createAppSlice, useAppSelector } from "@/common/types";

//# region slice configuration

const initialState: BackendState = {
  url: null,
};

export const backendSlice = createAppSlice({
  name: "backend",
  initialState,
  reducers: {
    setURL: (state, action) => {
      state.url = action.payload;
    },
    clearURL: (state) => {
      state.url = null;
    },
  },
});

export const { setURL, clearURL } = backendSlice.actions;
export default backendSlice.reducer;

//# endregion

//# region selectors

export const selectBackendURL = (state: RootState) => state.backend.url;
export const selectBackendConfigured = (state: RootState) =>
  selectBackendURL(state) != null;

//# endregion

//# region hooks

export function useBackendConfigured(): boolean {
  return useAppSelector(selectBackendConfigured);
}

export function useProjectName() {
  const backendInfoQuery = useGetBackendInfoQuery();
  return (
    (backendInfoQuery.isSuccess ? backendInfoQuery.data?.name : null) ??
    ProjectName
  );
}

//# endregion
