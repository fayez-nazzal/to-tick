import { useState, useEffect, useContext } from 'react'
import {isOnlyWhitespaces} from './HelperFunctions'
import { DataContext } from './contexts/dataContext'

export default () => {
    const { loading, fetchedData, syncUpdate } = useContext(DataContext)
    const [ todos, setTodos ] = useState([])

    useEffect(()=>{
        if (!loading)
            setTodos(fetchedData.todos)
    }, [loading])

    const syncTodoUpdate = (todo, method) => syncUpdate("/ticks", todo, method)

    const addTodo = (todoText) => {
        if (isOnlyWhitespaces(todoText))
            return
        const todo = {
            text: todoText.trim(),
            group_id: "5f448e2e83074034e5b4d07f",
            completed: false
        }
        setTodos(prevTodos => [...prevTodos, todo])
        syncTodoUpdate(todo, "POST")
    }

    const editTodo = (index, newTodoText) => {
        const newTodos = todos.slice()
        const todo = {...todos[index], text:newTodoText}
        newTodos[index] = todo
        setTodos(newTodos)
        syncTodoUpdate(todo, "PUT")
    }

    const deleteTodoByIndex = (index) => {
        const todo = todos[index]
        const newTodos = todos.slice()
        newTodos.splice(index, 1)
        setTodos(newTodos)
        syncTodoUpdate(todo, "DELETE")
    }

    const toggleTodoChecked = (index, value) => {
        const newTodo = {...todos[index], completed:value}
        const newTodos = todos.slice()
        newTodos[index] = newTodo
        setTodos(newTodos)
        syncTodoUpdate(newTodo, "PUT")
    }

    return {loading, todos,  setTodos, addTodo, editTodo, deleteTodoByIndex}
}