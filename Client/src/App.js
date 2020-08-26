import React, { useState, useEffect, useContext } from "react"
import LoginPage from './LoginPage'
import HomePage from './HomePage'
import {Link, Switch, Route, Redirect, useLocation, useHistory} from 'react-router-dom'
import Header from "./Header"
import { DataContext } from "./contexts/dataContext"
import DatePicker from "./Calendar/DateTimePicker"

function App() {
    const { fetchedData } = useContext(DataContext)
    const location = useLocation()
    const history = useHistory()
    
    return (
            <div className='main-div' >
                <Switch>
                    <Route exact path='/'>
                        {fetchedData? <HomePage />: <Redirect to="/"/>}
                    </Route>
                    <Route path='/login'>
                        < LoginPage />
                    </Route>
                    <Route path='/calender'>
                        < DatePicker />
                    </Route>
                </Switch>
            </div>
    )
}

export default App