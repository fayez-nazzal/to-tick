import React, {useState, useEffect, useRef} from 'react'
import './inputRegion.css'

let blinkCaret = true
let blinkTimeout
let isBackSpacePressed

function InputRegion(props) {
    const [inputText, setInputText] = useState('')
    const [inputTextArray, setInputTextArray] = useState([])
    const [caretBlink, setCaretBlink] = useState(true)
    const [caretVisible, setCaretVisible] = useState(true)
    const [caretPos, setCaretPos] = useState(0)
    const [insertedChar, setInsertedChar] = useState(0)
    const [insertIndex, setInsertIndex] = useState(0)
    const [caretIndex, setCaretIndex] = useState(0)
    const [isAllHighlighted, setIsAllHighlighted] = useState(false)
    const caretRef = useRef(null)

    useEffect(()=>{
            setInterval(()=>{
                if (blinkCaret)
                    setCaretVisible(prev => !prev)
            }, 500)

        // TODO make clear when input disappears (like going to settings page)
    }, [])

    useEffect(()=> {
        caretRef.current.parentNode.insertBefore(caretRef.current, caretRef.current.parentNode.childNodes[caretPos])
    }, [inputTextArray, caretPos])

    const onInput = (value) => {
        const newArray = [...inputTextArray]
        const index = caretPos === value.length-1? caretPos:caretPos
        if (!isBackSpacePressed) {
            const char = value.charAt(caretPos)
            newArray.splice(index, 0, char)
            setCaretPos(prev => prev+1)
        }
        else {
            if (isAllHighlighted) {
                newArray.length = 0
            }
            else
                newArray.splice(index, 1)

            isBackSpacePressed = false
        }
        caretRef.current.parentNode.insertBefore(caretRef.current, caretRef.current.parentNode.childNodes[caretRef.current.parentNode.childNodes.length - 1])
        setInputTextArray([...newArray])
        setInputText(value)
        persistCaretTemporarily(true)
    }


    const getRegionClassNames = () => {
        if (props.isFocus) {
            return 'input-region input-region-focus'
        }
        else {
            return 'input-region'
        }
    }

    const getInvisibleRegionClassNames = () => {
        if (props.isFocus) {
            return 'input-region input-region-invisible-focus'
        }
        else {
            return 'input-region input-region-invisible'
        }
    }

    const getInputClassName = () => {
        return props.isFocus? 'transparent-input transparent-input-focus':'transparent-input'
    }

    const getCaretClassNames = () => {
        return props.isFocus? 'caret caret-focus':'caret'
    }

    const persistCaretTemporarily = (show) => {
        blinkCaret = false
        setCaretVisible(show? true:false)

        clearTimeout(blinkTimeout)
        blinkTimeout = setTimeout(()=>{
            blinkCaret = true
        }, 230)
    }

    const moveCaret = (index, right=false) => {
        const caretIndexInParent = right? index+1:index
        setCaretIndex(caretIndexInParent)
        caretRef.current.parentNode.insertBefore(caretRef.current, caretRef.current.parentNode.childNodes[caretIndexInParent])
        setCaretPos(index)
    }

    useEffect(()=>{
        console.log(caretPos)
    }, [caretPos])

    const handleKeyDown = (event) => {
        let index = event.target.selectionStart
        if (event.keyCode === 37 && caretPos > 0) {
            moveCaret(index-1)
        }
        else if (event.keyCode === 39 && caretPos < inputText.length) {
            moveCaret(index+1, true)
        }
        else if (event.keyCode === 13) {
            event.preventDefault()
        } else if (event.keyCode === 8 && caretPos > 0) {
            moveCaret(index-1)
            isBackSpacePressed = true
        }
    }

    return (
        <>
        <div
            className={getRegionClassNames()}>
        </div>
        <div
            className={getInvisibleRegionClassNames() + ' input-region-invisible'}
            onChange={(e) => onInput(e.target.value)}>
            {inputTextArray.map((elem, index) => 
                <span style={{visibility: 'visible', whiteSpace: 'pre', backgroundColor:isAllHighlighted? '#7DBC00':''}} key={index}>{elem}</span>
            )}
            <img
                style={{opacity: caretVisible? 1:0}}
                className={getCaretClassNames()}
                ref={caretRef} />
            <textarea
                type="text"
                autoComplete="off"
                className={getInputClassName()}
                placeholder="Add a task"
                value={inputText}
                ref={props.inputRef}
                onChange={(event) => props.handleInputChange(event)}
                onBlur={(event) => {
                    props.setIsFocus(false)
                    props.handleBlur(event)
                    persistCaretTemporarily(false)
                }}
                autoFocus={true}
                onFocus={() => {
                    props.setIsFocus(true)
                    persistCaretTemporarily(false)
                }}
                onClick={(e) => {
                    moveCaret(e.target.selectionStart, true)
                    setIsAllHighlighted(false)
                }}
                onPaste={e => e.preventDefault()}
                onDoubleClick={e => {e.target.setSelectionRange(0, inputTextArray.length)
                                    setIsAllHighlighted(true)}}
                onKeyDown={(e) => handleKeyDown(e)}
                />
            </div>
        </>
    )
}

export default InputRegion