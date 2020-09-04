import React from 'react'

export default (props) => {
    return (
        <span 
            key={props.key} 
            className={props.className}>
                {props.value}
        </span>
    )
}