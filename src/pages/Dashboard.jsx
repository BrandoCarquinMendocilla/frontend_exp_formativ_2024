import React, { useEffect } from 'react';
import { Layout } from './Layout';
import Welcome from '../components/Welcome';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

export const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate('/');
        }
    }, [isError, navigate]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <Layout>
            <Welcome></Welcome>
        </Layout>
    );
};
 