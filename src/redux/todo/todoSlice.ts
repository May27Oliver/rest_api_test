import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Octokit } from 'octokit'

export type ApiType = 'all' | 'public' | 'private' | 'forks' | 'sources' | 'member' | 'internal' | undefined
export type SortType = 'created' | 'updated' | 'pushed' | 'full_name' | undefined
export type DirType = 'asc' | 'desc' | undefined

const callOctokit = async (
    page: number,
    type: ApiType = 'all',
    sort: SortType = 'created',
    direction: DirType = 'asc'
) => {
    try {
        const octokit = new Octokit()
        const response = await octokit.request('GET /orgs/{org}/repos', {
            org: 'Google',
            sort: sort,
            type: type,
            direction: direction,
            per_page: 30,
            page: page,
        })
        if (response.status !== 200) {
            return []
        }
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const fetchTodoList = createAsyncThunk(
    'todo/getTodoList',
    async (param: { page: number; type: ApiType; sort: SortType; direction: DirType }) => {
        const { page, type, sort, direction } = param
        const data = await callOctokit(page, type, sort, direction)
        return data
    }
)

export type TodoList = Awaited<Promise<ReturnType<typeof callOctokit>>>

type InitialState = {
    loading: boolean
    todoList: TodoList | []
    page: number
    error: Error | null
    keepRolling: boolean //如果回傳了空陣列KeepRolling就會制止再發API
}

const initialState: InitialState = {
    loading: false,
    todoList: [],
    page: 1,
    error: null,
    keepRolling: true,
}

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        getNextPage: (state) => {
            state.page++
        },
        cleanTodoList: (state) => {
            state.todoList = []
        },
        setFirstPage: (state) => {
            state.page = 1
        },
        stopRolling: (state) => {
            state.keepRolling = false
        },
        startRolling: (state) => {
            state.keepRolling = true
        },
    },
    extraReducers: {
        [fetchTodoList.pending.type]: (state: InitialState) => {
            state.loading = true
        },
        [fetchTodoList.fulfilled.type]: (state: InitialState, action: PayloadAction<TodoList>) => {
            if (!state.todoList) {
                state.todoList = []
            }

            if (!action.payload) {
                state.todoList = state.todoList.concat([])
            } else if (action.payload.length === 0) {
                state.keepRolling = false
            } else {
                state.todoList = [...state.todoList, ...action.payload]
            }
            state.loading = false
        },
        [fetchTodoList.rejected.type]: (state: InitialState, action: PayloadAction<Error>) => {
            state.error = action.payload
        },
    },
})

export default todoSlice.reducer
export const { getNextPage, cleanTodoList, setFirstPage, startRolling } = todoSlice.actions
