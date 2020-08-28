import React, { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import planner from './png/planner.png'
import menu from './png/menu.png'
import DatePicker from './Calendar/DateTimePicker'
import InputRegion from './InputRegion'

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
                                    < InputRegion
                                        inputText={props.inputText}
                                        inputRef={props.inputRef}
                                        handleInputChange={props.handleInputChange}
                                        setIsFocus={setIsFocus}
                                        handleBlur={props.handleBlur}
                                        isFocus={isFocus}
                                    />
                                        
                                        {/* <div style={{position: 'relative', marginBottom: '-10px'}}>
                                            <img
                                            src={planner} 
                                            className={isFocus? 'todo-input-due-icon':'todo-input-due-icon-hidden'}
                                            onMouseDown={setDueDate}
                                            />
                                            <img src={menu} className={isFocus? 'todo-input-menu-icon':'todo-input-menu-icon-hidden'}/>
                                        </div>
                                        
                                        <DatePicker className="date-picker" /> */}
                                        
                                        <div style={{display: 'none'}}>{provided.placeholder}</div>
                                </ div>
                            </form>
                )}
            </Droppable>

    )
}
)