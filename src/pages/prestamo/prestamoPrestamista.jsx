import React from 'react'
import { Layout } from '../Layout'
import PropuestaTable from '../../components/propuesta/Propuesta'
import { PrestamoPrestatarioList } from '../../components/prestamo/PrestamoPrestatarioList'

export const PrestamoPrestatarioListar = () => {
    return (
        <Layout>
            <PrestamoPrestatarioList/>
        </Layout>
    )
}
