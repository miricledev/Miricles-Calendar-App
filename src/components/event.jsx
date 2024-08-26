import React from 'react'

const Event = (props) => {

  const mappedEvents = props.allEvents.map(givenEvent => {
    return(
        <div key={givenEvent} className="event">
            <div className="events-date-wrapper">
                <div className="event-date">{givenEvent.eventMonth} {givenEvent.eventDay}, {givenEvent.eventYear}</div>
                <div className="event-time">{givenEvent.eventHour}:{givenEvent.eventMinute}</div>
            </div>
            <div className="event-text">{givenEvent.eventDescription}</div>
            <div className="event-buttons">
                <i onClick={() => props.modifyEvent(givenEvent)} className="bx bxs-edit-alt"></i>
                <i onClick={() => props.removeEvent(givenEvent)} className="bx bxs-message-alt-x"></i>
            </div>
        </div>
    )
  })

  return (
    <>
    
    {props.allEvents.length===0 &&(
        <>
            <h2 className='empty-notification'>Calendar is empty</h2>
            <p className='empty-notification-p'>Click a date to get started</p>
        </>
    )}
    {mappedEvents}
    </>
  )
}

export default Event;