import React, {useState, useRef, useEffect} from 'react'
import './inputRegion.css'

function InputRegion(props) {
    const caret = <span className="caret"> </span>
    const [spansArray, setSpansArray] = useState([caret])
    const [inputTextArray, setInputTextArray] = useState([])
    const inputRegionRef = useRef(null)
    const [isLastSpanRich, setIsLastSpanRich] = useState(false)
    const [isLastSpanSpaces, setIsLastSpanSpaces] = useState(false)

    const keyActionMap = {
        letter: (letter) => {
            writeChar(letter)
        },
        Backspace: () => {
            deleteChar()
        }
    }

    const handleKey = (event) => {
        event.preventDefault()
        return event.key !== "Shift"? 
                event.key in keyActionMap?
                        keyActionMap[event.key]() :
                        event.key.length === 1?
                            keyActionMap.letter(event.key) :
                            null :
                        null

    }

    const writeChar = (key) => {
        setIsLastSpanRich(false)
        const lastText = inputTextArray[inputTextArray.length - 1]
        const newText = lastText + key
        
        if (isLastSpanRich || 
            inputTextArray.length === 0) {
            modifyStateArrays(appendSpan, "text", key)
        } else if (!newText.endsWith('map')) {
            modifyStateArrays(modifySpan, "text", newText, -2)
        }
    }

    const modifyStateArrays = (callback, className, text, ...args) => {
        const spansArrayClone = [...spansArray]
        const inputTextArrayClone = [...inputTextArray]

        callback(spansArrayClone, inputTextArrayClone, className, text, ...args)

        setSpansArray(spansArrayClone)
        setInputTextArray(inputTextArrayClone)
        setIsLastSpanSpaces(text.endsWith(" "))
    }

    const appendSpan = (spansClone, inputTextClone, className, text) => {
        spansClone.splice(-1, 0, 
            <span className={className}>
                {text}
            </span>)

        inputTextClone.push(text)
    }
 
    const modifySpan = (spansClone, inputTextClone, className, text, index) => {
        spansClone.splice(index, 1, 
            <span className={className}>
                {text}
            </span>)

        const inputArrayIndex = index>0? index : inputTextClone.length + index
        inputTextClone[inputArrayIndex + 1] = text
    }

    useEffect(() => {
        console.log(inputTextArray)
    }, [inputTextArray])

    const deleteChar = () => {
        if (inputTextArray.length === 0) {
            return
        }
        const spansArrayClone = [...spansArray]
        const textArrayClone = [...inputTextArray]
        const lastText = textArrayClone[textArrayClone.length - 1]
        const lastTextIndex = textArrayClone.length - 1
        const lastSpanPos = spansArrayClone.length - 2
        let newText
        if (lastText.length > 1) {
            newText = lastText.slice(0, -1)
            textArrayClone[lastTextIndex] = newText
            spansArrayClone[lastSpanPos] = <span>{newText}</span>
        } else {
            spansArrayClone.splice(lastSpanPos, 1)
            textArrayClone.splice(lastTextIndex, 1)
        }
        setSpansArray(spansArrayClone)
        setInputTextArray(textArrayClone)
    }

    
    // useEffect(()=>{
    //         setInterval(()=>{
    //             if (blinkCaret)
    //                 setCaretVisible(prev => !prev)
    //         }, 500)

    //     // TODO make clear when input disappears (like going to settings page)
    // }, [])

    // useEffect(()=> {
    //     caretRef.current.parentNode.insertBefore(caretRef.current, caretRef.current.parentNode.childNodes[caretPos])
    // }, [inputTextArray, caretPos])

    // const onInput = (value) => {
    //     const newArray = [...inputTextArray]
    //     let index = caretPos === value.length-1? caretPos:caretPos
    //     if (!isBackSpacePressed && !isAllHighlighted) {
    //         const char = value.charAt(caretPos)
    //         newArray.splice(index, 0, char)
    //         setCaretPos(prev => prev+1)
    //     } else if (!isBackSpacePressed && isAllHighlighted) {
    //         newArray.length = 0
    //         newArray.splice(0, 0, value.charAt(0))
    //         setIsAllHighlighted(false)
    //         index = 0
    //         setCaretPos(1)
    //     } else if (isBackSpacePressed && !isAllHighlighted) {
    //         newArray.splice(index, 1)
    //     } else {
    //         setCaretPos(0)
    //         newArray.length = 0
    //     }
    //     setInputTextArray(newArray)
    //     setInputText(value)
    //     isBackSpacePressed = false
    //     caretRef.current.parentNode.insertBefore(caretRef.current, caretRef.current.parentNode.childNodes[caretRef.current.parentNode.childNodes.length - 1])
    //     persistCaretTemporarily(true)
    //     console.log((value.match(/[^\r\n]+/g)).length)
    // }

    // const persistCaretTemporarily = (show) => {
    //     blinkCaret = false
    //     setCaretVisible(show? true:false)

    //     clearTimeout(blinkTimeout)
    //     blinkTimeout = setTimeout(()=>{
    //         blinkCaret = true
    //     }, 70)
    // }

    // const moveCaret = (index, right=false) => {
    //     const caretIndexInParent = right? index+1:index
    //     setCaretIndex(caretIndexInParent)
    //     caretRef.current.parentNode.insertBefore(caretRef.current, caretRef.current.parentNode.childNodes[caretIndexInParent])
    //     setCaretPos(index)
    // }

    // useEffect(()=>{
    //     console.log(caretPos)
    // }, [caretPos])

    // const handleKeyDown = (event) => {
    //     let index = event.target.selectionStart
    //     if (event.keyCode === 8 && caretPos > 0) {
    //         moveCaret(index-1)
    //         console.log('pressed bkp')
    //         isBackSpacePressed = true
    //         if (isAllHighlighted)
    //             onInput('')
    //     } else if (event.keyCode === 37 && caretPos > 0) {
    //         moveCaret(index-1)
    //     }
    //     else if (event.keyCode === 39 && caretPos < inputText.length) {
    //         moveCaret(index+1, true)
    //     }
    //     else if (event.keyCode === 13) {
    //         event.preventDefault()
    //     }
    // }

    return (
        <div className="input-region"
            ref={inputRegionRef}
            tabIndex="0"
            onClick={e => e.target.focus()}
            onKeyDown={e => handleKey(e)}>
            {spansArray}
        </div>
    )
        {/* <div
            className={getInvisibleRegionClassNames() + ' input-region-invisible'}
            onChange={(e) => onInput(e.target.value)}
            ref={invisibleInputRegion}>
            {inputTextArray.map((elem, index) => 
                <span style={{ visibility: 'visible', whiteSpace: 'pre', backgroundColor:isAllHighlighted? '#7DBC00':''}} key={index}>{elem}</span>
            )}
            <img
                style={{opacity: caretVisible&&props.isFocus? 1:0}}
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
                                    setIsAllHighlighted(true)
                                    moveCaret(inputTextArray.length+1)
                                }}
                onKeyDown={(e) => handleKeyDown(e)}
                />
            </div> */}
}

export default InputRegion