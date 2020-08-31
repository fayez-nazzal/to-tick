import React, {useState, useEffect, useRef} from 'react'
import './inputRegion.css'

function InputRegion(props) {
    const caret = <img className="caret"/>
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
        if (key === " ") {

        } else if (isLastSpanRich || 
            inputTextArray.length === 0) {
            appendSpan("text", key)
        } else if (!newText.endsWith('map')) {
            newText = isLastSpanSpaces? lastText+"0":newText
            spansArrayClone[lastIndex-1] = <span className={key===" "? "hidden":"text"}>
                {newText}
            </span>
            textArrayClone[lastIndex-1] = newText
        }
        //  else {
        //     const prevText = newText.substring(0, -3)
        //     newText = newText.slice(-3)

        //     textArrayClone.push(newText)
        //     spansArrayClone.splice(lastIndex, 0, <span className="text hh">{newText}</span>)
            
        //     if (prevText) {
        //         textArrayClone[lastIndex-1] = prevText
        //         spansArrayClone[lastIndex-1] = <span className="text">{prevText}</span>
        //     } else {
        //         textArrayClone.splice(lastIndex-1, 1)
        //         spansArrayClone.splice(lastIndex-1, 1)
        //     }

        //     setIsLastSpanRich(true)
        // }

    }

    const appendSpan = (className, text) => {
        const spansClone = [...spansArray]
        spansClone.splice(-1, 0, 
            <span className={className}>
                {text}
            </span>)
        setSpansArray(spansClone)

        const inpuTextClone = [...inputTextArray]
        inpuTextClone.push(text)
        setInputTextArray(inpuTextClone)
    }

    useEffect(()=>{
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