import React from 'react'
import TodoForm from './TodoForm'
import TodoList from './TodoList'

export default (props) => {
    return (
        <>
            <div className="todo-timeline">
                <div className="todo-timeline-button first-timeline-button selected">All</div>
                <div className="todo-timeline-button">Today</div>
                <div className="todo-timeline-button">Tomorrow</div>
                <div className="todo-timeline-button">Next Week</div>
                <div className="todo-timeline-button">Later</div>
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