import {
    useSelector as useReduxSelector,
    TypedUseSelectorHook,
    useDispatch 
} from 'react-redux';
import {RootState} from "./store";
import {AppDispatch} from './store';

export const useSelector:TypedUseSelectorHook<RootState> = useReduxSelector;
export const useAppDispatch =()=>useDispatch<AppDispatch>();