import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

export const PrestamoList = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');

    const [prestamista, setPrestamista] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2); // Número de elementos por página

    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);


    const [abrirModal, setAbrirModal] = useState(false)
    const [prestamo, setPrestamo] = useState({})

    useEffect(() => {
        getListPrestamista();
    }, [currentPage]);

    const getListPrestamista = async () => {
        setLoading(true);

        let params = {
            fechaInicio,
            fechaFin,
            nombreCompleto
        }

        console.log({
            fechaInicio,
            fechaFin,
            nombreCompleto
        })

        const response = await axios.get("http://localhost:3000/v1/private/listar/prestamo", { params });
        console.log("response:", response);
        const body = response.data.body;
        console.log(body);
        setPrestamista(body.data.prestamo);
        setLoading(false); // Cambiar el estado de loading a false

    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = prestamista.slice(indexOfFirstItem, indexOfLastItem);

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

    const cancelAction = () => {
        setAbrirModal(false)
    }

    const reloadTable = () => {
        getListPrestamista();
    };

    const cambiarEstadoPrestamo = async (prestamo, status = 'RECHAZADO') => {
        Swal.fire({
            title: `${status}`,
            text: `Esta seguro de cambiar el estado del prestamo! a ${status} `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, estoy seguro!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await chageStatusPrestamo(prestamo, status)
            }
        });
    }


    const chageStatusPrestamo = async (prestamo, status) => {
        await axios.put(`http://localhost:3000/v1/private/change/status-prestamo/${prestamo.nro_prestamo}`, {
            estado: status,
            prestatarioId: prestamo.prestatario_id,
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
            html: `<div style="font-size: 16px; font-weight: normal;"> Prestamo ${prestamo.nro_prestamo}: ${status}</div>`
        });
        reloadTable()
        setAbrirModal(false)
    }
    const [fechaInicioError, setFechaInicioError] = useState('');
    const [fechaFinError, setFechaFinError] = useState('');
    const [nombreCompletoError, setNombreCompletoError] = useState('');

    const validateFechaInicio = () => {
        if (!fechaInicio) {
            setFechaInicioError('La fecha inicio es requerido');
        } else {
            setFechaInicioError('');
        }
    }

    const validateFechaFin = () => {
        if (!fechaFin) {
            setFechaFinError('La fecha fin es requerido');
        } else {
            setFechaFinError('');
        }
    }

    const validateNombreCompleto = () => {
        if (!nombreCompleto.trim()) {
            setNombreCompletoError('El nombre completo es requerido');
        } else {
            setNombreCompletoError('');
        }
    }

    const filterPrestatario = async () => {
        if (!fechaInicio && fechaFin) {
            validateFechaInicio();
        } else

            if (fechaInicio && !fechaFin) {
                validateFechaFin();
            } else

                if (nombreCompleto && !fechaInicio && !fechaFin) {
                    await getListPrestamista()
                } else

                    if (fechaInicio && fechaFin) {
                        await getListPrestamista()
                    } else {
                        validateNombreCompleto();
                        validateFechaFin();
                        validateFechaInicio();
                    }
    }

    const clearFilters = async () => {
        console.log("Limpiando filtros...");

        setFechaFin('');
        setFechaInicio('');
        setNombreCompleto('');
        setFechaFinError('');
        setFechaInicioError('');
        setNombreCompletoError('');

        const response = await axios.get("http://localhost:3000/v1/private/listar/prestamo", {});
        console.log("response:", response);
        const body = response.data.body;
        console.log(body);
        setPrestamista(body.data.prestamo);
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">LISTA DE PRESTAMOS</p>
                </header>
                <div className="card-content">

                    <div className="content">
                        <>
                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Nombre Completo</label>
                                        <div className="control">
                                            <input
                                                type="text"
                                                value={nombreCompleto}
                                                onChange={(e) => setNombreCompleto(e.target.value)}
                                                className={`input ${nombreCompletoError ? 'is-danger' : ''}`}
                                                placeholder="Nombre"
                                            />
                                        </div>
                                        {nombreCompletoError && <p className="help is-danger">{nombreCompletoError}</p>}
                                    </div>
                                </div>
                                <div className="column is-flex">
                                    <div className="field is-flex-grow">
                                        <label className="label" style={{ visibility: "hidden" }}>Label</label> {/* Hidden label for spacing */}
                                        <div className="control">
                                            <button onClick={filterPrestatario} className="button is-primary mr-2">Buscar</button>
                                            <button onClick={clearFilters} className="button is-light">Limpiar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p>Ingrese los rangos de fechas</p>

                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Fecha Inicio</label>
                                        <div className="control">
                                            <input
                                                type="date"
                                                value={fechaInicio}
                                                onChange={(e) => setFechaInicio(e.target.value)}
                                                className={`input ${fechaInicioError ? 'is-danger' : ''}`}
                                                placeholder="Fecha Inicio"
                                            />
                                        </div>
                                        {fechaInicioError && <p className="help is-danger">{fechaInicioError}</p>}
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Fecha Fin</label>
                                        <div className="control">
                                            <input
                                                type="date"
                                                value={fechaFin}
                                                onChange={(e) => setFechaFin(e.target.value)}
                                                className={`input ${fechaFinError ? 'is-danger' : ''}`}
                                                placeholder="Fecha Fin"
                                            />
                                        </div>
                                        {fechaFinError && <p className="help is-danger">{fechaFinError}</p>}
                                    </div>
                                </div>
                            </div>
                        </>

                        {loading ? (
                            <div style={{ textAlign: 'center' }}>
                                <FaSpinner className="spinner" />
                                <p>Cargando...</p>
                            </div>
                        ) : prestamista.length === 0 ? (
                            <>
                                <p>No se encontraron datos.</p>
                            </>

                        ) : (
                            <>
                                <div className="table-pagination-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <table className="table is-fullwidth is-hoverable is-striped">
                                        <thead>
                                            <tr>
                                                <th>Id</th>
                                                <th>Nro Prestamo</th>
                                                <th>Monto</th>
                                                <th>Estado</th>
                                                <th>Fecha Aprobacion</th>
                                                <th>Fecha Inicio</th>
                                                <th>Fecha Fin</th>
                                                <th>Cuotas</th>
                                                <th>Pago Dia</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{user.id}</td>
                                                    <td>{user.nro_prestamo}</td>
                                                    <td>{user.monto_prestamo}</td>
                                                    <td>{user.estado}</td>
                                                    <td>{user.estado === 'APROBADO' ? new Date(user.fecha_aprobacion).toLocaleDateString('es-ES') : user.estado === 'PENDIENTE' ? <button
                                                        className="button is-small is-info mr-1"
                                                        disabled={true}
                                                        style={{ backgroundColor: 'white', color: 'purple', border: '1px solid purple' }}
                                                    >
                                                        PENDIENTE
                                                    </button> : <button
                                                        className="button is-small is-info mr-1"
                                                        disabled={true}
                                                        style={{ backgroundColor: 'white', color: 'red', border: '1px solid red' }}
                                                    >
                                                        RECHAZADO
                                                    </button>}</td>
                                                    <td>{new Date(user.fecha_inicio).toLocaleDateString('es-ES')}</td>
                                                    <td>{new Date(user.fecha_fin).toLocaleDateString('es-ES')}</td>
                                                    <td>{user.cuotas}</td>
                                                    <td>{user.pago_dia}</td>
                                                    <td>
                                                        <button
                                                            className="button is-small is-info mr-1"
                                                            onClick={() => {
                                                                setAbrirModal(true)
                                                                setPrestamo(user)
                                                            }}
                                                            style={{ backgroundColor: 'white', color: 'green', border: '1px solid green' }}
                                                        >
                                                            VER
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
                            </>
                        )}

                        {abrirModal && (
                            <div className="modal is-active">
                                <div className="modal-background"></div>
                                <div className="modal-card">
                                    <header className="modal-card-head" style={{ padding: '1.5rem 1rem', justifyContent: 'center', alignItems: 'center' }}>
                                        <p className="modal-card-title" style={{ margin: 0 }}>Cambia el estado del Prestamo</p>
                                        <button className="delete" aria-label="close" onClick={cancelAction} style={{ marginLeft: 'auto' }}></button>
                                    </header>

                                    <section className="modal-card-body" style={{ borderRadius: '0 0 10px 10px' }}>
                                        <p>Prestamista: {prestamo.nombre_prestamista} </p>
                                        <br></br>
                                        <p>Nro Prestamo: {prestamo.nro_prestamo}</p>
                                        <p>Prestatario: {prestamo.nombre_prestatario} </p>
                                        <p>Monto: {prestamo.monto_prestamo} </p>
                                        <p>Interés: {(Number(prestamo.importe) - Number(prestamo.monto_prestamo)).toFixed(2)} </p>
                                        <p>Cuotas: {prestamo.cuotas} </p>
                                        <p>Estado: {prestamo.estado} </p>
                                        <p>Tasa: 10%</p>
                                        <br />
                                        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                            <button className="button is-primary"
                                                disabled={prestamo.estado === 'PENDIENTE' ? false : true}
                                                style={{ backgroundColor: 'green', color: 'white', marginRight: '0.5rem' }}
                                                onClick={() => cambiarEstadoPrestamo(prestamo, 'APROBADO')}>APROBAR</button>
                                            <button className="button"
                                                style={{ backgroundColor: 'red', color: 'white' }}
                                                disabled={prestamo.estado === 'PENDIENTE' ? false : true}
                                                onClick={() => cambiarEstadoPrestamo(prestamo)}>RECHAZAR</button>
                                        </div>
                                        <button className="button"
                                            style={{ backgroundColor: 'red', color: 'white' }}
                                            onClick={cancelAction}>CANCELAR</button>
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
