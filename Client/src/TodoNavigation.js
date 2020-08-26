import React from 'react'

const TodoNavigation = (props) => {
    return (
        <div className="navigation">
            <div className="navigation-section-container">

                <h4 className="navigation-label">Groups</h4>
                
                <button className="navigation-add-button" 
                onClick={props.addNewGroup}>
                    +
                </button>
            </div>
            {props.groups.map(groupName => <button className="navigation-button">{groupName}</button>)}
        </div>
    )
}

export default TodoNavigation