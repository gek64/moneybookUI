function StartOfDay(date: Date): Date {
    date.setHours(0, 0, 0, 0)
    return date
}

function StartOfMonth(date: Date) {
    date.setDate(1)
    return StartOfDay(date)
}

function StartOfYear(date: Date) {
    date.setUTCMonth(0, 1)
    return StartOfDay(date)
}

function EndOfDay(date: Date): Date {
    date.setHours(23, 59, 59, 999)
    return date
}

function EndOfMonth(date: Date) {
    return EndOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0))
}

function EndOfYear(date: Date) {
    date.setMonth(11, 31)
    return EndOfDay(date)
}

export {
    StartOfDay,
    StartOfMonth,
    StartOfYear,
    EndOfDay,
    EndOfMonth,
    EndOfYear
}