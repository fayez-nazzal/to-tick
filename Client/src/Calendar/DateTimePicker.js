import React, { useState, useEffect } from "react"
import moment from 'moment'
import DatePicker from "./DatePicker"
import './DateTimePicker.css'
import TimePicker from "./TimePicker"

moment.updateLocale('en', {
  week: {
    dow: 5,
  },
})

export default () => {
  const [currentDate, setCurrentDate] = useState(moment())
  const [currenTime, setCurrentTime] = useState('00:00 AM')

  const prevMonth = () => {
    const prevMonthDate = moment(currentDate).add('1', 'months')
    setCurrentDate(prevMonthDate)
  }

  const nextMonth = () => {
    const nextMonthDate = moment(currentDate).add('1', 'months')
    setCurrentDate(nextMonthDate)
  }

  return (
    <div className="container">
      <div className="datetime-picker">
          <div className="mode-buttons">
            <button className="due-button">Specefic</button>
            <button className="duration-button">Duration</button>
          </div>
          
          <DatePicker currentDate={currentDate} prevMonth={prevMonth} nextMonth={nextMonth} setCurrentDate={setCurrentDate}/>
          <TimePicker currentTime={currenTime} currentDate={currentDate} setCurrentTime={setCurrentTime} />
          <div className="action-buttons">
            <button className="clear-button">Clear</button>
            <button className="ok-button">Ok</button>
          </div>
      </div>
    </div>
  )
}