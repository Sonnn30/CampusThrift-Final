import dayjs from 'dayjs'


export function ArrayOfDays(month= dayjs().month()){
    const year = dayjs().year()
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day()
    let currMonth = 0 - firstDayOfTheMonth
    const dayMatrix = new Array(5).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            currMonth++
            return dayjs(new Date(year, month, currMonth))
        })
    })
    return dayMatrix
}
