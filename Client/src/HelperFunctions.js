const isOnlyWhitespaces = (str) => {
    return !str.replace(/\s/g, '').length
}

export {isOnlyWhitespaces}