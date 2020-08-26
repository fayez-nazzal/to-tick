import React from 'react'
import Day from './Day'

export default (props) => {
    return (
        <tr>
            {props.days.map((day, index) => <Day key={index} 
                                                value={day}
                                                setCurrentDate={props.setCurrentDate}
                                                currentDate={props.currentDate}
                                                />)}
        </tr>
    )
}