import React from 'react'
import { useState, useRef, useEffect } from 'react'
import Days from './days';
import Event from './event';



const CalendarApp = () => {

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = ["January", "Feburary", "March", 
    "April", "May", "June", "July", "August", "September", 
    "October", "November", "December"];

  const currentDate = new Date()
  const currentDay = currentDate.getDate();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  console.log(currentMonth)
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  // Creates a date object that returns the number of days in the given month
  const daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();

  // Gets the number of the first day of the month e.g. tuesday=2
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Mapping over days of week
  const mappedDays = daysOfWeek.map(day => <span key={day}>{day}</span>);

  // state to switch between hiding and showing a popup
  const [popupClass, setPopupClass] = useState("hide-event-popup");

  // Text on button whether to add or modify event
  const [btnText, setBtnText] = useState('Add Event');

  // Array storing all of the listed events, get rid of lazy state with arrow function
  const [listEvents, setListEvents] = useState(() => JSON.parse(localStorage.getItem("events")) || []);

  // Track event being modified
  const [modEvent, setModEvent] = useState({})

  

  // everytime list events is updated, update local storage
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(listEvents))
  }, [listEvents])

  // Stores the day on the calendar that has been clicked
  const [selectedDay, setSelectedDay] = useState(0);

  // 3 input reference variables
  const hour = useRef();
  const minute = useRef();
  const description = useRef();

  // hides the event popup
  const hideEventPopup = () =>{
    setMissingDetails(false)
    setPopupClass("hide-event-popup");
  }

  // displays the event popup
  const showEventPopup = () =>{
    setPopupClass("event-popup");
  }

  // runs when a day on the calendar is selected to select that day
  const selectDay = (day) => {
    hour.current.value = null;
    minute.current.value = null;
    description.current.value = null;
    console.log(`target: ${day}`);
    setSelectedDay(day);
    setBtnText('Add Event');
    showEventPopup();
  }

  // used to determine if to display an error message due to missing details or not
  const [missingDetails, setMissingDetails] = useState(false);
  // Need day, month, year, hour, minute, description
  const createNewEvent = () => {
    setMissingDetails(false)
    const eventDay = selectedDay;
    const eventMonth = monthsOfYear[currentMonth];
    const eventYear = currentYear;
    const eventHour = hour.current.value;
    const eventMinute = minute.current.value;
    const eventDescription = description.current.value;

    console.log(`Selected day: ${selectedDay}`);

    const newEvent ={
        eventDay,
        eventMonth,
        eventYear,
        eventHour,
        eventMinute,
        eventDescription
    }

    if(!eventHour){
        setMissingDetails(true)
        return "missing hh"
    }
    if(!eventMinute){
        setMissingDetails(true)
        return "missing mm"
    }
    if(!eventDescription){
        setMissingDetails(true)
        return "missing dec"
    }


    setListEvents(prevListEvents => [...prevListEvents, newEvent]);
    hideEventPopup();
  }

  // runs when the left or right arrow is being click to inc or dec the month
  const changeMonth = (direction) => {
    // prevents the month from being changed while popup is showing
    if(popupClass.toLocaleLowerCase() === 'event-popup'){
        return '';
    }
    console.log(direction)
    setCurrentMonth(prevMonth => direction.toLowerCase()==="left" ? prevMonth - 1 : prevMonth + 1);
    if(currentMonth ==0 && direction=="left"){
        setCurrentYear(prevYear => prevYear-1);
        setCurrentMonth(11);
    } else if(currentMonth ==11 && direction=="right"){
        setCurrentYear(prevYear => prevYear + 1);
        setCurrentMonth(0);
    }
  }

  // ensuring upper/lower bounds for the hour input
  const handleInputChangeHour = () =>{

    if(hour.current.value < 0){
        hour.current.value=0;
    } else if(hour.current.value > 23){
        hour.current.value=23;
    }
  }

  // ensuring upper/lower bounds for the minute input
  const handleInputChangeMinute = () =>{

    if(minute.current.value < 0){
        minute.current.value = 0;
    } else if(minute.current.value > 59){
        minute.current.value = 59;
    }
  }

  // ensuring hour input is in a 2 digit format
  const hourFormat = () => {
    if(hour.current.value == ''){
        return '';
    }
    else if(hour.current.value < 9){
        hour.current.value = `0${hour.current.value}`;
    }
  }

  // ensuring minute input is in a 2 digit format
  const minFormat = () => {
    if(minute.current.value == ''){
        return '';
    }
    else if(minute.current.value < 9){
        minute.current.value = `0${minute.current.value}`;
    }
  }

  // removes the given event from the list of events
  const removeEvent = (event) =>{
    setListEvents(prevListEvents => prevListEvents.filter(e => e!=event));
  }

  // modifies the given event 
  const modifyEvent = (event) => {
    setBtnText('Modify Event');
    showEventPopup();
    hour.current.value = event.eventHour;
    minute.current.value = event.eventMinute;
    description.current.value = event.eventDescription;
    setModEvent(event);
  }

  // saves modifications and updates the list of events with new updated event
  const saveModifications = () => {
    console.log(hour.current.value); // Check if this logs the expected value
    console.log(minute.current.value); // Check if this logs the expected value
    console.log(description.current.value); // Check if this logs the expected value
    if(!hour.current.value){
        setMissingDetails(true)
        return "missing hh"
    }
    if(!minute.current.value){
        setMissingDetails(true)
        return "missing mm"
    }
    if(!description.current.value){
        setMissingDetails(true)
        return "missing dec"
    }
    setModEvent(prevModEvent => {
        const updatedEvent={

            ...prevModEvent, 
            eventHour: hour.current.value,
            eventMinute: minute.current.value,
            eventDescription: description.current.value
        }
        setListEvents(prevListEvents => 
            prevListEvents.map(event => 
                event === prevModEvent ? updatedEvent : event
            )
        );
        return updatedEvent;
    })

    
    hideEventPopup();
    console.log(modEvent);
  }


  return (
    <div className='calendar-app'>
        <div className='calendar'>
            <h1 className='heading'>Miricle Calendar</h1>
            <div className="navigate-date">
                <h2 className="month">{monthsOfYear[currentMonth]},</h2>
                <h2 className="year">{currentYear}</h2>
                <div className="buttons">
                    <i className="bx bx-chevron-left" onClick={() => changeMonth("left")}></i>
                    <i className="bx bx-chevron-right" onClick={() => changeMonth("right")}></i>
                </div>
            </div>
            <div className="weekdays">
                {mappedDays}
            </div>
            <div className="days">
                <Days
                    selectDay={selectDay}
                    firstDay={firstDayOfMonth}
                    maxDays={daysInMonth}
                    currentDay={currentDay}
                    currentMonth={currentMonth-1}
                    currentYear={currentYear}
                 />
            </div>
        </div>
        <div className="events">
            <div className={popupClass}>
                <div className="time-input">
                    <div className="event-popup-time">Time</div>
                    <input onBlur={hourFormat} onChange={handleInputChangeHour}
                     type="number" name='hours' min={0} max={24} ref={hour} 
                     className={missingDetails ? `hours error` : 'hours'}
                     placeholder='HH' />
                    <input onBlur={minFormat} onChange={handleInputChangeMinute}
                     type="number" name='minutes' min={0} max={60} ref={minute} 
                     className={missingDetails ? `minutes error` : 'minutes'}
                     placeholder='MM' />
                </div>
                <textarea
                placeholder="Enter Event Text (Maximum 60 Characters)" 
                ref={description}
                className={missingDetails ? 'error' : 'null'} ></textarea>
                {missingDetails && <p style={{"color": "red", "fontSize": "1.5rem"}}>Missing details...</p>}
                <button className="event-popup-btn" 
                    onClick={btnText === "Add Event" ? createNewEvent : saveModifications}
                >{btnText}</button>
                <button className="close-event-popup" onClick={hideEventPopup}><i className="bx bx-x"></i></button>
            </div>
            <Event allEvents={listEvents} modifyEvent={modifyEvent} removeEvent={removeEvent} />
        </div>
    </div>
  )
}

export default CalendarApp;