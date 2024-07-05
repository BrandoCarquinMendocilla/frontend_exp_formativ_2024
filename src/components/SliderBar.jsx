import React, { useEffect } from 'react';
import { IoHome, IoLogOut, IoPerson } from 'react-icons/io5';
import { useDispatch, useSelector } from "react-redux";
import { logOut, reset } from "../features/authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { googleLogout } from '@react-oauth/google';

export const SliderBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getUser = useSelector((state) => state.auth);

    const handleLogOut = () => {
        googleLogout()
        dispatch(logOut());
        dispatch(reset());
        navigate("/");
    };

    return (
        <>
            {getUser.pages && (
                <aside className="menu has-shadow">
                    <p className="menu-label">General</p>
                    <ul className="menu-list">
                        <li>
                            <NavLink to={'/dashboard'}><IoHome /> Dashboard</NavLink>
                        </li>
                    </ul>
                    <p className="menu-label">Administration</p>
                    <ul className="menu-list">
                        {getUser.pages.map((page, index) => (
                            <li key={index}>
                                <NavLink to={page.path}><IoPerson /> {page.name}</NavLink>
                            </li>
                        ))}
                    </ul>
                    <p className="menu-label">Settings</p>
                    <ul className="menu-list">
                        <li>
                            <button onClick={handleLogOut} className='button is-white'><IoLogOut /> Logout</button>
                        </li>
                    </ul>
                </aside>
            )}
        </>
    );
};
