import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    let navigate = useNavigate();


    const [credentials, setCredentials] = useState({ email: " ", password: "" })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        const json = await response.json();
        if (json.success) {
            localStorage.setItem('token', json.authToken);

            // ******* REDIRECTING USING HISTORY HOOK
            props.showAlert("Logged in Successfully Welcome Back", "info")
            navigate("/");
        } else {
            props.showAlert('Invalid Details Try with proper Credentials', 'danger');



        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div>
            {/* // ***** FORMS ONLY GET SUBMITTED */}
            <h2 className='text-center text-danger' > <b>Welcome to the INoteBook </b></h2>
            <h4 className='text-center '><b> Login using Proper Credentials</b></h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">User Id</label>
                    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" value={credentials.email} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" name='password' className="form-control" id="password" value={credentials.password} onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login;