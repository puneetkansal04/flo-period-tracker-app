import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type GoalType = 'track_cycle' | 'get_pregnant' | 'track_pregnancy' | null;

export interface DailyLog {
  flow?: 'light' | 'medium' | 'heavy' | 'spotting';
  moods?: string[];
  symptoms?: string[];
  pain?: string[];
  discharge?: string[];
  sleep?: string;
  notes?: string;
}

export interface PeriodState {
  // Onboarding
  onboardingComplete: boolean;
  goal: GoalType;
  birthYear: number | null;
  cycleLength: number;
  periodLength: number;
  lastPeriodDate: string; // ISO string

  // Additional onboarding data
  bodyMotivations: string[];
  cycleIssues: string[];
  menstruationSymptoms: string[];
  exerciseFrequency: string | null;
  workoutTypes: string[];
  dietImpact: string[];
  prePeriodMoods: string[];
  showSexQuestions: boolean;
  sexInterests: string[];
  height: { value: number; unit: 'cm' | 'ft' } | null;
  weight: { value: number; unit: 'kg' | 'lb' } | null;

  // Daily logs: date string (YYYY-MM-DD) -> DailyLog
  dailyLogs: { [date: string]: DailyLog };

  // Period history: array of {start, end} ISO date strings
  periodHistory: { start: string; end: string }[];

  // User profile
  name: string | null;
  email: string | null;
}

const initialState: PeriodState = {
  onboardingComplete: false,
  goal: null,
  birthYear: null,
  cycleLength: 28,
  periodLength: 5,
  lastPeriodDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),

  bodyMotivations: [],
  cycleIssues: [],
  menstruationSymptoms: [],
  exerciseFrequency: null,
  workoutTypes: [],
  dietImpact: [],
  prePeriodMoods: [],
  showSexQuestions: false,
  sexInterests: [],
  height: null,
  weight: null,

  dailyLogs: {},
  periodHistory: [],

  name: null,
  email: null,
};

const periodSlice = createSlice({
  name: 'period',
  initialState,
  reducers: {
    setOnboardingComplete(state, action: PayloadAction<boolean>) {
      state.onboardingComplete = action.payload;
    },
    setGoal(state, action: PayloadAction<GoalType>) {
      state.goal = action.payload;
    },
    setBirthYear(state, action: PayloadAction<number>) {
      state.birthYear = action.payload;
    },
    setCycleLength(state, action: PayloadAction<number>) {
      state.cycleLength = action.payload;
    },
    setPeriodLength(state, action: PayloadAction<number>) {
      state.periodLength = action.payload;
    },
    setLastPeriodDate(state, action: PayloadAction<string>) {
      state.lastPeriodDate = action.payload;
    },
    setBodyMotivations(state, action: PayloadAction<string[]>) {
      state.bodyMotivations = action.payload;
    },
    setCycleIssues(state, action: PayloadAction<string[]>) {
      state.cycleIssues = action.payload;
    },
    setMenstruationSymptoms(state, action: PayloadAction<string[]>) {
      state.menstruationSymptoms = action.payload;
    },
    setExerciseFrequency(state, action: PayloadAction<string>) {
      state.exerciseFrequency = action.payload;
    },
    setWorkoutTypes(state, action: PayloadAction<string[]>) {
      state.workoutTypes = action.payload;
    },
    setDietImpact(state, action: PayloadAction<string[]>) {
      state.dietImpact = action.payload;
    },
    setPrePeriodMoods(state, action: PayloadAction<string[]>) {
      state.prePeriodMoods = action.payload;
    },
    setShowSexQuestions(state, action: PayloadAction<boolean>) {
      state.showSexQuestions = action.payload;
    },
    setSexInterests(state, action: PayloadAction<string[]>) {
      state.sexInterests = action.payload;
    },
    setHeight(state, action: PayloadAction<{ value: number; unit: 'cm' | 'ft' }>) {
      state.height = action.payload;
    },
    setWeight(state, action: PayloadAction<{ value: number; unit: 'kg' | 'lb' }>) {
      state.weight = action.payload;
    },
    logDay(state, action: PayloadAction<{ date: string; log: DailyLog }>) {
      state.dailyLogs[action.payload.date] = {
        ...state.dailyLogs[action.payload.date],
        ...action.payload.log,
      };
    },
    addPeriodHistory(state, action: PayloadAction<{ start: string; end: string }>) {
      state.periodHistory.push(action.payload);
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    resetOnboarding(state) {
      state.onboardingComplete = false;
      state.goal = null;
      state.birthYear = null;
    },
    updatePeriodData(state, action: PayloadAction<Partial<PeriodState>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  setOnboardingComplete,
  setGoal,
  setBirthYear,
  setCycleLength,
  setPeriodLength,
  setLastPeriodDate,
  setBodyMotivations,
  setCycleIssues,
  setMenstruationSymptoms,
  setExerciseFrequency,
  setWorkoutTypes,
  setDietImpact,
  setPrePeriodMoods,
  setShowSexQuestions,
  setSexInterests,
  setHeight,
  setWeight,
  logDay,
  addPeriodHistory,
  setName,
  setEmail,
  resetOnboarding,
  updatePeriodData,
} = periodSlice.actions;

export default periodSlice.reducer;
