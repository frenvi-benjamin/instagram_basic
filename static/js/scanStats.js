const SECOND    = 1000
const MINUTE    = SECOND * 60
const HOUR      = MINUTE * 60
const DAY       = HOUR   * 24
const WEEK      = DAY    *  7

const SUNDAY    = 0
const MONDAY    = 1
const TUESDAY   = 2
const WEDNESDAY = 3
const THURSDAY  = 4
const FRIDAY    = 5
const SATURDAY  = 6

const DAY_NAMES = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
]

function showDayPopularity(arr) {

    days = [0,0,0,0,0,0,0]
    arr.forEach(date => {
        date = new Date(date)
        days[date.getDay()] += 1
    })
    return days
}

function stripToDay(date) {
    date = new Date(date)
    date.setMilliseconds(0)
    date.setSeconds(0)
    date.setMinutes(0)
    date.setHours(0)
    return date
}

function cutIntoDays(arr) {
    var days = {}
    arr.forEach(date => {
        date = stripToDay(date)

        if(!days[date.getTime()]) {
            days[date.getTime()] = 1
        }
        else {
            days[date.getTime()] += 1
        }
    })
    return fillEmpties(days, DAY)
}

function cutIntoWeeks(arr) {
    var weeks = {}
    arr.forEach(date => {
        // set every day in a week to the same time
        date = new Date(date)
        const day = date.getDay()
        date = new Date(date.getTime() - day * DAY)
        date.setMilliseconds(0)
        date.setSeconds(0)
        date.setMinutes(0)
        date.setHours(0)

        if(!weeks[date.getTime()]) {
            weeks[date.getTime()] = 1
        }
        else {
            weeks[date.getTime()] += 1
        }
    })
    return fillEmpties(weeks, WEEK)
}

function cutIntoMonths(arr) {
    var months = {}
    arr.forEach(date => {
        // set every day in a month to the same time
        date = new Date(date)
        const monthDate = date.getDate()
        date = new Date(date.getTime() - (monthDate - 1) * DAY)
        date.setMilliseconds(0)
        date.setSeconds(0)
        date.setMinutes(0)
        date.setHours(0)
        if(!months[date.getTime()]) {
            months[date.getTime()] = 1
        }
        else {
            months[date.getTime()] += 1
        }
    })
    return months
}

function fillEmpties(object, step) {
    const keys = Object.keys(object)
    keys.sort((a, b) => {
        if (parseInt(a) < parseInt(b)) return -1
        if (parseInt(a) > parseInt(b)) return 1
        return 0
    })

    for (var i = parseInt(keys[0]); i < parseInt(keys[keys.length - 1]) + step; i += step) {
        object[i] |= 0
    }

    return object
}

function fromTo(object, from, to, step) {
    var stripFunction
    switch (step) {
        case DAY:
            stripFunction = stripToDay
            break;
        
        case WEEK:
            stripFunction = stripToWeek
            break;
    }

    const keys = Object.keys(object)

    const newObject = {}

    for (var i = stripFunction(from).getTime(); i < stripFunction(to).getTime() + step; i += step) {
        if (object[i]) {
            newObject[i] = object[i]
        }
        else {
            newObject[i] = 0
        }
    }

    return newObject

}

function daysInMonth(m, y){
    return m===2?y&3||!(y%25)&&y&15?28:29:30+(m+(m>>3)&1);
}


fetch("/me")
    .then(response => response.json())
    .then(user => {
        var dayPopCtx = document.getElementById('dayPop').getContext('2d')
        var days = showDayPopularity(user.scans)
        var dayPop = new Chart(dayPopCtx, {
            data: {
                labels: DAY_NAMES,
                datasets: [
                {
                    type: "bar",
                    label: 'Scans',
                    data: days,
                }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        })


        var daysCtx = document.getElementById('days').getContext('2d')

        const datePicker = document.getElementById("starting-day")

        // set initial value of datePicker
        const aWeekAgo = new Date( new Date().getTime() - (WEEK - DAY) ).toISOString().slice(0, 10)
        datePicker.value = aWeekAgo
        datePicker.max = aWeekAgo
        updateChart()


        // listen to user input and update the graph
        datePicker.addEventListener("change", () => {
            updateChart()
        })

        var daysChart

        function updateChart() {

            var days = fromTo(cutIntoDays(user.scans), new Date(datePicker.value).getTime(), new Date(datePicker.value).getTime() + (WEEK - DAY), DAY)
            
            keys = Object.keys(days).sort()
            var values = []
            var labels = []
            keys.forEach(key => {
                values.push(days[key])
                labels.push(new Date(parseInt(key)).toLocaleDateString("de-DE", { weekday: "short", year: "2-digit", month: "numeric", day: "numeric"}))
            })


            if (daysChart) {
                daysChart.destroy()
            }

            daysChart = new Chart(daysCtx, {
                data: {
                    labels: labels,
                    datasets: [
                    {
                        type: "bar",
                        label: 'Scans',
                        data: values,
                    }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                    legend: {
                        display: false
                    }
                }
                }
            })
        }
        
})