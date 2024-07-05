import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";

const FormUpdateJefePrestamista = () => {
    const [name, setName] = useState("");
    const [apellido, setApellido] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [documento, setDocumento] = useState("");
    const [tipoDocumento, setTipoDocumento] = useState("");

    const [correo, setCorreo] = useState(""); // rol _ 1
    const [password, setPasssword] = useState("");
    const [confirmacionPassword, setConfirmPassword] = useState("");
    const [createdUser, setCreatedUser] = useState("");
    const [sedeId, setSedeId] = useState("");

    const [msg, setMsg] = useState("");


    const [loading, setLoading] = useState(true);


    // Combos
    const [cbTipoDocumento, setCbTipoDocumento] = useState([]);
    const [cbSede, setCbSede] = useState([]);

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


    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getUserById = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/v1/private/jefe-prestamista/${id}`);
                const body = response.data.body
                const user = body.data.user;
                console.log(user)
                console.log(body)
                setName(user.nombre);
                setApellido(user.apellidos);
                setDireccion(user.direccion);
                setTelefono(user.telefono);
                setDocumento(user.documento);
                setTipoDocumento(user.tipo_documento);
                setCorreo(user.correo);
                setPasssword(user.password);
                setConfirmPassword(user.password);
                setCreatedUser(user.description);
                setSedeId(user.sede_id);


                setLoading(false); // Cambiar el estado de loading a false
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };
        getUserById();
        alamacenaCombos();
    }, [id]);

    const validateUser = async () => {
        try {
            const validate = await axios.post("http://localhost:3000/v1/private/validate/user", { telefono, documento, correo, userId: Number(id) });
            const bodyValidate = validate.data.body;
            const responseValidate = bodyValidate.data.validate;

            if (responseValidate.telefono  || responseValidate.documento) {
                if (responseValidate.telefono) {
                    setTelefonoError("El número de teléfono ingresado ya existe.");

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


    const updateJefePrestamista = async (e) => {
        e.preventDefault();

        validateName();
        validateApellido();
        validateDireccion();
        validateSede();
        validateTelefono();
        validateTipoDocumento();
        validateDocumento();
        if (nameError || apellidoError || direccionError || sedeError || telefonoError || tipoDocumentoError || documentoError) {
            Swal.fire({
                icon: "warning",
                title: "Error",
                html: `<div>Se presento un error:</div><div>Ingrese correctamente los datos</div>`
            });
        } else {

            try {
                const validate = await validateUser();
                if (validate) {
                    await axios.patch("http://localhost:3000/v1/private/update/jefe-prestamista/" + id, {
                        name,
                        apellido,
                        direccion,
                        telefono,
                        documento,
                        tipoDocumento
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
                        html: `<div style="font-size: 16px; font-weight: normal;">Se actualizó correctamente el usuario: ${name} ${apellido}</div>`
                    });

                    navigate("/jefes-prestamistas");
                }


            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        }
    };


    // Validaciones
    const [nameError, setNameError] = useState("");
    const validateName = () => {
        const regex = /^[a-zA-Z\s]{2,50}$/;
        console.log(name)
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

    const [sedeError, setSedeError] = useState("");
    const validateSede = () => {
        if (!sedeId) {
            setSedeError("Por favor, seleccione una sede.");
        } else {
            setSedeError("");
        }
    };

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

    return (
        <div className="container mt-4">
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">EDITAR JEFE DE PRESTAMISTA : {name} </p>
                </header>
                <div className="card-content">
                    <div className="content">
                        {loading ? (
                            <div style={{ textAlign: 'center' }}>
                                <FaSpinner className="spinner" />
                                <p>Cargando...</p>
                            </div>
                        ) : !name ? (
                            <p>No se encontraron datos.</p>
                        ) : (
                            <form onSubmit={updateJefePrestamista}>

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
                                                    }} onBlur={validateName}
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
                                            <label className="label">SEDE</label>
                                            <div className="control">
                                                <select
                                                    className={`input ${sedeError ? 'is-danger' : ''}`}
                                                    value={sedeId}
                                                    onChange={(e) => setSedeId(e.target.value)}
                                                    onBlur={validateSede}
                                                >
                                                    <option value="">Seleccionar Sede</option>
                                                    {cbSede.map((tipo) => (
                                                        <option key={tipo.id} value={tipo.id}>
                                                            {tipo.ubicacion}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {sedeError && <p className="help is-danger">{sedeError}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="columns">

                                    <div className="column">
                                        <div className="field">
                                            <label className="label">TELÉFONO</label>
                                            <div className="control">
                                                <input
                                                    type="text"
                                                    className={`input ${telefonoError ? 'is-danger' : ''}`}
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
                                            ACTUALIZAR
                                        </button>
                                        <Link
                                            to={`/jefes-prestamistas`}
                                            className="button is-info  mr-1"
                                            style={{ backgroundColor: 'red', color: 'white', border: '1px solid white' }}
                                        >
                                            REGRESAR
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>


    );

};


export default FormUpdateJefePrestamista;
