import React, { useEffect, useCallback, useRef, useState } from 'react'
import { fetchTodoList, ApiType, SortType, DirType } from 'redux/todo/todoSlice'
import { RootState } from 'redux/store'
import { useSelector, useAppDispatch } from 'redux/hooks'
import { getNextPage } from 'redux/todo/todoSlice'
import styles from './index.module.css'

interface TodoType {
    type?: ApiType
    sort?: SortType
    direction?: DirType
}

const Todo: React.FC<TodoType> = ({ type, sort, direction }) => {
    const dispatch = useAppDispatch()
    const { page, todoList, loading, keepRolling } = useSelector((state: RootState) => state)
    const [showTopRocket, setShowTopRocket] = useState<boolean>(false)
    const listColumnRef = useRef<HTMLDivElement | null>(null)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const renderTime = useRef<number>(0)
    const lastTodoItemRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return
            //將上次最後一個dom元素disconnect
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && keepRolling) {
                    dispatch(getNextPage())
                }
            })
            if (node) {
                observerRef.current.observe(node)
            }
        },
        // eslint-disable-next-line
        [loading, dispatch]
    )
    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }
    useEffect(() => {
        if (renderTime.current !== page) {
            dispatch(fetchTodoList({ page, type, sort, direction }))
            renderTime.current = page
        }
        // eslint-disable-next-line
    }, [page, dispatch])

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                setShowTopRocket(true)
            } else {
                setShowTopRocket(false)
            }
        })
    }, [])
    return (
        <div className={styles.todoWrap} ref={listColumnRef}>
            {todoList
                ?.map((todo, index) => {
                    if (!todo) {
                        return null
                    }
                    if (todoList.length === index + 1) {
                        //如果是最後一個元素就加上Ref
                        return (
                            <div ref={lastTodoItemRef} className={styles.todoItem} key={todo.name}>
                                <div className={styles.decoration} />
                                <div>{todo.name}</div>
                            </div>
                        )
                    }
                    return (
                        <div className={styles.todoItem} key={todo.name}>
                            <div className={styles.decoration} />
                            <div>{todo.name}</div>
                        </div>
                    )
                })
                .filter(Boolean)}
            {loading && <div className={styles.loading}>Loading....</div>}
            {!keepRolling && (
                <div
                    className={styles.message}
                    onClick={() => {
                        goToTop()
                    }}
                >
                    沒有更多的訊息囉，如果你在地底三萬呎，點我可以返回頂部~
                </div>
            )}
            {showTopRocket && (
                <div
                    className={styles.topRocket}
                    onClick={() => {
                        goToTop()
                    }}
                >
                    ^ Back Top ^
                </div>
            )}
        </div>
    )
}

export default React.memo(Todo)
