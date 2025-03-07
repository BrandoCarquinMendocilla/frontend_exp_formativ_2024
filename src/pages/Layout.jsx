import React from 'react';
import { Navbar } from '../components/Navbar';
import { SliderBar } from '../components/SliderBar';

export const Layout = ({ children }) => {
    return (
        <React.Fragment>
            <Navbar />
            <div className="columns mt-6" style={{ minHeight: '100vh' }}>
                <div className="column is-2">
                    <SliderBar />
                </div>
                <div className="column has-background-light">
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </React.Fragment>
    );
};
