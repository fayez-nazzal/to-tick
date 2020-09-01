import React, {useState, useRef, useEffect} from 'react'
import './inputRegion.css'
import { text } from 'body-parser'

function InputRegion(props) {
    const caret = <span className="caret"> </span>
    const [spansArray, setSpansArray] = useState([caret])
    const [inputTextArray, setInputTextArray] = useState([])
    const inputRegionRef = useRef(null)
    const [isLastSpanRich, setIsLastSpanRich] = useState(false)
    const [isLastSpanSpaces, setIsLastSpanSpaces] = useState(false)
    const [caretIndex, setCaretIndex] = useState(0)
    const [caretPos, setCaretPos] = useState(0)
    
    const keyActionMap = {
        letter: (letter) => {
            writeChar(letter)
        },
        Backspace: () => {
            deleteChar()
        },
        ArrowRight: () => {
            moveCaret(1)
        },
        ArrowLeft: () => {
            moveCaret(-1)
        },
        Control: () => {
            test()
        }
    }

    const handleKey = (event) => {
        event.preventDefault()
        console.log(event.key)
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
            setCaretIndex(prev => prev+1)
        } else if (!newText.endsWith('map')) {
            modifyStateArrays(modifySpan, "text", newText, -2)
        }
        setCaretPos(prev => prev+1)
    }

    const test = () => {
        modifyStateArrays(appendSpan, "text", 'a')
        setTimeout(()=>{
            modifyStateArrays(appendSpan, "text", 'c')
        }, 120)
        setTimeout(()=>{
            setCaretIndex(prev => prev-1)
        }, 120)
        setTimeout(()=>{
            modifyStateArrays(insertAtCaretIndex, "text", "newText")
        }, 120)
    }

    
    const deleteChar = () => {
        if (inputTextArray.length === 0)
        return
        let lastText = inputTextArray[inputTextArray.length - 1]
        if (!lastText || lastText.length === 1) {
            modifyStateArrays(deleteSpan, -2)
            setCaretIndex(prev => prev-1)
        } else if (!isLastSpanRich) {
            modifyStateArrays(modifySpan, "text", lastText.slice(0, -1), -2)
        }
        setCaretPos(prev => prev-1)
    }
    
    const moveCaret = (x) => {
        //case 1: the caret is at the end and move to the rght, not possible
        //case 2: the caret is at the beggining and move to the left, not possible
        /*
        case 3: the caret is at the end  and go left,
        remove first letter from the preceeding span,
        add that letter to to a new span
        move the caret before the new span
         */
        /*
        case 4: the caret is at the center and move left,
        remove first letter from preceding span,
        add that letter to the leading span,
        don't move caret
        */
       const spansClone = [...spansArray]
       const textClone = [...inputTextArray]
       let caretIndexClone = caretIndex
       while (x > 0) {
        
        x--
       }

       while (x < 0) {
           const char = textClone[caretIndexClone-1].slice(-1)
           textClone[caretIndexClone-1] = textClone[caretIndexClone-1].slice(0, -1)
           spansClone[caretIndexClone-1] = <span className="text">{textClone[caretIndexClone-1]}</span>
        // case 3 use switch for all left cases
            spansClone.splice(caretIndexClone+1, 0, <span className="text">{char}</span>)
            textClone.push(char)
        x++
       }
       setCaretIndex(caretIndexClone)
       setSpansArray(spansClone)
       setInputTextArray(textClone)
    }

    function moveInArray(arr, from, to) {
        var elem = arr[from];
        arr.splice(from, 1);
        arr.splice(to, 0, elem);
    }

    const modifyStateArrays = (callback, ...args) => {
        const spansArrayReference = [...spansArray]
        const inputTextArrayReference = [...inputTextArray]

        callback(spansArrayReference, inputTextArrayReference, ...args)

        setSpansArray(spansArrayReference)
        setInputTextArray(inputTextArrayReference)
    }

    const appendSpan = (spansReference, inputTextReference, className, text) => {
        spansReference.splice(-1, 0, 
            <span className={className}>
                {text}
            </span>)

        inputTextReference.push(text)
    }
 
    const modifySpan = (spansReference, inputTextReference, className, text, index) => {
        spansReference.splice(index, 1, 
            <span className={className}>
                {text}
            </span>)

        const inputArrayIndex = index>=0? index: inputTextReference.length + index + 1
        inputTextReference[inputArrayIndex] = text
    }

    const insertAtCaretIndex = (spansReference, inputTextArrayReference, index) => {
        //Modify the span that is right before the caret position
    }

    const deleteSpan = (spansReference, inputTextReference, index) => {
        spansReference.splice(index, 1)
        const inputArrayIndex = index>=0? index: inputTextReference.length + index + 1
        inputTextReference.splice(inputArrayIndex, 1)
    }

    useEffect(() => {
        console.log('index: ' + caretIndex)
        console.log('spans: ', spansArray)
    }, [caretIndex, spansArray])

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