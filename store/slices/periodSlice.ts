import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PeriodState {
  lastPeriodDate: string; // ISO string
  cycleLength: number;
  periodLength: number;
  birthYear: number | null;
  goal: string | null;
}

const initialState: PeriodState = {
  lastPeriodDate: new Date().toISOString(),
  cycleLength: 28,
  periodLength: 5,
  birthYear: null,
  goal: null,
};

const periodSlice = createSlice({
  name: 'period',
  initialState,
  reducers: {
    setLastPeriodDate(state, action: PayloadAction<string>) {
      state.lastPeriodDate = action.payload;
    },
    setCycleLength(state, action: PayloadAction<number>) {
      state.cycleLength = action.payload;
    },
    setPeriodLength(state, action: PayloadAction<number>) {
      state.periodLength = action.payload;
    },
    setBirthYear(state, action: PayloadAction<number>) {
      state.birthYear = action.payload;
    },
    setGoal(state, action: PayloadAction<string>) {
      state.goal = action.payload;
    },
    updatePeriodData(state, action: PayloadAction<Partial<PeriodState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setLastPeriodDate,
  setCycleLength,
  setPeriodLength,
  setBirthYear,
  setGoal,
  updatePeriodData,
} = periodSlice.actions;

export default periodSlice.reducer;
