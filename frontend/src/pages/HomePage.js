import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

function HomePage() {
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        getNotes();
    }, []);

    let getNotes = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/notes/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
        });
        let data = await response.json();

        if (response.ok) {
            setNotes(data);
        } else if (response.statusText === 'Unautorized') {
            logoutUser();
        }
    };

    return (
        <div>
            <p>You are logged to the home page!</p>

            <ul>
                {notes.map((note) => (
                    <li key={note.id}>{note.body}</li>
                ))}
            </ul>
        </div>
    );
}

export default HomePage;
