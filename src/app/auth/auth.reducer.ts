import { createReducer, on } from '@ngrx/store';
import * as user from './auth.actions';
import { Usuario } from '../models/usuario.model';

export interface State {
    user: Usuario | null;
}

export const initialState: State = {
   user: null,
}

export const userReducer = createReducer(initialState,

    on(user.setUser, (state , {user}) => ({ ...state, user: {...user} })),
    on(user.unSetUser, state => ({ ...state, user: null})),

);

