import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import Swal from 'sweetalert2';
interface Event {
  id?: string;
  _id?: string;
  title: string;
  date: string;
  time: string;
  notes?: string;
  category?: 'Work' | 'Personal' | 'Other';
  archived?: boolean;
}

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const backUrl = 'http://localhost:5000/events';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${backUrl}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Event[] = await response.json();
        const sortedEvents = data.sort((a, b) => {
          const dateTimeA = new Date(`${a.date}T${a.time}`);
          const dateTimeB = new Date(`${b.date}T${b.time}`);
          return dateTimeA.getTime() - dateTimeB.getTime();
        });
        setEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteEvent = async (id: string) => {
    axios.delete(`${backUrl}/${id}`)
      .then(response => {
        console.log('Event deleted:', response.data);
        setEvents(events.filter(event => (event.id || event._id) !== id));
        Swal.fire({
          title: 'Deleted',
          text: 'Event deleted successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      })
      .catch(error => {
        console.error('Error deleting event:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete event.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  };
  const handleArchiveEvent = async (id: string) => {
    const eventToArchive = events.find(event => (event.id || event._id) === id);
    if (!eventToArchive) return;
    axios.put(`${backUrl}/${id}`, {archived: true})
    .then(response =>{
      console.log('Event archived:', response.data);
      Swal.fire({
        title: 'Archived',
        text: 'Event archived successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      setEvents(events.map(event => 
        (event.id || event._id) === id ? { ...event, archived: true } : event
        
      ));

    
  }).catch(error => {
    console.log(error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to archive event.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  });

  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Mini Event Scheduler</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <div key={event.id || event._id} className={`mb-2  p-5 space-y-1 rounded-md hover:shadow-md shadow-blue-400 hover:ease-in-out border-2 border-blue-300 duration-300 ${event.archived ? 'opacity-50' : ''}`}>
            <h1 className='text-2xl font-semibold text-green-400'>{event.title}</h1>{event.date} at {event.time}
            {event.notes && <p className="text-sm text-gray-400">Notes: {event.notes}</p>}
            {event.category && <p className="text-sm text-gray-400">Category: {event.category}</p>}
            <div className="flex justify-between mt-2">
              <button onClick={() => handleDeleteEvent(event.id || event._id!)} className='bg-red-500 text-white hover:cursor-pointer px-2 py-1 rounded hover:bg-red-600'>Delete</button>
              <button 
                onClick={() => handleArchiveEvent(event.id || event._id!)} 
                disabled={event.archived}
                className={`px-2 py-1 rounded text-white ${event.archived ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 hover:cursor-pointer'}`}
              >
                {event.archived ? 'Archived' : 'Archive'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {events.length === 0 && <p className="text-gray-500">No events scheduled.</p>}
      
    </div>
  )
}

export default App;
