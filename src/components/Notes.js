import { useContext, useEffect, useRef, useState } from 'react'
import noteContext from "../context/note/noteContext";
import NoteItem from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';


export const Notes = (props) => {
    const context = useContext(noteContext);
    let navigate = useNavigate();
    
    const { notes, getNotes, editNote } = context;
    console.log(notes)
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes();
        }
        else {
            navigate("/login");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notes]);

    const updateNote = (currentnote) => {
        ref.current.click();
        setNote(currentnote);
    }

    const ref = useRef(null);
    const refClose = useRef(null);

    const [note, setNote] = useState(
        { id: "", title: "", description: "", tag: "" }
    )


    const handleClick = (e) => {
        console.log("updating notes")
        // e.preventDefault();      //  ** AS FORM IS SEPARATE FROM BUTTON WE don't NEED IT
        editNote(note._id, note);
        refClose.current.click();
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    return (
        <>
            <AddNote showAlert={props.showAlert} />

            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal" >
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <form>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">New Title</label>
                                    {/* // *** WE ARE PROVIDING VALUES TO EACH SO WE CAN GET THE SAME TEXT COPY PASTED IN THE INPUT FIELD */}
                                    <input type="text" className="form-control" id="title" name='title' value={note.title} onChange={onChange} minLength={5} required />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">New Description</label>
                                    <input type="text" className="form-control" name='description' id="description" value={note.description} onChange={onChange} minLength={5} required />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">New Tag</label>
                                    <input type="text" className="form-control" name='tag' id="tag" value={note.tag} onChange={onChange} minLength={5} required />
                                </div>
                            </div>
                        </form>

                        <div className="modal-footer">
                            <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                            <button type="submit" onClick={() => {
                                handleClick();
                                props.showAlert("Note updated successfully", "info");
                            }} className="btn btn-primary" >Update a New Note</button>
                        </div>



                    </div>
                </div>
            </div >


            <div className='row my-3 '>
                <h3 className='mt-5'>Your Notes</h3>

                <div className="mx-1 container">
                    {/* {notes.length === 0 && 'No Notes To Display.......'} */}
                </div>
                {notes.length === 0 ? 'No Notes To Display.......' : (
                    notes.map((note) => (
                        <NoteItem key={note._id} note={note} showAlert={props.showAlert} updateNote={updateNote} />
                    ))
                )}
            </div>
        </>

    )
}
