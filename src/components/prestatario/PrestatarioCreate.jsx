import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const FormAddPrestatario = () => {
    const [name, setName] = useState("");
    const [apellido, setApellido] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [documento, setDocumento] = useState("");
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [recomendacion, setRecomendacion] = useState("");


    const [correo, setCorreo] = useState(""); // rol _ 1
    const [password, setPasssword] = useState("");
    const [confirmacionPassword, setConfirmPassword] = useState("");
    const [createdUser, setCreatedUser] = useState("");

    const [msg, setMsg] = useState("");

    // Combos
    const [cbTipoDocumento, setCbTipoDocumento] = useState([]);
    const [cbSede, setCbSede] = useState([]);

    const navigate = useNavigate();

    const alamacenaCombos = async () => {
        try {
            console.log("Cargar")
            const response = await axios.get("http://localhost:3000/v1/get/combos");
            const body = response.data.body;

            console.log(response.data);
            setCbTipoDocumento(body.data.combos.tipoDocumento);
            setCbSede(body.data.combos.sedes);
        } catch (error) {
            console.error("Error fetching document types:", error);
        }
    };


    const validateUser = async () => {
        try {
            const validate = await axios.post("http://localhost:3000/v1/private/validate/user", { telefono, documento, correo });
            const bodyValidate = validate.data.body;
            const responseValidate = bodyValidate.data.validate;

            if (responseValidate.telefono || responseValidate.correo | responseValidate.documento) {
                if (responseValidate.telefono) {
                    setTelefonoError("El número de teléfono ingresado ya existe.");

                }
                if (responseValidate.correo) {
                    setCorreoError("El correo ingresado ya existe.");

                }
                if (responseValidate.documento) {
                    setDocumentoError("El número de documento ingresado ya existe.");

                }
                return false;
            }

            return true;
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    const saveProduct = async (e) => {
        e.preventDefault();
        validateName();
        validateApellido();
        validateDireccion();
        validateTelefono();
        validateTipoDocumento();
        validateDocumento();
        validateCorreo();
        validatePassword();
        
        if (nameError || apellidoError || direccionError || telefonoError || tipoDocumentoError || documentoError || correoError || passwordError
            || !confirmacionPassword || !password) {

            Swal.fire({
                icon: "warning",
                title: "Error",
                html: `<div>Se presento un error:</div><div>Ingrese correctamente los datos</div>`
            });
        } else {
            try {
                const validate = await validateUser();
                if (validate) {
                    await axios.post("http://localhost:3000/v1/private/save/prestatario", {
                        name,
                        apellido,
                        direccion,
                        telefono,
                        documento,
                        tipoDocumento,
                        correo,
                        password,
                        confirmacionPassword,
                        createdUser,
                        recomendacion
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
                        html: `<div style="font-size: 16px; font-weight: normal;">Se registro correctamente el usuario: ${name} ${apellido}</div>`
                    });
                    navigate("/prestatarios");
                }


            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        }


    };

    useEffect(() => {
        alamacenaCombos();
    }, []);

    // Validaciones
    const [nameError, setNameError] = useState("");
    const validateName = () => {
        const regex = /^[a-zA-Z\s]{2,50}$/;
        if (!regex.test(name) || !name.trim()) {
            setNameError("El nombre solo puede contener letras.");
        } else {
            setNameError("");
        }
    }

    const [apellidoError, setApellidoError] = useState("");
    const validateApellido = () => {
        const regex = /^[a-zA-Z\s]{2,50}$/;
        if (!regex.test(apellido) || !apellido.trim()) {
            setApellidoError("El apellido solo puede contener letras.");
        } else {
            setApellidoError("");
        }
    }

    const [direccionError, setDireccionError] = useState("");
    const validateDireccion = () => {
        const regex = /^[a-zA-Z0-9\s\-.,#áéíóúÁÉÍÓÚñÑ]{5,100}$/;
        if (!regex.test(direccion) || !direccion.trim()) {
            setDireccionError("La Dirección ingresada es incorrecta.");
        } else {
            setDireccionError("");
        }
    }

    const [telefonoError, setTelefonoError] = useState("");
    const validateTelefono = () => {
        const regex = /^(?:\d{6}|\d{9})$/;
        if (!regex.test(telefono)) {
            setTelefonoError("El número de teléfono ingresado es incorrecto.");
        } else {
            setTelefonoError("");
        }
    };


    const [tipoDocumentoError, setTipoDocumentoError] = useState("");
    const validateTipoDocumento = () => {
        if (!tipoDocumento) {
            setTipoDocumentoError("Por favor, seleccione un Tipo de Documento.");
            setDocumentoError("");
        } else {
            setDocumentoError("");
            setTipoDocumentoError("");
        }
    };

    const [documentoError, setDocumentoError] = useState("");
    const validateDocumento = () => {
        switch (tipoDocumento) {
            case '1':
                if (!/^\d{8}$/.test(documento)) {
                    setDocumentoError("El DNI ingresado es incorrecto.");
                } else {
                    setDocumentoError("");
                }
                break;
            case '3':
                if (!/^[a-zA-Z]\d{12}$/.test(documento)) {
                    setDocumentoError("El Carnet de Extranjería ingresado es incorrecto.");
                } else {
                    setDocumentoError("");
                }
                break;
            case '2':
                if (!/^[a-zA-Z]\d{8,9}$/.test(documento)) {
                    setDocumentoError("El Pasaporte ingresado es incorrecto.");
                } else {
                    setDocumentoError("");
                }
                break;
            default:
                setDocumentoError("");
        }
    };

    const [correoError, setCorreoError] = useState("");
    const validateCorreo = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(correo)) {
            setCorreoError("El correo electrónico ingresado no es válido.");
        } else {
            setCorreoError("");
        }
    };

    const [passwordError, setPasswordError] = useState("");

    const validatePassword = () => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-z])(?=.*\S).{8,20}$/


        if (!password.trim() || !confirmacionPassword.trim() || !regex.test(password)) {
            setPasswordError("Contraseña incorrecta. La contraseña de contener una letra mayuscula, un caracter especial y 8 caracteres");
        } else if (password !== confirmacionPassword) {
            setPasswordError("Las contraseñas no coinciden.");
        } else {
            setPasswordError("");
        }
    };


    const [recomendacionError, setRecomendacionError] = useState("");
    const validateRecomendacion = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(recomendacion)) {
            setRecomendacionError("La recomendacion ingresada es invalida.");
        } else {
            setRecomendacionError("");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">CREAR PRESTATARIO</p>
                </header>
                <div className="card-content">
                    <div className="content">
                        <form onSubmit={saveProduct}>

                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">NOMBRE</label>
                                        <div className="control">
                                            <input
                                                type="text"
                                                className={`input ${nameError ? 'is-danger' : ''}`}
                                                value={name}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Validar que no contenga números
                                                    if (!/\d/.test(value)) {
                                                        setName(value);
                                                    }
                                                }}
                                                onBlur={validateName}
                                                placeholder="Nombre"
                                            />
                                        </div>
                                        {nameError && <p className="help is-danger">{nameError}</p>}
                                    </div>
                                </div>

                                <div className="column">
                                    <div className="field">
                                        <label className="label">APELLIDO</label>
                                        <div className="control">
                                            <input
                                                type="text"
                                                className={`input ${apellidoError ? 'is-danger' : ''}`} value={apellido}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Validar que no contenga números
                                                    if (!/\d/.test(value)) {
                                                        setApellido(value);
                                                    }
                                                }}
                                                onBlur={validateApellido}
                                                placeholder="Apellido"
                                            />
                                        </div>
                                        {apellidoError && <p className="help is-danger">{apellidoError}</p>}
                                    </div>
                                </div>




                            </div>
                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">DIRECCIÓN</label>
                                        <div className="control">
                                            <input
                                                type="text"
                                                className={`input ${direccionError ? 'is-danger' : ''}`}
                                                min={100}
                                                value={direccion}
                                                onChange={(e) => setDireccion(e.target.value)}
                                                onBlur={validateDireccion}
                                                placeholder="Dirección"
                                            />
                                        </div>
                                        {direccionError && <p className="help is-danger">{direccionError}</p>}
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">TELÉFONO</label>
                                        <div className="control">
                                            <input
                                                type="text"
                                                className={`input ${direccionError ? 'is-danger' : ''}`}
                                                value={telefono}
                                                max={9}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Verificar si el valor ingresado es un número
                                                    if (!isNaN(value)) {
                                                        setTelefono(value);
                                                    }
                                                }}
                                                onBlur={validateTelefono}
                                                placeholder="Teléfono"
                                            />
                                        </div>
                                        {telefonoError && <p className="help is-danger">{telefonoError}</p>}
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">RECOMENDACIÓN</label>
                                        <div className="control">
                                            <input
                                                type="text"
                                                className={`input ${recomendacionError ? 'is-danger' : ''}`}
                                                value={recomendacion}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Validar que no contenga números
                                                    if (!/\d/.test(value)) {
                                                        setRecomendacion(value);
                                                    }
                                                }}
                                                onBlur={validateRecomendacion}
                                                placeholder="Nombre"
                                            />
                                        </div>
                                        {recomendacionError && <p className="help is-danger">{recomendacionError}</p>}
                                    </div>
                                </div>
                            </div>
                            <hr></hr>
                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">TIPO DOCUMENTO</label>
                                        <div className="control">
                                            <select
                                                className={`input ${tipoDocumentoError ? 'is-danger' : ''}`}
                                                value={tipoDocumento}
                                                onChange={(e) => {
                                                    setTipoDocumento(e.target.value)
                                                    setDocumento('')
                                                }}
                                                onBlur={validateTipoDocumento}
                                            >
                                                <option value="">Seleccionar tipo de documento</option>
                                                {cbTipoDocumento.map((tipo) => (
                                                    <option key={tipo.id} value={tipo.id}>
                                                        {tipo.descripcion}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {tipoDocumentoError && <p className="help is-danger">{tipoDocumentoError}</p>}
                                    </div>
                                </div>

                                <div className="column">
                                    <div className="field">
                                        <label className="label">N° DOCUMENTO</label>
                                        <div className="control">
                                            <input
                                                type="text"
                                                className={`input ${documentoError ? 'is-danger' : ''}`}
                                                value={documento}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Verificar si el valor ingresado es un número
                                                    if (!isNaN(value)) {
                                                        setDocumento(value);
                                                    }
                                                }}
                                                onBlur={validateDocumento}
                                                placeholder="Documento"
                                                disabled={!tipoDocumento}
                                            />
                                        </div>
                                        {documentoError && <p className="help is-danger">{documentoError}</p>}
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">CORREO</label>
                                        <div className="control">
                                            <input
                                                type="email"
                                                className={`input ${correoError ? 'is-danger' : ''}`}
                                                value={correo}
                                                onChange={(e) => setCorreo(e.target.value)}
                                                onBlur={validateCorreo}
                                                placeholder="Correo electrónico"
                                            />
                                        </div>
                                        {correoError && <p className="help is-danger">{correoError}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">CONTRASEÑA</label>
                                        <div className="control">
                                            <input
                                                type="password"
                                                value={password}
                                                className={`input ${passwordError ? 'is-danger' : ''}`}
                                                onChange={(e) => setPasssword(e.target.value)}
                                                onBlur={validatePassword}
                                                placeholder="Contraseña"
                                            />
                                        </div>
                                        {passwordError && <p className="help is-danger">{passwordError}</p>}
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">CONFIRMA CONTRASEÑA</label>
                                        <div className="control">
                                            <input
                                                type="password"
                                                className={`input ${passwordError ? 'is-danger' : ''}`}
                                                value={confirmacionPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                onBlur={validatePassword}
                                                placeholder="Confirmar Contraseña"
                                            />
                                        </div>
                                        {passwordError && <p className="help is-danger">{passwordError}</p>}

                                    </div>
                                </div>
                            </div>



                            <div className="field">
                                <div className="control">
                                    <button type="submit"
                                        style={{
                                            backgroundColor: 'black',
                                            marginRight: '0.5rem',
                                            color: 'white', border: '1px solid black'
                                        }}
                                        className="button is-success ">
                                        REGISTRAR
                                    </button>
                                    <Link
                                        to={`/prestatarios`}
                                        className="button is-info  mr-1"
                                        style={{ backgroundColor: 'red', color: 'white', border: '1px solid white' }}
                                    >
                                        REGRESAR
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default FormAddPrestatario;
