import React, { useState } from 'react'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import moment from 'moment'

export default (props) => {
    const [filteredTodos, setFilteredTodos] = useState(props.todos)

    const filterTodos = (filterWith) => {
        const todos = []
        switch(filterWith) {
            case 'All':
                setFilteredTodos(props.todos)
                break;
            case 'Today':
                for (let i=0; i<props.todos.length; i++)
                    if (moment(props.todos[i].due).isSame(moment(), 'day'))
                        todos.push()
            case 'Tomorrow':
                for (let i=0; i<props.todos.length; i++)
                    if (moment(props.todos[i].due).isSame(moment().add(1, 'days'), 'day'))
                        todos.push()
            case 'Next 7 days':
                for (let i=0; i<props.todos.length; i++)
                    if (moment(props.todos[i].due) < moment().add(7, 'days'))
                        todos.push()
        }
    }

    return (
        <>
            <div className="todo-timeline">
                <div className="todo-timeline-button first-timeline-button selected"
                    onClick={() => filterTodos('All')}>
                    All
                </div>
                <div className="todo-timeline-button"
                    onClick={filterTodos('Today')}>
                    Today
                </div>
                <div className="todo-timeline-button"
                    onClick={() => filterTodos('Tomorrow')}>
                    Tomorrow
                </div>
                <div className="todo-timeline-button"
                    onClick={() => filterTodos('Next 7 days')}>
                    Next 7 days
                </div>
                <div className="todo-timeline-button todo-timeline-plus-button">
                +
                </div>
            </div>

            <TodoForm 
                inputRef={props.inputRef} 
                handleInputChange={props.handleTodoFormInputChange}
                handleSubmit={props.handleTodoFormSubmit}
                handleBlur={props.handleTodoFormInputBlur} 
                inputText={props.inputText} />
                 
            <TodoList 
                toggleTodoChecked={props.toggleTodoChecked} 
                loading={props.loading} 
                todos={props.todos} 
                currentTodoOnInput={props.currentTodoOnInput} 
                inputText={props.inputText} 
                pageJustLoaded={props.pageJustLoaded}
                handleTodoItemClick={props.handleTodoItemClick} />
            <div className="todo-priorities">
                <div className="todo-priority-all">All</div>
                <div className="todo-priority-veryhigh">Very high</div>
                <div className="todo-priority-high">high</div>
                <div className="todo-priority-medium">medium</div>
                <div className="todo-priority-low">low</div>
            </div>
        </>
    )
}