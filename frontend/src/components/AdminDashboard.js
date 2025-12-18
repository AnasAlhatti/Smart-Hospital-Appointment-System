import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminDashboard = () => {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('users'); // users, doctors, departments
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [errorMsg, setErrorMsg] = useState(''); // Global error message state

    // Form States
    const [editingId, setEditingId] = useState(null);

    // User Form Data
    const [userForm, setUserForm] = useState({ fullName: '', username: '', password: '' });

    // Doctor Form Data (newDoc)
    const [newDoc, setNewDoc] = useState({ fullName: '', username: '', password: '', specialization: '', departmentId: '' });

    // Department Form Data
    const [deptForm, setDeptForm] = useState({ name: '', description: '' });

    // --- DATA FETCHING ---
    const fetchUsers = () => {
        api.get('/admin/users').then(res => setUsers(res.data)).catch(err => console.error(err));
    };

    const fetchDoctors = () => {
        api.get('/admin/doctors').then(res => setDoctors(res.data)).catch(err => console.error(err));
    };

    const fetchDepartments = () => {
        api.get('/departments').then(res => setDepartments(res.data)).catch(err => console.error(err));
    };

    const refreshAll = () => {
        fetchUsers();
        fetchDoctors();
        fetchDepartments();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { refreshAll(); }, []);

    // --- VALIDATION HELPER ---
    const validateForm = (form) => {
        // 1. Password Regex (8+ chars, Upper, Lower, Number, Special)
        const passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$/;

        // Only validate password if it is not empty (e.g. during creation or password update)
        if (form.password && !passRegex.test(form.password)) {
            return "Password must be 8+ chars, contain Upper, Lower, Number, and Special Char.";
        }

        // 2. Username Regex (Min 4 chars, Alphanumeric)
        const userRegex = /^[a-zA-Z0-9]{4,}$/;
        if (form.username && !userRegex.test(form.username)) {
            return "Username must be at least 4 chars and alphanumeric (no spaces).";
        }

        return null; // No errors
    };

    // --- HANDLERS: USER (Patients) ---
    const saveUser = (e) => {
        e.preventDefault();
        setErrorMsg('');

        // Validate
        const error = validateForm(userForm);
        if (error) { setErrorMsg(error); return; }

        if (editingId) {
            api.put(`/admin/users/${editingId}`, userForm)
                .then(() => { resetForms(); refreshAll(); })
                .catch(err => setErrorMsg(err.response?.data?.error || "Update failed"));
        } else {
            api.post('/admin/patients', userForm)
                .then(() => { resetForms(); refreshAll(); })
                .catch(err => setErrorMsg(err.response?.data?.error || "Creation failed"));
        }
    };

    const editUser = (u) => {
        setEditingId(u.id);
        setUserForm({ fullName: u.fullName, username: u.username, password: '' });
        setActiveTab('users');
        setErrorMsg('');
    };

    const deleteUser = (id) => {
        if(window.confirm("Delete User?")) api.delete(`/admin/users/${id}`).then(refreshAll);
    };

    // --- HANDLERS: DOCTORS ---
    const saveDoctor = (e) => {
        e.preventDefault();
        setErrorMsg('');

        // Validate
        const error = validateForm(newDoc);
        if (error) { setErrorMsg(error); return; }

        if (editingId) {
            api.put(`/admin/doctors/${editingId}`, newDoc)
                .then(() => { resetForms(); refreshAll(); })
                .catch(err => setErrorMsg(err.response?.data?.error || "Update failed"));
        } else {
            api.post('/admin/doctors', newDoc)
                .then(() => { resetForms(); refreshAll(); })
                .catch(err => setErrorMsg(err.response?.data?.error || "Creation failed"));
        }
    };

    const editDoctor = (doc) => {
        setEditingId(doc.id);
        setNewDoc({
            fullName: doc.user.fullName,
            username: doc.user.username,
            password: '',
            specialization: doc.specialization,
            departmentId: doc.department.id
        });
        setActiveTab('doctors');
        setErrorMsg('');
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
        setErrorMsg('');
    };

    const deleteDept = (id) => {
        if(window.confirm("Delete this Department?")) {
            api.delete(`/admin/departments/${id}`)
                .then(() => fetchDepartments())
                .catch(err => {
                    const msg = err.response?.data?.error || "Failed to delete department";
                    alert(msg); // Use alert or setErrorMsg(msg)
                });
        }
    };

    const resetForms = () => {
        setEditingId(null);
        setErrorMsg('');
        setUserForm({ fullName: '', username: '', password: '' });
        setNewDoc({ fullName: '', username: '', password: '', specialization: '', departmentId: '' });
        setDeptForm({ name: '', description: '' });
    };

    return (
        <div className="container mt-4">
            <h2 className="text-danger mb-4">Admin Dashboard</h2>

            {/* ERROR ALERT */}
            {errorMsg && <div className="alert alert-danger shadow-sm">{errorMsg}</div>}

            {/* TABS NAVIGATION */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => {setActiveTab('users'); resetForms();}}>Manage Users</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => {setActiveTab('doctors'); resetForms();}}>Manage Doctors</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'departments' ? 'active' : ''}`} onClick={() => {setActiveTab('departments'); resetForms();}}>Manage Departments</button>
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
                                        {u.role !== 'ADMIN' && <button onClick={() => deleteUser(u.id)} className="btn btn-sm btn-danger">Delete</button>}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-light shadow-sm">
                            <div className="card-body">
                                <h5>{editingId ? 'Edit User' : 'Create Patient'}</h5>
                                <form onSubmit={saveUser}>
                                    <input className="form-control mb-2" placeholder="Full Name" value={userForm.fullName} onChange={e => setUserForm({...userForm, fullName: e.target.value})} required />
                                    <input className="form-control mb-2" placeholder="Username (Min 4 chars)" value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} required />
                                    <input className="form-control mb-2" type="password" placeholder={editingId ? "New Password (Optional)" : "Password (Strong)"} value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} />
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
                        <div className="card bg-light shadow-sm">
                            <div className="card-body">
                                <h5>{editingId ? 'Edit Doctor' : 'Create Doctor'}</h5>
                                <form onSubmit={saveDoctor}>
                                    <input className="form-control mb-2" placeholder="Full Name" value={newDoc.fullName} onChange={e => setNewDoc({...newDoc, fullName: e.target.value})} required />
                                    {!editingId && <input className="form-control mb-2" placeholder="Username" value={newDoc.username} onChange={e => setNewDoc({...newDoc, username: e.target.value})} required />}
                                    <input className="form-control mb-2" type="password" placeholder={editingId ? "New Password (Optional)" : "Password (Strong)"} value={newDoc.password} onChange={e => setNewDoc({...newDoc, password: e.target.value})} />
                                    <input className="form-control mb-2" placeholder="Specialization" value={newDoc.specialization} onChange={e => setNewDoc({...newDoc, specialization: e.target.value})} required />
                                    <select className="form-control mb-2" value={newDoc.departmentId} onChange={e => setNewDoc({...newDoc, departmentId: e.target.value})} required>
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
                                        <button onClick={() => editDept(d)} className="btn btn-sm btn-primary me-2">Edit</button>
                                        {/* NEW DELETE BUTTON */}
                                        <button onClick={() => deleteDept(d.id)} className="btn btn-sm btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-light shadow-sm">
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