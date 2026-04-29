// viewModeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ViewMode = 'grid-3' | 'grid-4' | 'list';

interface ViewState {
    viewMode: ViewMode;
}

const initialState: ViewState = {
    viewMode: (typeof window !== 'undefined'
        ? (sessionStorage.getItem('viewMode') as ViewMode) || 'grid-3'
        : 'grid-3'),
};

const viewModeSlice = createSlice({
    name: 'viewMode',
    initialState,
    reducers: {
        setViewMode: (state, action: PayloadAction<ViewMode>) => {
            state.viewMode = action.payload;

            // 🔥 localStorage sync
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('viewMode', action.payload);
            }
        },
    },
});

export const { setViewMode } = viewModeSlice.actions;
export default viewModeSlice.reducer;