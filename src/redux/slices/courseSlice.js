import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  enrolledCourses: [],
  wishlist: [],
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    setEnrolledCourses: (state, action) => {
      state.enrolledCourses = action.payload;
    },
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
    setCourseLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCourseError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setCourses, 
  setEnrolledCourses, 
  setWishlist, 
  setCourseLoading, 
  setCourseError 
} = courseSlice.actions;

export default courseSlice.reducer;
