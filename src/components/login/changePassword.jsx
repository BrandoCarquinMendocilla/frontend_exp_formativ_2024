import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

export const ChangePassword = () => {
    const navigate = useNavigate();


    const [prestatario, setPrestatario] = useState([]);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isOtpSend, setIsOtpSend] = useState(false);


    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2); // Número de elementos por página

    const [loading, setLoading] = useState(true);

    const [getCorreoChangePassword, setCorreoChangePassword] = useState('')
    const { correo, evento } = useParams();


    const sendOtpEmail = async (event, email) => {
        try {
            await axios.post(`http://localhost:3000/v1/send/mail/otp`, { event, email });
            setIsOtpSend(true)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        const sendEmail = async () => {
            try {
                await sendOtpEmail(evento, correo);
            } catch (error) {
                console.log('Error sending OTP email:', error);
                // Manejar el error adecuadamente
            }
        };

        sendEmail();
    }, [correo, isOtpSend])

    const [errorOtp, setErrorOtp] = useState("");
    const validOtpEmail = async (event, email, otp) => {
        try {
            await axios.post(`http://localhost:3000/v1/valid/otp`, { event, email, otp });
            return true;
        } catch (error) {
            setErrorOtp('Estimado Usuario, su clave de OTP incorrecta. Intentelo otra vez.')
            return false;
        }
    }


    const validateOtpCode = async () => {
        console.log('correo', correo)
        const valdiate = await validOtpEmail(evento, correo, otpCode);
        if (valdiate) {
            setShowOtpForm(false);
            setShowPasswordForm(true);

        }

    };

    const [passwordError, setPasswordError] = useState("");
    const validatePassword = () => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-z])(?=.*\S).{8,20}$/

        console.log("Password validation:", !newPassword)
        if (!newPassword || !confirmPassword || !regex.test(newPassword)) {
            console.log("Entro")
            setPasswordError("Contraseña incorrecta. La contraseña de contener una letra mayuscula, un caracter especial y 8 caracteres");
        }

        else if (newPassword !== confirmPassword) {
            setPasswordError("Las contraseñas no coinciden.");
        } else {
            setPasswordError("");
        }
    };

    // Servicio para cambiar de contraseña
    const changePassword = async () => {
        validatePassword();
        console.log('passwordError', passwordError)
        if (!newPassword || !confirmPassword) {
            Swal.fire({
                icon: "warning",
                title: "Error",
                html: `<div>Se presento un error:</div><div>Ingrese correctamente los datos</div>`
            });
            validatePassword();

        } else {
            console.log("Change Password")
            await axios.post(`http://localhost:3000/v1/change/paswword`, {
                email: correo,
                userCorreo: correo,
                password: newPassword,
                otp: otpCode,
                event: evento
            });
            console.log("Ejecuta CHange Password")

            Swal.fire({
                position: "top-end",
                icon: "success",
                showConfirmButton: false,
                timer: 2500,
                customClass: {
                    title: 'text-style' // Estilo de letra personalizado
                },
                // Estilo de letra personalizado directamente
                html: `<div style="font-size: 16px; font-weight: normal;">Se actualizó correctamente la contraseña</div>`
            });
            setShowPasswordForm(false);
            navigate('/')
        }

    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const cancelAction = () => {
        navigate('/')
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = prestatario.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [timeLeft, setTimeLeft] = useState(300); // 5 minutos en segundos

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft === 0) {
            cancelAction(); // Cierra el modal cuando el tiempo llega a cero
        }
    }, [timeLeft, cancelAction]);

    useEffect(() => {
        if (showOtpForm) {
            setTimeLeft(300); // Reiniciar el tiempo a 300 segundos (5 minutos)
        }
    }, [showOtpForm]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="content">
                    <div className="modal is-active">
                        <div className="modal-card">
                            <header style={{ display: 'flex', alignItems: 'center', padding: '1.5rem 1rem' }}>
                                <p className="modal-card-title" style={{ margin: 0 }}>Cambiar contraseña:</p>
                                <button className="button"
                                    style={{ backgroundColor: 'red', color: 'white', marginLeft: 'auto' }} onClick={cancelAction}>Cancelar</button>
                            </header>

                            <section className="modal-card-body" >
                                <p>Estimado Usuario, por su seguridad le enviamos un correo a {correo} con un código de unico uso.</p>
                                <br />
                                <div className="field">
                                    <p>Ingrese aqui su codigo OTP:</p>
                                    <div className="control">
                                        <input
                                            type="text"
                                            className={`input ${errorOtp ? 'is-danger' : ''}`}
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value)}
                                            placeholder="Código OTP"
                                        />
                                    </div>
                                    {errorOtp && <p className="help is-danger">{errorOtp}</p>}
                                </div>
                                <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                    <button className="button is-primary"
                                        style={{ backgroundColor: 'green', color: 'white', marginRight: '0.5rem' }}
                                        onClick={validateOtpCode}>VERIFICAR CODIGO</button>
                                </div>
                                <p style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                    Tiempo restante: {minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}
                                </p>
                            </section>
                        </div>
                    </div>

                    {showPasswordForm && (
                        <div className="modal is-active">
                            <div className="modal-background"></div>
                            <div className="modal-card">
                                <header className="modal-card-head" style={{ padding: '1.5rem 1rem', justifyContent: 'center', alignItems: 'center' }}>
                                    <p className="modal-card-title" style={{ margin: 0 }}>INGRESA NUEVA CONTRASEÑA</p>
                                    <button className="delete" aria-label="close" onClick={cancelAction} style={{ marginLeft: 'auto' }}></button>
                                </header>


                                <section className="modal-card-body" style={{ borderRadius: '0 0 10px 10px' }}>
                                    <p>Estimado Usuario, ingrese la contraseña nueva para el usuario: {getCorreoChangePassword}</p>
                                    <br />
                                    <p>Ingrese la contraseña aqui:</p>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div className="control">

                                            <input
                                                type="password"
                                                className={`input ${passwordError ? 'is-danger' : ''}`}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                onBlur={validatePassword}
                                                placeholder="Nueva contraseña"
                                            />

                                        </div>
                                        {passwordError && <p className="help is-danger">{passwordError}</p>}

                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div className="control">
                                            <input
                                                type="password"
                                                className={`input ${passwordError ? 'is-danger' : ''}`}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                onBlur={validatePassword}
                                                placeholder="Confirmar contraseña"
                                            />
                                        </div>
                                        {passwordError && <p className="help is-danger">{passwordError}</p>}
                                    </div>
                                    <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                        <button className="button is-primary"
                                            style={{ backgroundColor: 'green', color: 'white', marginRight: '0.5rem' }}
                                            onClick={changePassword} >Cambiar contraseña</button>
                                        <button className="button"
                                            style={{ backgroundColor: 'red', color: 'white' }}
                                            onClick={cancelAction}>Cancelar</button>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
