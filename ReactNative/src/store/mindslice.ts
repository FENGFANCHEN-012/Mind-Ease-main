import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MindState {
  userName: string;
  mood: number | null;
  goals: { id: string; title: string; done: boolean }[];
}

const initialState: MindState = {
  userName: "User",
  mood: null,
  goals: [],
};

const mindSlice = createSlice({
  name: "mind",
  initialState,
  reducers: {
    setMood(state, action: PayloadAction<number>) {
      state.mood = action.payload;
    },
    addGoal(state, action: PayloadAction<string>) {
      state.goals.push({
        id: Date.now().toString(),
        title: action.payload,
        done: false,
      });
    },
    toggleGoal(state, action: PayloadAction<string>) {
      const goal = state.goals.find(g => g.id === action.payload);
      if (goal) goal.done = !goal.done;
    },
  },
});

export const { setMood, addGoal, toggleGoal } = mindSlice.actions;
export default mindSlice.reducer;

