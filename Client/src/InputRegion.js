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
            moveCaretOnes('right')
        },
        ArrowLeft: () => {
            moveCaretOnes('left')
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
    
    const characterAt = (str, pos) => {
        return pos>=0? str.charAt(pos) : Array.from(str).splice(pos, 1)[0]
    }

    const hypirdSlice = (str, pos) => {
        return pos>=0? str.slice(pos+1) : str.slice(0, pos)
    }

    const moveCaretOnes = (dir) => {
        if (!dir in ['left', 'right'] ||
            (dir==='right' && caretIndex === spansArray.length-1) ||
            (dir==='left' && caretIndex === 0)) return;
        
        const spansClone = [...spansArray]
        const textClone = [...inputTextArray]

        const [textRemoveIndex, 
                spansRemoveIndex, 
                charPos] = dir==="left"? 
                                [caretIndex-1, caretIndex-1, -1] : 
                                [caretIndex, caretIndex+1, 0]

        const char = characterAt(textClone[textRemoveIndex], charPos)
        textClone[textRemoveIndex] = hypirdSlice(textClone[textRemoveIndex], charPos)
        spansClone[spansRemoveIndex] = <span className="text">{textClone[textRemoveIndex]}</span>
        
        switch(true) {
            case (dir==="right" && caretIndex===0):
                spansClone.splice(0, 0, <span className="text">{char}</span>)
                textClone.splice(0, 0, char)
                setCaretIndex(1)
            break;
            
            case (dir==="left" && caretIndex===spansClone.length-1):
                spansClone.splice(caretIndex+1, 0, <span className="text">{char}</span>)
                textClone.push(char)
            break;

            case (dir==="left"):
                textClone[caretIndex] = char + textClone[caretIndex]
                spansClone[caretIndex+1] = <span className="text">{textClone[caretIndex]}</span>
                if (textClone[0]==="") {
                    textClone.splice(0, 1)
                    spansClone.splice(0, 1)
                    setCaretIndex(0)
                }
            break;

            case (dir==="right"):
                textClone[caretIndex-1] = textClone[caretIndex-1] + char
                spansClone[caretIndex-1] = <span className="text">{textClone[caretIndex-1]}</span>
                if (textClone[textClone.length-1]==="") {
                    console.log('true')
                    textClone.splice(-1, 1)
                    spansClone.splice(-1, 1)
                }
            
        }

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
        console.log('inputTextArray: ', inputTextArray)
        console.log('spans: ', spansArray)
    }, [caretIndex, inputTextArray, spansArray])

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