import React from 'react'

export const FormAddUser = () => {
    return (
        <div>
            <h1 className='title'>Users</h1>
            <h2 className="subtitle">
                Add New Users
            </h2>
            <div className="card is-shadowless">
                <div className='card-content'>
                    <div className="content">
                        <form>
                            <h1 className='title is-2'>Sign In</h1>
                            <div className="field">
                                <label className="label">Email</label>
                                <div className="control">
                                    <input className="input" type="email" placeholder="Email" />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Password</label>
                                <div className="control">
                                    <input className="input" type="password" placeholder="Password" />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Confirm Password</label>
                                <div className="control">
                                    <input className="input" type="password" placeholder="Password" />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Role</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <button className="button is-success is-fullwidth">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

        </div>
    )
}
