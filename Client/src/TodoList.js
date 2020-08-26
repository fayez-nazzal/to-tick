import React from "react"
import TodoItem from './TodoItem'
import {css} from "@emotion/core"
import SyncLoader from "react-spinners/SyncLoader"
import { Droppable } from "react-beautiful-dnd"
import { TransitionGroup, CSSTransition } from "react-transition-group"


const override = css`
  margin: 5% 0;
  text-align: center;
`;

function TodoList(props) {
    return (
        <Droppable droppableId="todo-list">
            {proveided => (
            <div
                ref={proveided.innerRef}
                {...proveided.droppableProps}
                className="todo-list">
                <SyncLoader
                    size={15}
                    css={override}
                    color={"#B8DFA8"}
                    loading={props.loading}
                >
                </SyncLoader>
                
                <TransitionGroup>
                {props.todos.map((todo, index) =>(
                    <CSSTransition timeout={100} classNames="todo-item">
                        <TodoItem
                        key={todo._id}
                        index={index}
                        id={todo._id} 
                        text={todo.text} 
                        completed={todo.completed} 
                        isOnInput={index===props.currentTodoOnInput.index} 
                        wasDragged={props.currentTodoOnInput.wasDragged}
                        inputText={props.inputText} 
                        toggleChecked={props.toggleTodoChecked} 
                        handleTodoItemClick={props.handleTodoItemClick}
                        />
                    </CSSTransition>)
                )}
                </TransitionGroup>
                {proveided.placeholder}
            </div>
            )}
        </Droppable>
    )
}
export default TodoList