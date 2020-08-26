import React from "react"
import withDraggable from "./HOCs/withDraggable"

function TodoItem(props) {
    const getClassNames = (draggingOver) => {
        let styleClass = ""

        if (draggingOver === "todo-input") {
            styleClass += "todo-hidden"
        }
        else if (props.isOnInput) {
            if (props.wasDragged)
                styleClass += "todo-fully-hidden"
            else
                styleClass += "on-input"
        }
        return `todo-item ${styleClass}`
    }


    return (
        <div 
            className={getClassNames(props.draggingOver)}
            onClick={(event) => props.handleTodoItemClick(event.target, props.index)} >
                <div>
                    <input name="completed" type="checkbox" checked={props.completed} 
                    onChange= { () => {
                            props.toggleChecked(props.index, props.completed? false:true)
                        }
                    }/>
                    <label className={"todo-item-label"}>{props.isOnInput? props.inputText:props.text}</label>
                </div>

                <div className="todo-btn-container">
                    <button className={props.isDragging?"edit-btn over-input":"edit-btn"}>✎</button>
                    <button className={props.isDragging?"delete-btn over-input":"delete-btn"}>x</button>
                </div>
        </div>
    )
}

export default TodoItem