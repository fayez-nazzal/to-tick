import React, { useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import TodoNavigation from './TodoNavigation'
import TodoContents from "./TodoContents"
import useTodos from "./useTodos"
import {isOnlyWhitespaces} from './HelperFunctions'
import {Link, Switch, Route, Redirect} from 'react-router-dom'

function HomePage() {
    const {loading, todos, setTodos, addTodo, editTodo, deleteTodoByIndex, toggleTodoChecked} = useTodos()
    const [groups, setGroups] = useState(["Today Tasks", "Plans"])
    const [inputText, setInputText] = useState('hh')
    const [currentTodoOnInput, setCurrentTodoOnInput] = useState({})
    const [loggedIn, setLoggedIn] = useState(false)
    let todoFormInput = null
    
    const setTodoOnInput = (index) => {
        const todo = todos[index]
        setCurrentTodoOnInput({
            index: index,
            wasDragged: false})
        
        setInputText(todo.text)
        
        if(todoFormInput)
            todoFormInput.focus()
    }

    const handleTodoItemClick = (target, index) => {
        switch (target.className) {
            case "edit-btn":
                setTodoOnInput(index)
                break
            case "delete-btn":
                deleteTodoByIndex(index)
                break
            default:
                if (todoFormInput)
                    todoFormInput.blur()
        }
    }
    
    const onTodoDragStart = () => {
        // setInputText("")
        // setCurrentTodoOnInput({})
    }
    
    const onTodoDragUpdate = (update) => {
        // const {source, destination} = update         
        
        // if (!todoFormInput)
        //     return

        // if (destination && destination.droppableId === "todo-input")
        //     todoFormInput.className = "todo-input dragging-over"
        // else
        //     todoFormInput.className = "todo-input"
        
        // setInputText(!destination ||destination.droppableId !== "todo-input"?
        //             "":
        //             todos[source.index].text)
    }

    const onTodoDragEnd = (result) => {
        const {draggableId, source, destination} = result
        
        if (!destination)
        return
        
        
        if (destination.droppableId === "todo-input" && 
        inputText === todos[source.index].text) {
            const sourceText = todos[source.index].text
            setInputText(sourceText)
            setCurrentTodoOnInput({
                index: source.index,
                 wasDragged: true})
            
            if (todoFormInput) {
                todoFormInput.focus()
                todoFormInput.className = "todo-input dragged-over"
            }
    }
    
    else if (
        source.index === draggableId === destination.index
        ) {
            return
        }
        else {
        let newTodos = Array.from(todos)
        newTodos.splice(source.index, 1)
        newTodos.splice(destination.index, 0, todos[source.index])
        setTodos(newTodos)
    }
    }

    const handleTodoFormInputChange = (event) => {       
        setInputText(event.target.value)
    }
    
    const handleTodoFormSubmit = (event) => {
        if (Object.keys(currentTodoOnInput).length > 0) {
            if(isOnlyWhitespaces(inputText))
                deleteTodoByIndex(currentTodoOnInput.index)
            else
                editTodo(currentTodoOnInput.index, inputText)
        } else {
            addTodo(inputText)
        }

        if (todoFormInput)
            todoFormInput.className = "todo-input"
        
        setInputText("")
        setCurrentTodoOnInput({})
        event.preventDefault()
        }
    
    
    const handleTodoFormInputBlur = () => {
        setCurrentTodoOnInput({})
        
    todoFormInput.className = "todo-input"
    
    if (currentTodoOnInput.index>=0)
        setInputText("")  
    }

    const updatedState = []
    const addNewGroup = () => {
        // const groupName = prompt("Enter group name")
        
        for (let i=0; i < 20; i++) {
            updatedState.push('')
            setGroups([...groups, ...updatedState])
        }
    }
    
    return (
        <>
            
            <div className="nav-todo-container">
            
            <TodoNavigation 
                groups={groups} 
                addNewGroup={addNewGroup}/>
                     
                <DragDropContext

                    onDragStart={onTodoDragStart} 
                    onDragEnd={onTodoDragEnd} 
                    onDragUpdate={onTodoDragUpdate}>
                    
                    <div className="form-list-container">
                        <TodoContents
                        inputRef={el => todoFormInput = el} 
                        handleTodoFormInputChange={handleTodoFormInputChange}
                        handleTodoFormSubmit={handleTodoFormSubmit}
                        handleTodoFormInputBlur={handleTodoFormInputBlur} 
                        inputText={inputText}
                        toggleTodoChecked={toggleTodoChecked} 
                        loading={loading} 
                        todos={todos} 
                        currentTodoOnInput={currentTodoOnInput} 
                        handleTodoItemClick={handleTodoItemClick}
                        />
                    </div>
                    
                </DragDropContext>
            </div>
        </>
    )
}

export default HomePage