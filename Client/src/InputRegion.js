import React, {useState, useRef, useEffect} from 'react'
import './inputRegion.css'
import { text } from 'body-parser'

let persistCaret = false
let persistTimeout

function InputRegion(props) {
    const caretRef = useRef(null)
    const [isCaretVisible, setIsCaretVisible] = useState(false)
    const caret = <span className="caret caret-write" ref={caretRef}> </span>
    const [spansArray, setSpansArray] = useState([caret])
    const [inputTextArray, setInputTextArray] = useState([])
    const inputRegionRef = useRef(null)
    const [isLastSpanRich, setIsLastSpanRich] = useState(false)
    const [caretIndex, setCaretIndex] = useState(0)
    const [caretPos, setCaretPos] = useState(0)
    const [inputValueLen, setInputValueLen] = useState(0)

    const writeChar = (key) => {
        setIsLastSpanRich(false)        
        if (isLastSpanRich || 
            inputTextArray.length === 0) {
            modifyStateArrays(appendSpan, "text", key)
            setCaretIndex(prev => prev+1)
        } else {
            const textBeforeCaret = inputTextArray[caretIndex-1]
            const newText = textBeforeCaret + key
            modifyStateArrays(modifySpan, "text", newText, caretIndex-1)
        }
        setCaretPos(prev => prev+1)
    }
    
    const deleteChar = () => {
        if (inputTextArray.length === 0)
        return
        let lastText = inputTextArray[caretIndex - 1]
        if (!lastText || lastText.length === 1) {
            modifyStateArrays(deleteSpan, caretIndex-1)
            setCaretIndex(prev => prev-1)
        } else {
            modifyStateArrays(modifySpan, "text",
                             inputTextArray[caretIndex-1].slice(0, -1), caretIndex-1)
        }
        setCaretPos(prev => prev-1)
    }
    
    const characterAt = (str, pos) => {
        return pos>=0? str.charAt(pos) : Array.from(str).splice(pos, 1)[0]
    }

    const hypirdSlice = (str, pos) => {
        return pos>=0? str.slice(pos+1) : str.slice(0, pos)
    }

    const moveCaret = (target) => {

        let diff = caretPos - target
        const dir = diff>0? "left" : "right"
        diff = Math.abs(diff)

        if (!dir in ['left', 'right'] ||
            (dir==='right' && caretIndex === spansArray.length-1) ||
            (dir==='left' && caretIndex === 0)) return;
        
        const spansClone = [...spansArray]
        const textClone = [...inputTextArray]
        let i = caretIndex
        let p = caretPos
        
        while (diff>0) {
            const [textRemoveIndex, 
                    spansRemoveIndex, 
                    charPos] = dir==="left"? 
                                    [i-1, i-1, -1] : 
                                    [i, i+1, 0]
            
            const char = characterAt(textClone[textRemoveIndex], charPos)
            textClone[textRemoveIndex] = hypirdSlice(textClone[textRemoveIndex], charPos)
            spansClone[spansRemoveIndex] =  <span className="text">
                                                {textClone[textRemoveIndex]}
                                            </span>
            
            switch(true) {
                case (dir==="right" && i===0):
                    spansClone.splice(0, 0, <span className="text">{char}</span>)
                    textClone.splice(0, 0, char)
                    i = 1
                break;
                
                case (dir==="left" && i===spansClone.length-1):
                    spansClone.splice(i+1, 0,  <span className="text">
                                                            {char}
                                                        </span>)
                    textClone.push(char)
                break;

                case (dir==="left"):
                    textClone[i] = char + textClone[i]
                    spansClone[i+1] =   <span className="text">
                                                    {textClone[i]}
                                        </span>
                    if (deleteEmpty(textClone, spansClone, 0, 0)) {
                        i = 0
                    }
                    
                break;

                case (dir==="right"):
                    textClone[i-1] = textClone[i-1] + char
                    spansClone[i-1] =  <span className="text">
                                                    {textClone[i-1]}
                                                </span>
                    deleteEmpty(textClone, spansClone, -1, -1)
            }

            p = dir==="left"? p-1 : p+1

            diff--
        }

        setCaretIndex(i)
        setCaretPos(p)
        setSpansArray(spansClone)
        setInputTextArray(textClone)
    }


    const deleteEmpty = (textClone, spansClone, index1, index2) => {
        if (textClone[index1>=0? index1 : textClone.length + index1]==="") {
            textClone.splice(index1, 1)
            spansClone.splice(index2, 1)
            return true
        }
        return false
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

    const deleteSpan = (spansReference, inputTextReference, index) => {
        spansReference.splice(index, 1)
        const inputArrayIndex = index>=0? index: inputTextReference.length + index + 1
        inputTextReference.splice(inputArrayIndex, 1)
    }

    const handleAccentChar = (e) => {
        const { value, selectionStart } = e.target

        const char = value.charAt(selectionStart-1)
        
        persistCaretTemporarily(200)

        if (value.length > inputValueLen) {
            caretRef.current.className = "caret caret-write"
            writeChar(char)
            setTimeout(()=>{
                caretRef.current.className = "caret"
            }, 100)
        }
        else if (value.length < inputValueLen) {
            deleteChar()
        } else {
            const newText = inputTextArray[caretIndex-1].slice(0, -1) + char
            modifyStateArrays(modifySpan, "text", newText, caretIndex-1)
        }

        setInputValueLen(value.length)
    } 

    useEffect(()=>{
        makeCaretBlinkInterval(600)
    }, [])

    useEffect(()=>{
        caretRef.current.style.opacity = isCaretVisible? 1:0
    }, [isCaretVisible])

    const makeCaretBlinkInterval = (time) => {
        setInterval(()=>{
            if (!persistCaret)
                setIsCaretVisible(prev => !prev)
    }, time)
    }

    const handleSelectionChange = (e) => {
        const {selectionStart} = e.target

        if (caretPos === selectionStart)
            return

        persistCaretTemporarily(150)
        
        moveCaret(selectionStart)
    }

    const persistCaretTemporarily = (time) => {
        setIsCaretVisible(true)
        persistCaret = true
        clearTimeout(persistTimeout)

        persistTimeout = setTimeout(()=>{
            persistCaret = false
        }, time)
    }

    return (
        <div className="input-region"
            ref={inputRegionRef}
            tabIndex="0"
            >
            {spansArray}
            <textarea className="input-hidden-region" 
                    autoFocus={true}
                    onChange={e => handleAccentChar(e)}
                    onSelect={e => handleSelectionChange(e)}
                    />
        </div>
    )
}

export default InputRegion