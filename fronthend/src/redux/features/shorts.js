import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../libs/axios";

const fetchshort = async (dispatch,shortParams) => {
  dispatch(shortLoading(true));
  try {
    const response = await axiosInstance.get("/short/get-all-short", {params:shortParams});
    dispatch(shorts(response.data.data.data));
          dispatch(shortLoading(false));
           sessionStorage.setItem(
             "shorts",
             JSON.stringify(response.data.data.data)
           );
        } catch (error) {
          dispatch(noshort());
          dispatch(shortError(true));
          dispatch(shortLoading(false));
          console.log("Error :", error.message);
        } finally {
          dispatch(shortLoading(false));
        }
};

const fetchPublishVideo = async (formData) => {
  const data = new FormData();
  data.append("title", formData.title);
  data.append("description", formData.description);
  data.append("isPublished", formData.isPublished);

  if (formData.shortFile) data.append("shortFile", formData.shortFile);

  await axiosInstance
    .post("short/publish-short", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const shortSlice = createSlice({
  name: "shorts",
  initialState: {
    short: [],
    shortLoading: false,
    shortError: false,
    isShort: false,
  },
  reducers: {
    shorts: (state, action) => {
      state.short = action.payload;
      state.shortLoading = false;
      state.isShort = true;
    },
    noshort: (state) => {
      state.short = [];
      state.shortLoading = false;
      state.shortError = true;
      state.isShort = false;
    },
    shortLoading: (state, action) => {
      state.shortLoading = action.payload;
    },
    shortError: (state, action) => {
      state.shortError = action.payload;
    },
  },
});

export const {
  shorts,
  noshort,
  shortLoading,
  shortError,
} = shortSlice.actions;
export { fetchshort,fetchPublishVideo };
export default shortSlice.reducer;
