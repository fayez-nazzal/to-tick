import React, {useState, useEffect} from 'react'
import moment from 'moment'
import Week from "./Week"

export default (props) => {
  const [weeks, setWeeks] = useState({})
  
  useEffect(()=>{
    const firstDate = moment(props.currentDate).startOf('month').startOf('week')
    const lastDate = moment(props.currentDate).endOf('month').endOf('week')
    
    let date = moment(firstDate)
    let wks = {}
    
    for (let i=1; date <= lastDate; i++) {
      let weekStr = Math.ceil(i.toString() / 7)
      wks[weekStr] = weekStr in wks ? wks[weekStr] : []
      wks[weekStr].push(moment(date))
      date = moment(date).add(1, 'days')
    }

    wks[6] = wks[6] ? wks[6] : []

    while (wks[6].length < 7) {
      wks[6].push(moment(date))
      date = moment(date).add(1, 'days')
    }

    setWeeks(wks)
  }, [props.currentDate])

  return (
    <div className="date-picker">
        <div className="month-nav">
          <button className='nav-button' onClick={props.prevMonth}>
            {'<'}
          </button>
          <h4 className='month-year'>{props.currentDate.format('MMMM Y')}</h4>
          <button className='nav-button' onClick={props.nextMonth}>
            {'>'}
          </button>
        </div>

        <table>
            <thead>
              {weeks[1]? weeks[1].map(day => <th className='day-name'>{day.format('ddd')}</th>):''}
            </thead>
            <tbody>
              {Object.keys(weeks).map(week => <Week days={weeks[week]} setCurrentDate={props.setCurrentDate} currentDate={props.currentDate} />)}
            </tbody>
        </table>
      </div>
  )
}