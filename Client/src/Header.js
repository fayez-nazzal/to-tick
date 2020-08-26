import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'

export default (props) => {
    return (
        <header className="header">
            <h2 className="logo">to-tick!</h2>
            <Switch>
                <Route path="/login">
                    <div className="login-header-nav">
                        <div className="header-login">
                             <Link className="header-link">Login</Link> 
                        </div>
                        <div className="header-register">
                             <Link className="header-link">Sign Up</Link>
                        </div>
                    </div>
                </Route>
            </Switch>
        </header>
    )
}