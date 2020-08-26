import React, {useState} from 'react'
import moment from 'moment'
import './DateTimePicker.css'

export default (props) => {
    return (
        <div>
            <div className="time-entry">
                <h5>time</h5>
                <input name="time" type="time"
                    onChange={event=>{props.setCurrentTime(event.target.value);console.log(event.target.value)}}
                    pattern='[0-9]{4}-[0-1][0-9]-[0-3][0-9] (1[012]|0?[1-9]):[0-5][0-9] (am|pm|AM|PM)'
                    value={props.currentTime}
                     />
            </div>
            <div className="reminder-entry">
                <h5>reminder </h5>
                <select name="reminder">
                    <option value="None">None</option>
                    <option value="None">In time</option>
                    <option value="None">1 day before</option>
                    <option value="None">2 days before</option>
                    <option value="None">1 week before</option>
                    <option value="None">Custom</option>
                </select>
            </div>
        </div>
    )
}