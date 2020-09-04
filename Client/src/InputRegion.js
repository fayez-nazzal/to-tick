import React, {useState, useRef, useEffect} from 'react'
import './inputRegion.css'
import TextSpan from './TextSpan'

let persistCaret = false
let persistTimeout
let caretInterval

function InputRegion(props) {
    const caretRef = useRef(null)
    const caret = <span className="caret caret-write" ref={caretRef}> </span>
    const [caretIndex, setCaretIndex] = useState(0)
    const [caretPos, setCaretPos] = useState(0)
    const [isCaretVisible, setIsCaretVisible] = useState(false)
    
    const [spansArray, setSpansArray] = useState([caret])
    const [textArray, setInputTextArray] = useState([])
    const inputRegionRef = useRef(null)
    const [lastInputValueLen, setLastInputValueLen] = useState(0)
    const [key, setKey] = useState(0)
    
    useEffect(()=>{
        // TODO clean this interval in unmount
        caretInterval = setInterval(()=>{
            if (!persistCaret)
                setIsCaretVisible(prev => !prev)
        }, 600)

        setTimeout(()=>{
            if (caretRef.current)
                caretRef.current.className = "caret"
        }, 300)
    }, [])

    useEffect(()=>{
        caretRef.current.style.opacity = isCaretVisible? 1:0
    }, [isCaretVisible])

    useEffect(()=>{
        console.log(textArray)
        console.log(spansArray)
    }, [textArray])

    const persistCaretTemporarily = (time) => {
        setIsCaretVisible(true)
        persistCaret = true
        clearTimeout(persistTimeout)

        persistTimeout = setTimeout(()=>{
            persistCaret = false
        }, time)
    }

    const writeChar = (key) => {
        setCaretPos(prev => prev+1)
        if ( textArray.length === 0 ) {
            const modifiedTextArray = modifyStateArrays(appendSpan, "normal-text", key)
            setCaretIndex(prev => prev+1)
            return modifiedTextArray
        } else if (textArray[caretIndex-1].slice(-2)+key === 'map') {
            modifyStateArrays(modifyAndAppendSpan, "normal-text",
                                "map-text", textArray[caretIndex-1].slice(0, -2),
                                "map", caretIndex-1)
            setCaretIndex(prev => prev+1)
        } else {
            const textBeforeCaret = textArray[caretIndex-1]
            const newText = textBeforeCaret + key
            return modifyStateArrays(modifySpan, "normal-text", newText, caretIndex-1)
        }
    }
    
    const deleteChar = () => {
        if (textArray.length === 0)
            return
        
        setCaretPos(prev => prev-1)

        let textBeforeCaret = textArray[caretIndex - 1]
        if (!textBeforeCaret || textBeforeCaret.length === 1) {
            const modifiedTextArray = modifyStateArrays(deleteSpan, caretIndex-1)
            setCaretIndex(prev => prev-1)
            return modifiedTextArray
        } else {
            return modifyStateArrays(modifySpan, "normal-text",
                             textArray[caretIndex-1].slice(0, -1), caretIndex-1)
        }

    }
    
    // same as String.charAt but supports negative index
    const characterAt = (str, pos) => {
        return Array.from(str).splice(pos, 1)[0]
    }

    // returns string between 0 and pos
    const hypirdSlice = (str, pos) => {
        return pos>=0? str.slice(pos+1) : str.slice(0, pos)
    }

    useEffect(()=>{
        setKey(prev => prev++)
    }, [spansArray])

    const createTextSpan = (value, className='normal-text') => {
        return <TextSpan 
            key={key} 
            className={className} 
            value={value} />
    }

    const moveCaret = (target) => {
        let diff = caretPos - target
        const dir = diff>0? "left" : "right"
        diff = Math.abs(diff)

        if (!dir in ['left', 'right'] ||
            (dir==='right' && caretIndex === spansArray.length-1) ||
            (dir==='left' && caretIndex === 0)) return;
        
        const spansClone = [...spansArray]
        const textClone = [...textArray]
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
            spansClone[spansRemoveIndex] =  createTextSpan(textClone[textRemoveIndex])
            
            switch(true) {
                case (dir==="right" && i===0):
                    spansClone.splice(0, 0, createTextSpan(char))
                    textClone.splice(0, 0, char)
                    i = 1
                break;
                
                case (dir==="left" && i===spansClone.length-1):
                    spansClone.splice(i+1, 0,  createTextSpan(char))
                    textClone.push(char)
                break;

                case (dir==="left"):
                    textClone[i] = char + textClone[i]
                    spansClone[i+1] =   createTextSpan(textClone[i])
                     if (textClone[0]==="") {
                        textClone.splice(0, 1)
                        spansClone.splice(0, 1)
                        i=0
                     }
                    
                break;

                case (dir==="right"):
                    textClone[i-1] = textClone[i-1] + char
                    spansClone[i-1] =  createTextSpan(textClone[i-1])
                    if (textClone[textClone.length-1]==="") {
                        textClone.splice(-1, 1)
                        spansClone.splice(-1, 1)
                    }
            }

            p = dir==="left"? p-1 : p+1

            diff--
        }

        setCaretIndex(i)
        setCaretPos(p)
        setSpansArray(spansClone)
        setInputTextArray(textClone)
    }

    const modifyStateArrays = (callback1, ...args) => {
        const spansArrayReference = [...spansArray]
        const textArrayReference = [...textArray]

        callback1(spansArrayReference, textArrayReference, ...args)

        setSpansArray(spansArrayReference)
        setInputTextArray(textArrayReference)
            
        return textArrayReference
    }

    const appendSpan = (spansReference, textReference, className, text) => {
        spansReference.splice(-1, 0, createTextSpan(text, className))

        textReference.push(text)
    }
 
    const modifySpan = (spansReference, textReference, className, text, index) => {
        spansReference.splice(index, 1, createTextSpan(text, className))

        const inputArrayIndex = index>=0? index: textReference.length + index + 1
        textReference[inputArrayIndex] = text
    }

    const modifyAndAppendSpan = (spansReference, textReference,
                                 cls1, cls2, txt1, txt2, index) => {
        modifySpan(spansReference, textReference, cls1, txt1, index)
        appendSpan(spansReference, textReference, cls2, txt2)
    }

    const deleteSpan = (spansReference, textReference, index) => {
        spansReference.splice(index, 1)
        const inputArrayIndex = index>=0? index: textReference.length + index + 1
        textReference.splice(inputArrayIndex, 1)
    }

    const handleInput = (e) => {
        const { value, selectionStart } = e.target

        const char = value.charAt(selectionStart-1)

        persistCaretTemporarily(200)

        if (value.length > lastInputValueLen) {
            caretRef.current.className = "caret caret-write"
            writeChar(char)
            
            setTimeout(()=>{
                if (caretRef.current)
                    caretRef.current.className = "caret"
            }, 100)
        }
        else if (value.length < lastInputValueLen) {
            deleteChar()
        } else {
            const newText = textArray[caretIndex-1].slice(0, -1) + char
            modifyStateArrays(modifySpan, "text", newText, caretIndex-1)
        }

        setLastInputValueLen(value.length)
    } 


    const handleSelectionChange = (e) => {
        const { selectionStart, selectionEnd} = e.target

        if (caretPos === selectionStart === selectionEnd)
            return

        if (selectionStart != selectionEnd)
            console.log(`highlight ${selectionStart} to ${selectionEnd}`)
        persistCaretTemporarily(150)
        
        moveCaret(selectionStart)
    }

    return (
        <div className="input-region"
            ref={inputRegionRef}
            >
            {spansArray}
            <textarea className="input-hidden-region" 
                    autoFocus={true}
                    onChange={e => handleInput(e)}
                    onSelect={e => handleSelectionChange(e)}
                    />
        </div>
    )
}

export default InputRegion