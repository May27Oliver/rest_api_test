import React from 'react'
import { RootState } from 'redux/store'
import {
    cleanTodoList,
    setFirstPage,
    startRolling,
    fetchTodoList,
    ApiType,
    SortType,
    DirType,
} from 'redux/todo/todoSlice'
import { useSelector, useAppDispatch } from 'redux/hooks'
import styles from './index.module.css'

interface FilterColumnType {
    type: ApiType
    sort: SortType
    direction: DirType
    atSetType(type: ApiType): void
    atSetSort(sort: SortType): void
    atSetDirect(dir: DirType): void
}

const FilterColumn: React.FC<FilterColumnType> = ({ type, sort, direction, atSetType, atSetSort, atSetDirect }) => {
    const { page } = useSelector((state: RootState) => state)
    const dispatch = useAppDispatch()
    return (
        <div className={styles.filtersColumn}>
            <div className={styles.titleCol}>Type:</div>
            <select
                className={styles.SelectCol}
                onChange={(e) => {
                    atSetType(e.target.value as ApiType)
                }}
            >
                <option>all</option>
                <option>public</option>
                <option>private</option>
                <option>forks</option>
                <option>sources</option>
                <option>member</option>
                <option>internal</option>
            </select>
            <div className={styles.titleCol}>Sort:</div>
            <select
                className={styles.SelectCol}
                onChange={(e) => {
                    atSetSort(e.target.value as SortType)
                }}
            >
                <option>created</option>
                <option>updated</option>
                <option>pushed</option>
                <option>full_name</option>
            </select>
            <div className={styles.titleCol}>Direction:</div>
            <select
                className={styles.SelectCol}
                onChange={(e) => {
                    atSetDirect(e.target.value as DirType)
                }}
            >
                <option>asc</option>
                <option>desc</option>
            </select>
            <button
                className={styles.Button}
                onClick={() => {
                    dispatch(cleanTodoList())
                    dispatch(startRolling())
                    if (page === 1) {
                        dispatch(fetchTodoList({ page: 1, type, sort, direction }))
                    }
                    dispatch(setFirstPage())
                }}
            >
                Search
            </button>
        </div>
    )
}

export default React.memo(FilterColumn)
