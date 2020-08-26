import React from 'react'
import { Draggable } from 'react-beautiful-dnd'


const withDraggable = (WrappedComponent, options) => {
    return (props) => { 
        return (
        <div>
        <Draggable
            draggableId={""+props.id}
            index={props.index}>
        
            { (provided, snapshot) => (
                <div 
                id={props.id}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                >
                <WrappedComponent  
                    isDragging={snapshot.isDragging}
                    draggingOver={snapshot.draggingOver}
                        {...props}/>
                </div>
            )
            }
        </Draggable>
        </div>
    )
}
}

export default withDraggable