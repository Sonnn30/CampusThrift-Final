import dayjs from 'dayjs'

export default function Day({day, rowIdx}){
    function getCurrentDayClass(){
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? 'bg-blue-700 text-white rounded-full w-7': "";
    }
    return(
        <>
            <div className="border-2 border-[#BBDCE5] flex flex-col">
                <header className="flex flex-col items-center">
                    {rowIdx === 0 && (
                        <p className="text-sm mt-1">{day.format('ddd').toUpperCase()}</p>
                    )}
                    <p className={`text-sm p-1 my-1 text-center ${getCurrentDayClass()}`}>
                        {day.format('DD')}
                    </p>
                </header>
            </div>

        </>
    )
}
