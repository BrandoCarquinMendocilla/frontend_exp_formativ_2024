import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

export const PrestatarioList = () => {
    const [prestatario, setPrestatario] = useState([]);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2); // Número de elementos por página

    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    const [getCorreoChangePassword, setCorreoChangePassword] = useState('')


    useEffect(() => {
        getListPrestamista();
    }, [currentPage]);

    const getListPrestamista = async () => {
        const response = await axios.get("http://localhost:3000/v1/private/list/user");
        const body = response.data.body;
        setPrestatario(body.data.users);
        setLoading(false); // Cambiar el estado de loading a false

    };

    const sendOtpEmail = async (event, email) => {
        try {
            await axios.post(`http://localhost:3000/v1/send/mail/otp`, { event, email });
        } catch (error) {
            console.log(error);
        }
    }

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

    const [showDeletePrestamista, setShowDeletePrestamista] = useState(false);
    const [deleteEmailP, setDeleteEmailP] = useState('');
    const [deleteUserIdJP, setDeleteUserIdJP] = useState('');
    const [event, setEvent] = useState('');

    const deleteJefeProduct = async (userId, email) => {
        setDeleteEmailP(email);
        setDeleteUserIdJP(userId);
        setEvent('DELETE_PRESTATARIO')
        await sendOtpEmail('DELETE_PRESTATARIO', user.correo)
        setOtpCode('')
        setErrorOtp('')
        setShowOtpForm(true);
    }

    const deleteJefePrestamista = async () => {
        await axios.post(`http://localhost:3000/v1/private/block/user`, {
            email: deleteEmailP,
            userId: deleteUserIdJP,
            otp: otpCode,
            event
        });
        Swal.fire({
            position: "top-end",
            icon: "success",
            showConfirmButton: false,
            timer: 2500,
            customClass: {
                title: 'text-style' // Estilo de letra personalizado
            },
            // Estilo de letra personalizado directamente
            html: `<div style="font-size: 16px; font-weight: normal;">Se elimino correctamente el usuario ${deleteEmailP}</div>`
        });
        getListPrestamista();
        setShowDeletePrestamista(false)
    }

    const [updateEmailP, setUpdateEmailP] = useState('');
    const [updateUserIdJP, setUpdateUserIdP] = useState('');

    const updatePrestamista = async (userId, correo) => {
        setUpdateEmailP(correo);
        setUpdateUserIdP(userId);
        setOtpCode('')
        setErrorOtp('')
        setEvent('CHANGE_PASSWORD_PRESTATARIO')
        await sendOtpEmail('CHANGE_PASSWORD_PRESTATARIO', user.correo)
        setConfirmPassword('')
        setNewPassword('')
        setPasswordError('')
        setShowOtpForm(true);
    }

    const validateOtpCode = async () => {
        const valdiate = await validOtpEmail(event, user.correo, otpCode);
        if (valdiate) {
            console.log(event)
            setShowOtpForm(false);

            if (event === 'DELETE_PRESTATARIO') {
                setShowDeletePrestamista(true);
            }
            if (event === 'CHANGE_PASSWORD_PRESTATARIO') {
                setShowPasswordForm(true);
            }
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
                email: updateEmailP,
                userCorreo: user.correo,
                password: newPassword,
                otp: otpCode,
                event
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

        }

    }


    const cancelAction = () => {
        setShowOtpForm(false);
        setShowPasswordForm(false);
        setShowDeletePrestamista(false);
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
                <header className="card-header">
                    <p className="card-header-title">LISTA DE PRESTATARIOS</p>
                </header>
                <div className="card-content">

                    <div className="content">

                        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                            <Link to="/prestatarios/add" className="button is-primary" style={{ backgroundColor: 'black', color: 'white' }}>
                                Añadir Nuevo
                            </Link>
                        </div>
                        {loading ? (
                            <div style={{ textAlign: 'center' }}>
                                <FaSpinner className="spinner" />
                                <p>Cargando...</p>
                            </div>
                        ) : prestatario.length === 0 ? (
                            <p>No se encontraron datos.</p>
                        ) : (
                            <div className="table-pagination-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <table className="table is-fullwidth is-hoverable is-striped">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Nombre</th>
                                            <th>Correo</th>
                                            <th>Nro Documento</th>
                                            <th>Direccion</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((user, index) => (
                                            <tr key={index}>
                                                <td>{user.userId}</td>
                                                <td>{user.nombre}</td>
                                                <td>{user.correo}</td>
                                                <td>{user.nrodocumento}</td>
                                                <td>{user.direccion}</td>
                                                <td>
                                                    <Link
                                                        to={`/prestatarios/edit/${user.userId}`}
                                                        className="button is-small is-info mr-1"
                                                        style={{ backgroundColor: 'white', color: '#5D8D2B', border: '1px solid #5D8D2B' }}
                                                    >
                                                        EDITAR
                                                    </Link>
                                                    <button
                                                        onClick={() => updatePrestamista(user.userId, user.correo)}
                                                        className="button is-small is-info mr-1"
                                                        style={{ backgroundColor: 'white', color: '#BE990E', border: '1px solid #BE990E' }}
                                                    >
                                                        CAMBIAR CONTRASEÑA
                                                    </button>
                                                    <button
                                                        onClick={() => deleteJefeProduct(user.userId, user.correo)}
                                                        className="button is-small is-danger"
                                                        style={{ backgroundColor: 'white', color: 'red', border: '1px solid red' }}
                                                    >
                                                        ELIMINAR
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <nav className="pagination" role="navigation" aria-label="pagination">
                                    <button className="button pagination-previous" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
                                    <button className="button pagination-next" onClick={() => paginate(currentPage + 1)} disabled={currentItems.length < itemsPerPage}>Siguiente</button>
                                </nav>
                            </div>
                        )}

                        {showDeletePrestamista && (
                            <div className="modal is-active">
                                <div className="modal-background"></div>
                                <div className="modal-card">
                                    <header className="modal-card-head" style={{ padding: '1.5rem 1rem', justifyContent: 'center', alignItems: 'center' }}>
                                        <p className="modal-card-title" style={{ margin: 0 }}>¿Estas seguro de eliminar?</p>
                                        <button className="delete" aria-label="close" onClick={cancelAction} style={{ marginLeft: 'auto' }}></button>
                                    </header>

                                    <section className="modal-card-body" style={{ borderRadius: '0 0 10px 10px' }}>
                                        <p>Usuario a eliminar {deleteEmailP}</p>
                                        <br />
                                        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                            <button className="button is-primary"
                                                style={{ backgroundColor: 'green', color: 'white', marginRight: '0.5rem' }}
                                                onClick={deleteJefePrestamista}>Eliminar</button>
                                            <button className="button"
                                                style={{ backgroundColor: 'red', color: 'white' }}
                                                onClick={cancelAction}>Cancelar</button>
                                        </div>
                                        <p style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                            Tiempo restante: {minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}
                                        </p>
                                    </section>
                                </div>
                            </div>
                        )}

                        {showOtpForm && (
                            <div className="modal is-active">
                                <div className="modal-background"></div>
                                <div className="modal-card">
                                    <header className="modal-card-head" style={{ padding: '1.5rem 1rem', justifyContent: 'center', alignItems: 'center' }}>
                                        <p className="modal-card-title" style={{ margin: 0 }}>Ingrese el código OTP</p>
                                        <button className="delete" aria-label="close" onClick={cancelAction} style={{ marginLeft: 'auto' }}></button>
                                    </header>


                                    <section className="modal-card-body" style={{ borderRadius: '0 0 10px 10px' }}>
                                        <p>Estimado Usuario, por su seguridad le enviamos un correo a {user.correo} con un código de unico uso.</p>
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
                                            <button className="button"
                                                style={{ backgroundColor: 'red', color: 'white' }}
                                                onClick={cancelAction}>Cancelar</button>
                                        </div>
                                        <p style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                            Tiempo restante: {minutes < 10 ? '0' + minutes : minutes}:{seconds < 10 ? '0' + seconds : seconds}
                                        </p>
                                    </section>
                                </div>
                            </div>
                        )}

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
        </div>
    )
}
