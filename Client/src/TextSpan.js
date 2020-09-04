import React from 'react'

export default (props) => {

    const getClassName = () => {
        return props.className
    }

    const getValue = () => {
        return props.value
    }

    return (
        <span 
            key={props.key} 
            className={props.className}>
                {props.value}
            </span>
    )
}