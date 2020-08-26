import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import {BrowserRouter} from 'react-router-dom'
import { DataContextProvider } from './contexts/dataContext' 
import "./style.css"

ReactDOM.render(
<BrowserRouter>
    <DataContextProvider>
        <App />
    </DataContextProvider>
</BrowserRouter>, document.getElementById("root"))