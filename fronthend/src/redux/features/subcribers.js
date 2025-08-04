import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

const fetchSubcribeToggle = async (userId) => {

  if (!userId) return "id not found";

  try {
    const r = await axiosInstance.get(
      `subcriber/toggle-subcriber/${userId}`
    );
    console.log(r)

  } catch (error) {
    console.error(error)
  }
}

const fetchSubcriberList = async (userId) => {
  try {
    const subcribe = await axiosInstance.get(
      `subcriber/get-subcriber/${userId}`
    );

    console.log(subcribe);
  } catch (error) {
    console.error(error);
  }
};

const fetchSubcribedList = async (userId) => {
  try {
    const subcribe = await axiosInstance.get(
      `subcriber/get-subcribed/${userId}`
    );

    console.log(subcribe);
  } catch (error) {
    console.error(error);
  }
};

// const fetchIsSubcribed = async (Id, setSubcribeStatus) => {
//   try {
//     const subcribe = await axiosInstance.get(`subcriber/is-subcribed/${Id}`);

//     setSubcribeStatus(subcribe?.data?.data);
//   } catch (error) {
//     console.error(error);
//   }
// };

export const subcriberSlice = createSlice({
  name: "subscriber",
  initialState: {
    subcriber: [],
    subcriberLoading: false,
    subcriberError: false,
    issubcriber: false,
  },
  reducers: {
    subcriber: (state, action) => {
      state.subcriber = action.payload;
      state.subcriberLoading = false;
      state.issubcriber = true;
    },
    nosubcriber: (state) => {
      state.subcriber = [];
      state.subcriberLoading = false;
      state.subcriberError = true;
      state.issubcriber = false;
    },
    subcriberLoading: (state, action) => {
      state.subcriberLoading = action.payload;
    },
    subcriberError: (state, action) => {
      state.subcriberError = action.payload;
    },
  },
});

export const { subcriber, nosubcriber, subcriberLoading, subcriberError } = subcriberSlice.actions;
export {
  fetchSubcribeToggle,
  fetchSubcriberList,
  fetchSubcribedList,
};
export default subcriberSlice.reducer;
