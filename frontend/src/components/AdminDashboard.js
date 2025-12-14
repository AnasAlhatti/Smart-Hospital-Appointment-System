import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users'); // users, doctors, departments
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);

    // States for Forms (Create/Edit)
    const [editingId, setEditingId] = useState(null); // If null, we are in "Create" mode. If set, "Edit" mode.

    // Generic Form Data Containers
    const [userForm, setUserForm] = useState({ fullName: '', username: '', password: '' });
    const [doctorForm, setDoctorForm] = useState({ fullName: '', username: '', password: '', specialization: '', departmentId: '' });
    const [deptForm, setDeptForm] = useState({ name: '', description: '' });

    // --- DATA FETCHING ---
    const refreshAll = () => {
        api.get('/admin/users').then(res => setUsers(res.data));
        api.get('/admin/doctors').then(res => setDoctors(res.data));
        api.get('/departments').then(res => setDepartments(res.data));
    };

    useEffect(() => { refreshAll(); }, []);

    // --- HANDLERS: USER (Patients/Admins) ---
    const saveUser = (e) => {
        e.preventDefault();
        if (editingId) {
            api.put(`/admin/users/${editingId}`, userForm).then(() => { resetForms(); refreshAll(); });
        } else {
            api.post('/admin/patients', userForm).then(() => { resetForms(); refreshAll(); });
        }
    };
    const editUser = (u) => {
        setEditingId(u.id);
        setUserForm({ fullName: u.fullName, username: u.username, password: '' });
        setActiveTab('users');
    };
    const deleteUser = (id) => {
        if(window.confirm("Delete User?")) api.delete(`/admin/users/${id}`).then(refreshAll);
    };

    // --- HANDLERS: DOCTORS ---
    const saveDoctor = (e) => {
        e.preventDefault();
        if (editingId) {
            // Edit Doctor
            api.put(`/admin/doctors/${editingId}`, doctorForm).then(() => { resetForms(); refreshAll(); });
        } else {
            // Create Doctor
            api.post('/admin/doctors', doctorForm).then(() => { resetForms(); refreshAll(); });
        }
    };
    const editDoctor = (doc) => {
        setEditingId(doc.id);
        setDoctorForm({
            fullName: doc.user.fullName,
            username: doc.user.username,
            password: '',
            specialization: doc.specialization,
            departmentId: doc.department.id
        });
        setActiveTab('doctors');
    };

    // --- HANDLERS: DEPARTMENTS ---
    const saveDept = (e) => {
        e.preventDefault();
        if (editingId) {
            api.put(`/admin/departments/${editingId}`, deptForm).then(() => { resetForms(); refreshAll(); });
        } else {
            api.post('/admin/departments', deptForm).then(() => { resetForms(); refreshAll(); });
        }
    };
    const editDept = (d) => {
        setEditingId(d.id);
        setDeptForm({ name: d.name, description: d.description });
    };

    const resetForms = () => {
        setEditingId(null);
        setUserForm({ fullName: '', username: '', password: '' });
        setDoctorForm({ fullName: '', username: '', password: '', specialization: '', departmentId: '' });
        setDeptForm({ name: '', description: '' });
    };

    return (
        <div className="container mt-4">
            <h2 className="text-danger mb-4">Admin Dashboard</h2>

            {/* TABS NAVIGATION */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Manage Users</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>Manage Doctors</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'departments' ? 'active' : ''}`} onClick={() => setActiveTab('departments')}>Manage Departments</button>
                </li>
            </ul>

            {/* TAB CONTENT: USERS */}
            {activeTab === 'users' && (
                <div className="row">
                    <div className="col-md-8">
                        <h4>All Users</h4>
                        <table className="table table-hover">
                            <thead><tr><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
                            <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.fullName} <br/><small className="text-muted">{u.username}</small></td>
                                    <td><span className="badge bg-secondary">{u.role}</span></td>
                                    <td>
                                        <button onClick={() => editUser(u)} className="btn btn-sm btn-primary me-2">Edit</button>
                                        <button onClick={() => deleteUser(u.id)} className="btn btn-sm btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-light">
                            <div className="card-body">
                                <h5>{editingId ? 'Edit User' : 'Create Patient'}</h5>
                                <form onSubmit={saveUser}>
                                    <input className="form-control mb-2" placeholder="Full Name" value={userForm.fullName} onChange={e => setUserForm({...userForm, fullName: e.target.value})} required />
                                    <input className="form-control mb-2" placeholder="Username" value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} required />
                                    <input className="form-control mb-2" type="password" placeholder={editingId ? "New Password (Optional)" : "Password"} value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} />
                                    <button className="btn btn-success w-100">{editingId ? 'Update' : 'Create'}</button>
                                    {editingId && <button type="button" onClick={resetForms} className="btn btn-secondary w-100 mt-2">Cancel</button>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: DOCTORS */}
            {activeTab === 'doctors' && (
                <div className="row">
                    <div className="col-md-8">
                        <h4>Doctors List</h4>
                        <table className="table table-hover">
                            <thead><tr><th>Name</th><th>Specialization</th><th>Dept</th><th>Actions</th></tr></thead>
                            <tbody>
                            {doctors.map(d => (
                                <tr key={d.id}>
                                    <td>{d.user?.fullName}</td>
                                    <td>{d.specialization}</td>
                                    <td>{d.department?.name}</td>
                                    <td>
                                        <button onClick={() => editDoctor(d)} className="btn btn-sm btn-primary">Edit</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-light">
                            <div className="card-body">
                                <h5>{editingId ? 'Edit Doctor' : 'Create Doctor'}</h5>
                                <form onSubmit={saveDoctor}>
                                    <input className="form-control mb-2" placeholder="Full Name" value={doctorForm.fullName} onChange={e => setDoctorForm({...doctorForm, fullName: e.target.value})} required />
                                    {!editingId && <input className="form-control mb-2" placeholder="Username" value={doctorForm.username} onChange={e => setDoctorForm({...doctorForm, username: e.target.value})} required />}
                                    {!editingId && <input className="form-control mb-2" type="password" placeholder="Password" value={doctorForm.password} onChange={e => setDoctorForm({...doctorForm, password: e.target.value})} required />}
                                    <input className="form-control mb-2" placeholder="Specialization" value={doctorForm.specialization} onChange={e => setDoctorForm({...doctorForm, specialization: e.target.value})} required />
                                    <select className="form-control mb-2" value={doctorForm.departmentId} onChange={e => setDoctorForm({...doctorForm, departmentId: e.target.value})} required>
                                        <option value="">Select Dept</option>
                                        {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                                    </select>
                                    <button className="btn btn-info text-white w-100">{editingId ? 'Update' : 'Create'}</button>
                                    {editingId && <button type="button" onClick={resetForms} className="btn btn-secondary w-100 mt-2">Cancel</button>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: DEPARTMENTS */}
            {activeTab === 'departments' && (
                <div className="row">
                    <div className="col-md-8">
                        <h4>Departments</h4>
                        <table className="table table-hover">
                            <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
                            <tbody>
                            {departments.map(d => (
                                <tr key={d.id}>
                                    <td>{d.name}</td>
                                    <td>{d.description}</td>
                                    <td>
                                        <button onClick={() => editDept(d)} className="btn btn-sm btn-primary">Edit</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-light">
                            <div className="card-body">
                                <h5>{editingId ? 'Edit Dept' : 'Add Dept'}</h5>
                                <form onSubmit={saveDept}>
                                    <input className="form-control mb-2" placeholder="Name" value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} required />
                                    <input className="form-control mb-2" placeholder="Description" value={deptForm.description} onChange={e => setDeptForm({...deptForm, description: e.target.value})} />
                                    <button className="btn btn-warning w-100">{editingId ? 'Update' : 'Add'}</button>
                                    {editingId && <button type="button" onClick={resetForms} className="btn btn-secondary w-100 mt-2">Cancel</button>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;