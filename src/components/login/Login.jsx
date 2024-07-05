import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, loginUserGmail, reset } from '../../features/authSlice'
import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google'

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { user, isError, isSuccess, isLoading, message } = useSelector(state => state.auth)

    useEffect(() => {
        if (user || isSuccess) {
            navigate('/dashboard')
        }
        dispatch(reset())
    }, [user, isSuccess, dispatch, navigate])

    const Auth = (e) => {
        console.log("Se ejecuto aqui")
        e.preventDefault();
        validateCorreo();
        validatePassword();
        if (correoError) {
            setCorreoError("El correo electrónico ingresado no es válido.");
        } else if (passwordError || !password) {
            setPasswordError("Contraseña incorrecta. La contraseña de contener una letra mayuscula, un caracter especial y 8 caracteres");
        } else {
            dispatch(loginUser({ email, password }))
        }
    }


    const [correoError, setCorreoError] = useState("");
    const validateCorreo = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            setCorreoError("El correo electrónico ingresado no es válido.");
        } else {
            setCorreoError("");

        }
    };

    const [passwordError, setPasswordError] = useState("");

    const validatePassword = () => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-z])(?=.*\S).{8,20}$/
        if (!password.trim() || !regex.test(password)) {
            setPasswordError("Contraseña incorrecta. La contraseña de contener una letra mayuscula, un caracter especial y 8 caracteres");
        } else {
            setPasswordError("");
        }
    };

    const validateEmail = async () => {
        validateCorreo();
        if (!correoError && email.trim()) {
            const response = await axios.post('http://localhost:3000/v1/validate/user', { email });
            const body = response.data.body;
            const status = body.data.status;
            const evento = body.data.event;
            if (status) {
                navigate(`/change-password/${email}/${evento}`)
            } else {
                setCorreoError("El correo electrónico ingresado no es válido.");
            }
        } else {
            setCorreoError("El correo electrónico ingresado no es válido.");
        }
    };

    const [userG, setUserG] = useState([]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log("Login successful", codeResponse)
            setUserG(codeResponse)

            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=ya29.a0AXooCgvv902PjboW9BqxdWkspClJJ7t-yj1mtMXQgjztdhyA_ix0d0nTddisf88YnYNf-FupYQ7swi5PSkqj0R3FtsDcv_hFoFG_b8jK1ltkEGk8lxPpOuC-JsbixZk3kqPYYEz7Ds2g9Ch6SCuyIXImw7Zx7BXYskIaCgYKAXESARMSFQHGX2Mi45EaKWrjXcmvz3ZH_ssgVQ0170`)
            .then((res) => {
                console.log("res", res)
                const data = res.data
                dispatch(loginUserGmail(data))
            })
            .catch((err) => console.log(err));

        },
        onError: (error) => {
            console.log('Login Failed:', error)
        }
    });

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4">
                            <div className='box'>
                                <form onSubmit={Auth} >
                                    {
                                        isError && <p className="has-text-centered">
                                            {message}
                                        </p>
                                    }
                                    <h1 className='title is-2'>Inicia Sesión</h1>
                                    <div className="field">
                                        <label className="label">Email</label>
                                        <div className="control">
                                            <input
                                                type="email"
                                                className={`input ${correoError ? 'is-danger' : ''}`}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onBlur={validateCorreo}
                                                placeholder="Email" />
                                        </div>
                                        {correoError && <p className="help is-danger">{correoError}</p>}
                                    </div>
                                    <div className="field">
                                        <label className="label">Password</label>
                                        <div className="control">
                                            <input
                                                type="password"
                                                className={`input ${passwordError ? 'is-danger' : ''}`}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                onBlur={validatePassword}
                                                placeholder="Password" />
                                        </div>
                                        {passwordError && <p className="help is-danger">{passwordError}</p>}

                                    </div>
                                    <div className="field is-grouped is-grouped-right">
                                        <p className="control">
                                            <button type="button" className="button is-text" onClick={validateEmail}>
                                                ¿Te olvidaste tu contraseña?
                                            </button>
                                        </p>
                                    </div>
                                    <div className="field mt-5">
                                        <button type='submit' className="button is-success is-fullwidth">
                                            {isLoading ? "Loading..." : "Login"}
                                        </button>
                                    </div>

                                    <div className="field is-grouped is-grouped-centered">
                                        <p className="control">
                                            <Link to="/register">¿No tienes Cuenta? Registrate</Link>
                                        </p>

                                    </div>
                                    <div className="field mt-5">
                                        <p className="control">
                                            <button type='button' className="button is-danger is-fullwidth" style={{ "color": "white" }} onClick={() => login()}>Sign in with Google 🚀 </button>
                                        </p>
                                    </div>


                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
