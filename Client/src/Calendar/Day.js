import React, { useState, useEffect } from "react"
import { PromiseProvider } from "mongoose"
import moment from 'moment'

export default (props) => {

  const isSameMonth = (day) => {
    return moment(day).isSame(moment(props.currentDate), 'month')
  }

  const isSelected = (day) => {
    return moment(day).isSame(moment(props.currentDate), 'day')
  }

  const getClassName = (day) => {
    let classNames = "day"
    if (!isSameMonth(day))
      classNames += " shadow-day"
    else if (isSelected(day))
      classNames += " selected-day"
    return classNames
  }

  return (
        <td className={getClassName(props.value)}
        onClick={() => props.setCurrentDate(moment(props.value))}>
          {props.value.date()}
        </td>
  )
}