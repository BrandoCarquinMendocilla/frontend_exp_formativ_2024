/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function PropuestaTable() {
    const [tablaData, setTablaData] = useState(null);
    const [abirSolicitud, setAbrirSolicitud] = useState(false);

    const [montoPropuesto, setMontoPropuesto] = useState('');
    const [duracionPropuesta, setDuracionPropuesta] = useState('');
    const [diaNoLaborables, setDiaNoLaborables] = useState(0);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const [validDate, setValidDate] = useState('');
    const [pagoPorDia, setPagoPorDia] = useState(0);
    const [montoPrestamo, setMontoPrestamo] = useState('');

    const getPropuesta = async () => {
        const response = await axios.get("http://localhost:3000/v1/private/solicitud-propuesta");
        const body = response.data.body;
        setTablaData(body.data.tabla);
    }

    useEffect(() => {
        getPropuesta()
    }, []);

    const limpiarInput = () => {
        setMontoPropuesto('');
        setDuracionPropuesta('');
        calulatePagoPorDia();
        setPagoPorDia('')
        setFechaInicio('')
        setFechaFin('')
        setDiaNoLaborables(0)
        setPagoPorDia(0)
    }

    const montos = [150, 200, 300, 400, 500];
    const generarSolicitud = (monto, duracion, montoPrestamo) => {
        limpiarInput()
        setAbrirSolicitud(true);
        setMontoPropuesto(monto);
        setDuracionPropuesta(duracion);
        setMontoPrestamo(montoPrestamo)
    }

    const handleFechaInicio = (event) => {
        setFechaInicio(event.target.value);
        validateFechaInicio(event.target.value);
        getFechaFin(event.target.value);
    };

    const getFechaFin = (fecha) => {
        setDiaNoLaborables(0)
        setPagoPorDia(0)
        console.log("Fecha Parametro: ", fecha)
        const fechaInicioDate = new Date(fecha);
        fechaInicioDate.setHours(0, 0, 0, 0);


        console.log("fechaInicioDate Parametro: ", fechaInicioDate)

        const duracionDays = parseInt(duracionPropuesta);
        const fechaFinDate = new Date(fechaInicioDate); // Crear una copia de la fecha de inicio
        fechaFinDate.setDate(fechaFinDate.getDate() + duracionDays);

        console.log("fechaFinDate: ", fechaFinDate);
        let diasLaborables = 0;

        let fechaActual = fechaInicioDate;
        fechaActual.setDate(fechaActual.getDate() + 1); // Avanzar al siguiente día

        console.log("-- fechaActual : ", fechaActual)

        if (fechaFinDate.getDay() === 6) {
            console.log("Descontar 1 : ", fechaFinDate.getDate() - 1)
            fechaFinDate.setDate(fechaFinDate.getDate() - 1);
        } else if (fechaFinDate.getDay() === 0) {
            console.log("Descontar 2: ", fechaFinDate.getDate() - 2)
            fechaFinDate.setDate(fechaFinDate.getDate() - 2);
        }

        while (fechaActual <= fechaFinDate) {

            if (fechaActual.getDay() !== 6 && fechaActual.getDay() !== 0) { // Si no es sábado ni domingo, contar el día como laborable
                console.log("Descontar fechaActual : ", fechaActual)
                console.log("Descontar fechaActual : ", fechaActual.getDay())
                diasLaborables++;
            }
            fechaActual.setDate(fechaActual.getDate() + 1); // Avanzar al siguiente día

        }

        if (fechaFinDate.getDay() === 6) {
            console.log("Descontar 1 : ", fechaFinDate.getDate() - 1)
            fechaFinDate.setDate(fechaFinDate.getDate() - 1);
        } else if (fechaFinDate.getDay() === 0) {
            console.log("Descontar 2: ", fechaFinDate.getDate() - 2)
            fechaFinDate.setDate(fechaActual.getDate() - 2);
        }

        console.log("fechaActual: ", fechaFinDate);
        console.log("fechaActual: ", fechaFinDate.toISOString().split('T')[0]);
        console.log("fechaActual (local): ", fechaFinDate.toLocaleDateString('es-PE')); // Convertir a cadena local en Perú
        const dia = fechaFinDate.getDate();
        const mes = fechaFinDate.getMonth() + 1; // Suma 1 al mes ya que en JavaScript los meses van de 0 a 11
        const año = fechaFinDate.getFullYear();

        const mesFormateado = mes < 10 ? `0${mes}` : mes;
        const diaFormateado = dia < 10 ? `0${dia}` : dia;

        const fechaActualFormateada = `${año}-${mesFormateado}-${diaFormateado}`;
        setFechaFin(fechaActualFormateada); // Formatear la fecha de finalización como YYYY-MM-DD
        calulatePagoPorDia(diasLaborables)

    };

    const calulatePagoPorDia = (diasLaborabless) => {
        setDiaNoLaborables(diasLaborabless)

        console.log("Calcular dias: ", diasLaborabless)
        const pagoPorDia = montoPropuesto / diasLaborabless;
        console.log("Calcular pagoPorDia : ", pagoPorDia)
        const decimalPart = pagoPorDia - Math.floor(pagoPorDia);
        if (decimalPart > 0 && decimalPart.toString().split('.')[1].length > 1) {
            console.log("Calcular pagoPorDia: ", pagoPorDia)
            // setPagoPorDia(Math.ceil(pagoPorDia * 10) / 10)
            setPagoPorDia(Math.round(pagoPorDia * 100) / 100)

            return Math.ceil(pagoPorDia * 10) / 10;
        } else {
            console.log("Calcular pagoPorDia: ", pagoPorDia)
            setPagoPorDia(pagoPorDia)

            return pagoPorDia;
        }

    };


    const validateFechaInicio = (fecha) => {
        const date = new Date(fecha);
        const day = date.getDay();
        const validDay = day === 5 || day === 6;
        if (validDay) {
            setValidDate('Estimado usuario, solo debe ingresar fechas laborables con un maximo de 15 dias.');
        } else {
            setValidDate('');
        }
    };

    const crearSolicitudPrestamo = async () => {
        try {
            if (!fechaInicio) {
                Swal.fire({
                    icon: "warning",
                    title: "Error",
                    html: `<div>Se presento un error:</div><div>Ingrese correctamente los datos</div>`
                });
            } else {
                await axios.post("http://localhost:3000/v1/private/save/prestamo", {
                    monto: montoPropuesto,
                    cuotas: diaNoLaborables,
                    fechaInicio,
                    fechaFin,
                    pagoPorDia,
                    montoPrestamo,
                    duracion: duracionPropuesta
                });
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2500,
                    customClass: {
                        title: 'text-style'
                    },
                    html: `<div style="font-size: 16px; font-weight: normal;">Se registro correctamente su solicitud.</div>`
                });
                setAbrirSolicitud(false)
            }
        } catch (err) {
            console.log("Error:", err)
        }
    }






    return (
        <div className="container mt-4">
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">Solicita tu prestamo</p>
                </header>
                <div className="card-content">

                    <div className="content">

                        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                            <Link to="/prestamos-prestatario" className="button is-primary" style={{ backgroundColor: 'black', color: 'white' }}>
                                Mis prestamos
                            </Link>
                        </div>
                        <p>Estimado Usuario, tiene una tasa actual del 10% con nosotros.</p>
                        <br />
                        <p>La duracion de dias, es la cantidad de dias habiles que pagaras..</p>
                        <div className="table-pagination-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <table className="table is-fullwidth is-hoverable is-striped">
                                <thead>
                                    <tr>
                                        <th colSpan="6" style={{ textAlign: 'center' }}>Montos</th>
                                    </tr>
                                    <tr>
                                        <th>Duración</th>
                                        <th>S/. 150.00</th>
                                        <th>S/. 200.00</th>
                                        <th>S/. 300.00</th>
                                        <th>S/. 400.00</th>
                                        <th>S/. 500.00</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tablaData && Object.keys(tablaData).map(duracion => (
                                        <tr key={duracion}>
                                            <td>{duracion} dias</td>
                                            {tablaData[duracion].map((monto, index) => (
                                                <td key={index}>
                                                    <button onClick={() => generarSolicitud(monto, duracion, montos[index])} className="button is-small is-info mr-1" style={{ backgroundColor: 'white', color: '#5D8D2B', border: '1px solid #5D8D2B' }}> S/ {monto}</button>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {abirSolicitud && (
                            <div className="modal is-active">
                                <div className="modal-background"></div>
                                <div className="modal-card">
                                    <header className="modal-card-head" style={{ padding: '1.5rem 1rem', justifyContent: 'center', alignItems: 'center' }}>
                                        <p className="modal-card-title" style={{ margin: 0 }}>Esta a un paso de solicitar su prestamo</p>
                                        <button className="delete" aria-label="close" onClick={() => setAbrirSolicitud(false)} style={{ marginLeft: 'auto' }}></button>
                                    </header>


                                    <section className="modal-card-body" style={{ borderRadius: '0 0 10px 10px' }}>
                                        <p>Estimado Usuario, tiene una tasa actual del 10% con nosotros.</p>
                                        <br />
                                        <p>Tenga presente que las cuotas diarias se basan en un calculo de pagos por dias laborables, si su pago es 1.58 se cobrara 1.6 a favor del banco </p>

                                        <div className="field" style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ margin: 0, marginRight: '0.5rem' }}>Monto:</p>
                                            <div className="control">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    disabled={true}
                                                    value={montoPropuesto}
                                                />
                                            </div>
                                        </div>
                                        <div className="field" style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ margin: 0, marginRight: '0.5rem' }}>Fecha Inicio:</p>
                                            <div className="control">
                                                <input
                                                    type="date"
                                                    className={`input ${validDate ? 'is-danger' : ''}`}
                                                    value={fechaInicio}
                                                    onChange={handleFechaInicio}
                                                    min={getMinDate()}
                                                    max={getMaxDate()} />
                                            </div>
                                        </div>
                                        {validDate && <p className="help is-danger">{validDate}</p>}
                                        <div className="field" style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ margin: 0, marginRight: '0.5rem' }}>Fecha Fin:</p>
                                            <div className="control">
                                                <input
                                                    type="date"
                                                    className={`input`}
                                                    value={fechaFin}
                                                    disabled={true}
                                                    readOnly={true}
                                                    onChange={() => { }} />
                                            </div>
                                        </div>
                                        <div className="field" style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ margin: 0, marginRight: '0.5rem' }}>Duración:</p>
                                            <div className="control">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    disabled={true}
                                                    value={duracionPropuesta}
                                                />
                                            </div>
                                        </div>
                                        <div className="field" style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ margin: 0, marginRight: '0.5rem' }}>Dias laborables:</p>
                                            <div className="control">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    disabled={true}
                                                    value={diaNoLaborables}
                                                />
                                            </div>
                                        </div>
                                        <div className="field" style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ margin: 0, marginRight: '0.5rem' }}>Dias no laborables:</p>
                                            <div className="control">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    disabled={true}
                                                    value={duracionPropuesta - diaNoLaborables} // Calcular los días no laborables y mostrar el resultado
                                                />
                                            </div>
                                        </div>
                                        <div className="field" style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ margin: 0, marginRight: '0.5rem' }}>Pago por dia:</p>
                                            <div className="control">
                                                <input
                                                    type="text"
                                                    className="input"
                                                    disabled={true}
                                                    value={pagoPorDia}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                                            <button className="button is-primary"
                                                style={{ backgroundColor: 'green', color: 'white', marginRight: '0.5rem' }}
                                                onClick={() => crearSolicitudPrestamo()}
                                            >Registrar solicitud</button>
                                            <button className="button"
                                                style={{ backgroundColor: 'red', color: 'white' }}
                                                onClick={() => setAbrirSolicitud(false)}>Cancelar</button>
                                        </div>

                                    </section>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
const getMinDate = () => {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0]; // Formato de fecha YYYY-MM-DD
};

const getMaxDate = () => {
    const currentDate = new Date();
    const maxDate = new Date(currentDate);
    maxDate.setDate(currentDate.getDate() + 15); // Suma 15 días a la fecha actual

    // Verifica si la fecha es lunes o viernes
    while (maxDate.getDay() !== 1 && maxDate.getDay() !== 5) {
        maxDate.setDate(maxDate.getDate() - 1); // Resta un día hasta que sea lunes o viernes
    }

    return maxDate.toISOString().split('T')[0]; // Formato de fecha YYYY-MM-DD
};

export default PropuestaTable;
