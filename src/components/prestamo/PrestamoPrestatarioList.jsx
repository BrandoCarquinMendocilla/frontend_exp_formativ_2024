import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

export const PrestamoPrestatarioList = () => {
    const [prestamista, setPrestamista] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2); // Número de elementos por página

    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        getListPrestamista();
    }, [currentPage]);

    const getListPrestamista = async () => {
        const response = await axios.get("http://localhost:3000/v1/private/prestamo-prestatario");
        const body = response.data.body;
        console.log(body);
        setPrestamista(body.data.prestamo);
        setLoading(false); // Cambiar el estado de loading a false

    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = prestamista.slice(indexOfFirstItem, indexOfLastItem);
    console.log("prestamista: ", prestamista)
    console.log("Current items: ", currentItems)

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

    const [showCuotas, setShowCuotas] = useState(false); // 5 minutos en segundos
    const [cuotas, setCuotas] = useState([]); // 5 minutos en segundos


    const abrirModalCuotas = async (id) => {
        setShowCuotas(true)
        const response = await axios.get(`http://localhost:3000/v1/private/list-cuotas?prestamoId=${id}`,);
        const body = response.data.body;
        console.log(body);
        setCuotas(body.data.cuotas)
    }

    const vallidaFechaPago = (date) => {
        const getDate = new Date(date)

        const dateNow = new Date()

        const result = getDate <= dateNow
        return !result
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">LISTA DE PRESTAMOS</p>
                </header>
                <div className="card-content">

                    <div className="content">

                        <div style={{ textAlign: 'right', marginBottom: '1rem' }}> {/* Estilo inline para alinear a la derecha */}
                            <Link to="/solicitud-prestamos" className="button is-primary" style={{ backgroundColor: 'black', color: 'white' }}>
                                Añadir Nuevo Prestamo
                            </Link>
                        </div>
                        {loading ? (
                            <div style={{ textAlign: 'center' }}>
                                <FaSpinner className="spinner" />
                                <p>Cargando...</p>
                            </div>
                        ) : prestamista.length === 0 ? (
                            <p>No se encontraron datos.</p>
                        ) : (
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
                                            <th>Dias de Pago</th>
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
                                                        disabled={user.fecha_aprobacion ? false : true}
                                                        onClick={() => abrirModalCuotas(user.id)}
                                                        style={{ backgroundColor: 'white', color: 'green', border: '1px solid green' }}
                                                    >
                                                        VER PAGOS
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

                        {showCuotas && (
                            <div className="modal is-active">
                                <div className="modal-background"></div>
                                <div className="modal-card">
                                    <header className="modal-card-head" style={{ padding: '1.5rem 1rem', justifyContent: 'center', alignItems: 'center' }}>
                                        <p className="modal-card-title" style={{ margin: 0 }}>Cuotas</p>
                                        <button className="delete" aria-label="close" onClick={() => setShowCuotas(false)} style={{ marginLeft: 'auto' }}></button>
                                    </header>

                                    <section className="modal-card-body" style={{ borderRadius: '0 0 10px 10px' }}>

                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>N°</th>
                                                    <th>Fecha de Pago</th>
                                                    <th>Monto</th>
                                                    <th>Estado</th>
                                                    <th>Accion</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cuotas.map((cuota, index) => (
                                                    <tr key={cuota.id}>
                                                        <td>{index+1}</td>
                                                        <td>{cuota.fecha_pago}</td>
                                                        <td>{cuota.monto}</td>
                                                        <td> <button
                                                            className="button is-small is-info mr-1"
                                                            disabled={true}
                                                            style={{ backgroundColor: 'white', color: 'red', border: '1px solid red' }}
                                                        >
                                                            {cuota.estado}
                                                        </button></td>
                                                        <td> <button
                                                            className="button is-small is-info mr-1"
                                                            disabled={vallidaFechaPago(cuota.fecha_pago)}
                                                            style={{ backgroundColor: 'white', color: 'green', border: '1px solid green' }}
                                                        >
                                                            Pagar cuota
                                                        </button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
