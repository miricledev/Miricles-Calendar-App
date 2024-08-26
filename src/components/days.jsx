import React from 'react'
import { useState } from 'react';
import { useMemo } from 'react';

const Days = (props) => {

  const [mappedDayArr, setMappedDayArr] = useState([]);

  const [loading, setLoading] = useState(true);

  console.log(`First day: ${props.firstDay}`)

  useMemo(()=>{
    const thisMonth = new Date().getMonth() -1
    const thisYear = new Date().getFullYear()
    // console.log(thisMonth)
    // console.log(props.currentMonth)
    const dayArr = [];

    for(let i=0; i<props.firstDay; i++)
        dayArr.push(' ');

    for(let i=props.firstDay; i<props.maxDays+props.firstDay; i++)
        dayArr.push(i-props.firstDay+1);

    console.log(dayArr);

    setMappedDayArr(dayArr.map(day => {
        // Highlighting todays date and making sure that it only highlights on todays month
        return (

            <span 
                onClick={day != ' ' ? (() => props.selectDay(day)) : null}
                key={day != ' ' ? `${day}${props.currentMonth}` : Math.floor(Math.random() * 1000000)}
                className={(props.currentDay===day 
                    && props.currentMonth === thisMonth
                    && props.currentDay != ' '
                    && props.currentYear == thisYear) 
                    ? 'current-day' 
                    : (day != ' ' ? 'other-day' : 'blank-filler') }>{day}
                
            </span>
        )
      }))
    setLoading(false);
    // Fill all days numbers of month. Each month changes
  }, [props.currentMonth])

  if(loading)
    return <p>loading...</p>

  return (
    <>{mappedDayArr}</>
  )
}

export default Days;