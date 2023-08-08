import { useContext } from "react";
import noteContext from '../context/note/noteContext'
const NoteItem = (props) => {
    const { note, updateNote } = props;

    const context = useContext(noteContext)
    const { deleteNote } = context;

    return (
        <>
            <div className="col-md-3 mx-3 my-2">
                <div className="card"
                    style={{ width: "20rem" }}>
                    <div className="card-body">
                        <div className="d-flex align-item-center    ">
                            <h5 className="card-title"> {note.title}</h5>

                            <i style={{ cursor: "pointer" }} className="fa-solid fa-trash mx-2" onClick={() => {
                                deleteNote(note._id);
                                props.showAlert("Deleted Note Successfully", 'info');
                            }}></i>

                            <i style={{ cursor: "pointer" }} className="fa-regular fa-pen-to-square mx-2" onClick={() => {
                                updateNote(note);
                            }}></i>
                        </div>
                        <h6 className="card-title"> {note.tag}</h6>
                        <p className="card-text">{note.description}</p>
                    </div>
                </div>
            </div >

        </>
    )
}

export default NoteItem;
