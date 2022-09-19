import React, { useState } from 'react'
import Todo from './components/Todo'
import { ApiType, SortType, DirType } from 'redux/todo/todoSlice'
import FilterColumn from './components/FilterColumn'
import './App.css'

const App: React.FC = () => {
    const [theType, setTheType] = useState<ApiType>('all')
    const [theSort, setTheSort] = useState<SortType>('created')
    const [theDirType, setDirType] = useState<DirType>('asc')
    return (
        <div className="App">
            <FilterColumn
                type={theType}
                sort={theSort}
                direction={theDirType}
                atSetType={setTheType}
                atSetSort={setTheSort}
                atSetDirect={setDirType}
            />
            <Todo type={theType} sort={theSort} direction={theDirType} />
        </div>
    )
}

export default App
