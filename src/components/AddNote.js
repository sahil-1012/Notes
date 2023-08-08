import React, { useContext, useState } from 'react'
import noteContext from "../context/note/noteContext";

const AddNote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ title: "", description: "", tag: "" })


    const handleClick = (e) => {
        e.preventDefault();      // ***** MUST NEEDED ONE. AS PAGE NEEDS RELOADING
        addNote(note);
        props.showAlert("Added Note Successfully", 'info');

        setNote({ title: "", description: "", tag: "" })        // ***** CLEARING THE CONSOLE
    }


    const onChange = (e) => {
        // ! setNote ALWAYS TAKES AN JS OBJECT SO WE NEED TO PASS E.TARGET.NAME OT SPECIFY THAT ITS AN DESCRIPTION,
        // ! AS TARGET.NAME HAS 3 VALUES ITS AN ARRAY SHORTHAND WHICH IS REPLACING TITLE VALUE USING SETSTATE STATE 
        // ! THE ...NOTE IS USED TO INDICATE THAT KEEP OTHER VALUES CONSTANT CHNANGING ONLY THE REQUIRED VALUE

        setNote(
            {
                ...note,
                [e.target.name]: e.target.value
            }
        );

    }
    return (
        <div className='container my-3'>
            <h2 >Add a Note</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name='title' value={note.title} onChange={onChange} minLength={5} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" name='description' id="description" value={note.description} onChange={onChange} minLength={5} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" name='tag' id="tag" onChange={onChange} value={note.tag} minLength={5} required />
                </div>

                <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" onClick={handleClick} className="btn btn-outline-primary">Add a New Note</button>
            </form>
        </div>
    )
}

export default AddNote