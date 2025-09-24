import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function IndexUser({ users, roles }) {
    const [editingUser, setEditingUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data, setData, post, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: '',
    });

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        setIsModalOpen(true);
    };

    const startEdit = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role_id: user.role_id,
            status: user.status,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        reset();
        setEditingUser(null);
        setIsModalOpen(false);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingUser) {
            // Gunakan POST dengan action parameter untuk update
            post(`/admin/users/${editingUser.id}/update`, {
                onSuccess: () => {
                    toast.success('User berhasil diperbarui');
                    closeModal();
                },
                onError: () => {
                    toast.error('Gagal memperbarui user');
                },
            });
        } else {
            // Gunakan POST method untuk create
            post(route('admin.users.store'), {
                onSuccess: () => {
                    toast.success('User berhasil ditambahkan');
                    closeModal();
                },
                onError: () => {
                    toast.error('Gagal menambahkan user');
                },
            });
        }
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmed = () => {
        // Gunakan POST dengan action parameter untuk delete
        post(`/admin/users/${userToDelete.id}/delete`, {
            onSuccess: () => {
                toast.success('User berhasil dihapus');
                setShowDeleteModal(false);
                setUserToDelete(null);
            },
            onError: () => {
                toast.error('Gagal menghapus user');
            },
        });
    };

    return (
        <>
            <Head title="Kelola User" />
            <AdminLayout>
                <div className={`p-6 transition-all duration-300 ${isModalOpen || showDeleteModal ? 'blur-sm' : ''}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Kelola User</h1>
                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            + Tambah User
                        </button>
                    </div>

                    {/* Modern Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{user.role?.nama_role}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                                                    {user.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => startEdit(user)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(user)}
                                                    className="text-red-600 hover:text-red-900 font-medium transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Modal Form Tambah/Edit */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">
                                {editingUser ? 'Edit User' : 'Tambah User'}
                            </h2>
                            <form onSubmit={submit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                        <input
                                            type="text"
                                            placeholder="Masukkan nama"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            placeholder="Masukkan email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input
                                            type="password"
                                            placeholder="Masukkan password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required={!editingUser}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <select
                                            value={data.role_id}
                                            onChange={(e) => setData('role_id', e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Pilih Role</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.nama_role}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {editingUser && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="aktif">Aktif</option>
                                                <option value="nonaktif">Tidak Aktif</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end mt-6 space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        {editingUser ? 'Update' : 'Tambah'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Konfirmasi Delete */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4 text-red-600">Konfirmasi Hapus</h2>
                            <p className="mb-6 text-gray-700">
                                Apakah kamu yakin ingin menghapus user{' '}
                                <strong className="text-gray-900">{userToDelete?.name}</strong>?
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setUserToDelete(null);
                                    }}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDeleteConfirmed}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    Yakin
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}