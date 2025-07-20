import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const EventForm = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Event submitted:', { title, date, time, notes });
        // Reset form fields
        setTitle('');
        setDate('');
        setTime('');
        setNotes('');

        const eventData = {
            title,
            date,
            time,
            notes
        };
        axios.post('http://localhost:5000/events', eventData)
            .then(response => {
                console.log('Event created:', response.data);
                Swal.fire({
                    title: 'Success',
                    text: 'Event created successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            })
            .catch(error => {
                console.error('Error creating event:', error);
            });
    };

    return (
        <div className='p-4 mt-12 border-2 border-blue-300 rounded-md shadow-md hover:shadow-blue-400 hover:ease-in-out duration-300'>
            <form onSubmit={handleSubmit}>
                <input className='border border-gray-300 rounded p-2' type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                <input className='border border-gray-300 mx-4 rounded p-2' type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <input className='border border-gray-300 rounded p-2' type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                <br /> <br />
                <textarea className='border border-gray-300 rounded p-2' value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes"></textarea>

                <div className='mt-2'></div><button className='bg-blue-500 hover:cursor-pointer text-white px-4 py-2 rounded mt-2 hover:bg-blue-600' type="submit">Add Event</button>
            </form>
        </div>
    );
};

export default EventForm;