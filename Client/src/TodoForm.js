import React, { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import planner from './png/planner.png'
import menu from './png/menu.png'
import DatePicker from './Calendar/DateTimePicker'

export default React.forwardRef((props, ref) => {
    const [isFocus, setIsFocus] = useState(false)
    const [pickDueDate, setPickDueDate] = useState(false)

    const setDueDate = (event) => {
        event.preventDefault()
        setPickDueDate(prevValue => !prevValue)
    }
    

    return (
            <Droppable droppableId={"todo-input"}>
                { (provided, snapshot) => (
                        <form   className="todo-form" 
                                spellCheck={false}
                                onSubmit={props.handleSubmit}>
                        
                            <h4>Today Tasks</h4>

                            <div
                                ref = {provided.innerRef}
                                {...provided.droppableProps}>
                                    <input
                                        ref={props.inputRef}
                                        className="todo-input"
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Add a task"
                                        value={props.inputText}
                                        onChange={(event) => props.handleInputChange(event)}
                                        onBlur={(event) => {
                                            setIsFocus(prevValue => !prevValue)
                                            props.handleBlur(event)
                                        }}
                                        onFocus={() => setIsFocus(prevValue => !prevValue)}
                                        / >
                                        
                                        <div style={{position: 'relative', marginBottom: '-10px'}}>
                                            <img
                                            src={planner} 
                                            className={isFocus? 'todo-input-due-icon':'todo-input-due-icon-hidden'}
                                            onMouseDown={setDueDate}
                                            />
                                            <img src={menu} className={isFocus? 'todo-input-menu-icon':'todo-input-menu-icon-hidden'}/>
                                        </div>
                                        
                                        <DatePicker className="date-picker" />
                                        
                                        <div style={{display: 'none'}}>{provided.placeholder}</div>
                                </ div>
                            </form>
                )}
            </Droppable>

    )
}
)