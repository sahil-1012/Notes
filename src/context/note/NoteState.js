import { useState } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {
    const host = "http://localhost:5000";
    const [notes, setNotes] = useState([])

    // ***** FUNCTION : GET ALL NOTES
    const getNotes = async () => {
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'),
            },
        });


        
        const json = await response.json();
        setNotes(json);
    };


    // ***** FUNCTION : ADD A NOTE
    const addNote = async (note) => {
        const response = await fetch(`${host}/api/notes/addnotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify(note)
        });
        const newNote = await response.json();
        setNotes(notes.concat(newNote))
        // setNote([...notes, newNote]);
    }


    // ***** FUNCTION : UPDATE A NOTE
    const editNote = async (id, note) => {
        const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify(note)
        });
        const json = await response.json();

        let noteString = JSON.parse(JSON.stringify(notes));
        for (let index = 0; index < noteString.length; index++) {
            const element = noteString[index];

            if (element._id === id) {
                noteString[index].title = note.title;
                noteString[index].description = note.description;
                noteString[index].tag = note.tag;
                break;
            }
        }
        setNotes(noteString)
    }

    // ***** FUNCTION : REMOVE A NOTE 
    const deleteNote = async (id) => {
        const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'),
            },
        });
        const json = response.json();
        console.log("Deleting the Note")

        const newNotes = notes.filter((note) => {
            return (note._id !== id)
        });
        setNotes(newNotes);

        // console.log("Deleting the note with the id : " + id)
    }

    return (
        <noteContext.Provider value={{ notes, addNote, editNote, deleteNote, getNotes }} >
            {props.children}
        </noteContext.Provider>
    )
}
export default NoteState;