import React, {useState, useEffect, createContext} from 'react'
import axios from 'axios'

const DataContext = createContext()

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    }
})

const DataContextProvider = (props) => {
    const [loading, setLoading] = useState(true)
    const [fetchedData, setFetchedData] = useState({})
    
    useEffect(() => {
        updateData()
    }, [])

    const updateData = () => {
        api.get('/userinfo')
        .then(({data}) => {
            setFetchedData(data)
            setLoading(false)
        })
        .catch(err => setFetchedData(false))
    }

    const syncUpdate = (urlPath, data, method) => {
        if (!data || !method)
            return

        const requestFunction = method === "POST"? api.post :
                            method === "PUT"? api.put :
                            api.delete
        
        requestFunction(urlPath+(method==="POST"? "" : "/"+data._id), data)
        .then(updateData)
        .catch()
    } 
    
    return (
        <DataContext.Provider value = {{ loading, fetchedData, syncUpdate }}>
            {props.children}
        </DataContext.Provider>
    )
}

export { DataContextProvider, DataContext }