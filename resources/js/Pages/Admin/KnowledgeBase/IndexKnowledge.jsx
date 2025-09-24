import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Pencil, Trash2, Plus, X, Search, Filter, Eye, EyeOff, CheckCircle, AlertTriangle, Info, Tag, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// Komponen Notifikasi Pop-up Modern
const NotificationPopup = ({ notifications, removeNotification }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`
                        min-w-80 max-w-md p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out
                        ${notification.type === 'success' ? 'bg-green-50 border-green-400' : ''}
                        ${notification.type === 'error' ? 'bg-red-50 border-red-400' : ''}
                        ${notification.type === 'info' ? 'bg-blue-50 border-blue-400' : ''}
                        ${notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' : ''}
                        animate-slideIn
                    `}
                >
                    <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                            {notification.type === 'success' && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {notification.type === 'error' && (
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            )}
                            {notification.type === 'info' && (
                                <Info className="w-5 h-5 text-blue-500" />
                            )}
                            {notification.type === 'warning' && (
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className={`
                                text-sm font-medium
                                ${notification.type === 'success' ? 'text-green-800' : ''}
                                ${notification.type === 'error' ? 'text-red-800' : ''}
                                ${notification.type === 'info' ? 'text-blue-800' : ''}
                                ${notification.type === 'warning' ? 'text-yellow-800' : ''}
                            `}>
                                {notification.title}
                            </h4>
                            <p className={`
                                text-xs mt-1
                                ${notification.type === 'success' ? 'text-green-600' : ''}
                                ${notification.type === 'error' ? 'text-red-600' : ''}
                                ${notification.type === 'info' ? 'text-blue-600' : ''}
                                ${notification.type === 'warning' ? 'text-yellow-600' : ''}
                            `}>
                                {notification.message}
                            </p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className={`
                                ml-2 p-1 rounded-full hover:bg-opacity-20 transition-colors
                                ${notification.type === 'success' ? 'text-green-500 hover:bg-green-500' : ''}
                                ${notification.type === 'error' ? 'text-red-500 hover:bg-red-500' : ''}
                                ${notification.type === 'info' ? 'text-blue-500 hover:bg-blue-500' : ''}
                                ${notification.type === 'warning' ? 'text-yellow-500 hover:bg-yellow-500' : ''}
                            `}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Komponen Pagination
const Pagination = ({ currentPage, totalPages, itemsPerPage, totalItems, onPageChange, onItemsPerPageChange }) => {
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-700">
                    Menampilkan <span className="font-medium">{startItem}</span> sampai{' '}
                    <span className="font-medium">{endItem}</span> dari{' '}
                    <span className="font-medium">{totalItems}</span> data
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Per halaman:</label>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Halaman pertama"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Halaman sebelumnya"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {totalPages > 0 && getPageNumbers().map((pageNumber, index) => (
                    pageNumber === '...' ? (
                        <span key={index} className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                        <button
                            key={index}
                            onClick={() => onPageChange(pageNumber)}
                            className={`px-3 py-2 text-sm rounded transition-colors ${currentPage === pageNumber
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {pageNumber}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Halaman selanjutnya"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Halaman terakhir"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default function IndexKnowledge({ knowledge }) {
    const { flash } = usePage().props;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [expandedAnswers, setExpandedAnswers] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Form untuk create dan edit knowledge
    const { data, setData, post, processing, errors, reset } = useForm({
        pertanyaan: '',
        jawaban: '',
        kategori: '',
        entity: [],
        is_active: true
    });

    // Fungsi untuk menambah notifikasi
    const addNotification = (type, title, message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, title, message }]);

        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    // Fungsi untuk menghapus notifikasi
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    // Get unique categories for filter
    const uniqueCategories = [...new Set(knowledge.map(item => item.kategori))].filter(Boolean);

    // Filter knowledge based on search, category, and status
    const filteredKnowledge = knowledge.filter(item => {
        const matchesSearch =
            item.pertanyaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.jawaban.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.kategori.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === '' || item.kategori === filterCategory;

        const matchesStatus = filterStatus === '' ||
            (filterStatus === 'active' && item.is_active) ||
            (filterStatus === 'inactive' && !item.is_active);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Pagination calculations
    const totalItems = filteredKnowledge.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedKnowledge = filteredKnowledge.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterCategory, filterStatus, itemsPerPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            post(`/admin/knowledge/${id}/delete`, {
                onSuccess: () => {
                    addNotification('success', 'Berhasil!', 'Data knowledge berhasil dihapus');
                },
                onError: (errors) => {
                    addNotification('error', 'Gagal!', 'Terjadi kesalahan saat menghapus data');
                    console.error('Delete errors:', errors);
                }
            });
        }
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        post('/admin/knowledge', {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
                addNotification('success', 'Berhasil!', 'Knowledge baru berhasil ditambahkan');
            },
            onError: (errors) => {
                addNotification('error', 'Gagal!', 'Terjadi kesalahan saat menambahkan data');
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        post(`/admin/knowledge/${editItem.id}/update`, {
            onSuccess: () => {
                setShowEditModal(false);
                setEditItem(null);
                reset();
                addNotification('success', 'Berhasil!', 'Data knowledge berhasil diperbarui');
            },
            onError: (errors) => {
                addNotification('error', 'Gagal!', 'Terjadi kesalahan saat memperbarui data');
                console.error('Update errors:', errors);
            }
        });
    };

    const openCreateModal = () => {
        reset();
        setData({
            pertanyaan: '',
            jawaban: '',
            kategori: '',
            entity: [],
            is_active: true
        });
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        reset();
    };

    const openEditModal = (item) => {
        setEditItem(item);
        setData({
            pertanyaan: item.pertanyaan,
            jawaban: item.jawaban,
            kategori: item.kategori,
            entity: item.entity || [],
            is_active: item.is_active !== undefined ? item.is_active : true
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditItem(null);
        reset();
    };

    const toggleAnswer = (id) => {
        setExpandedAnswers(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Fungsi untuk menambah entity
    const addEntity = () => {
        setData('entity', [...data.entity, '']);
    };

    // Fungsi untuk menghapus entity
    const removeEntity = (index) => {
        const newEntities = data.entity.filter((_, i) => i !== index);
        setData('entity', newEntities);
    };

    // Fungsi untuk mengupdate entity
    const updateEntity = (index, value) => {
        const newEntities = [...data.entity];
        newEntities[index] = value;
        setData('entity', newEntities);
    };

    return (
        <>
            <Head title="Kelola Knowledge Base" />
            <AdminLayout>
                <NotificationPopup
                    notifications={notifications}
                    removeNotification={removeNotification}
                />

                <style jsx>{`
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    
                    .animate-slideIn {
                        animation: slideIn 0.3s ease-out;
                    }
                `}</style>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-semibold text-gray-800">Kelola Knowledge Base</h1>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition duration-200"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Knowledge
                        </button>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari pertanyaan, jawaban, atau kategori..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="">Semua Kategori</option>
                                {uniqueCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="inactive">Tidak Aktif</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-sm border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="px-4 py-3 border-b font-medium text-gray-700">#</th>
                                    <th className="px-4 py-3 border-b font-medium text-gray-700">Pertanyaan</th>
                                    <th className="px-4 py-3 border-b font-medium text-gray-700">Jawaban</th>
                                    <th className="px-4 py-3 border-b font-medium text-gray-700">Kategori</th>
                                    <th className="px-4 py-3 border-b font-medium text-gray-700">Entity</th>
                                    <th className="px-4 py-3 border-b font-medium text-gray-700">Status</th>
                                    <th className="px-4 py-3 border-b font-medium text-gray-700 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedKnowledge.length > 0 ? (
                                    paginatedKnowledge.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 border-b text-gray-600">
                                                {startIndex + index + 1}
                                            </td>
                                            <td className="px-4 py-3 border-b">
                                                <div className="font-medium text-gray-800">{item.pertanyaan}</div>
                                            </td>
                                            <td className="px-4 py-3 border-b">
                                                <div className="relative">
                                                    <div className="text-gray-600">
                                                        {expandedAnswers[item.id] ? item.jawaban : truncateText(item.jawaban)}
                                                    </div>
                                                    {item.jawaban.length > 100 && (
                                                        <button
                                                            onClick={() => toggleAnswer(item.id)}
                                                            className="mt-1 inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            {expandedAnswers[item.id] ? (
                                                                <>
                                                                    <EyeOff className="w-3 h-3 mr-1" />
                                                                    Sembunyikan
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Eye className="w-3 h-3 mr-1" />
                                                                    Lihat selengkapnya
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 border-b">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    {item.kategori}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 border-b">
                                                <div className="flex flex-wrap gap-1">
                                                    {item.entity && item.entity.length > 0 ? (
                                                        item.entity.map((entity, idx) => (
                                                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                <Tag className="w-3 h-3 mr-1" />
                                                                {entity}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 border-b">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {item.is_active ? (
                                                        <>
                                                            <ToggleRight className="w-3 h-3 mr-1" />
                                                            Aktif
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ToggleLeft className="w-3 h-3 mr-1" />
                                                            Tidak Aktif
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 border-b text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(item)}
                                                        className="inline-flex items-center p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="inline-flex items-center p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-gray-500 py-8">
                                            {searchTerm || filterCategory || filterStatus ?
                                                'Tidak ada data yang sesuai dengan pencarian.' :
                                                'Tidak ada data.'
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Component */}
                    {totalItems > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalItems}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    )}
                </div>

                {/* Modal Create Knowledge */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-lg font-semibold text-gray-800">Tambah Knowledge</h2>
                                <button
                                    onClick={closeCreateModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pertanyaan *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.pertanyaan}
                                            onChange={(e) => setData('pertanyaan', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Masukkan pertanyaan..."
                                            required
                                        />
                                        {errors.pertanyaan && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pertanyaan}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Jawaban *
                                        </label>
                                        <textarea
                                            value={data.jawaban}
                                            onChange={(e) => setData('jawaban', e.target.value)}
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
                                            placeholder="Masukkan jawaban..."
                                            required
                                        />
                                        {errors.jawaban && (
                                            <p className="mt-1 text-sm text-red-600">{errors.jawaban}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kategori *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.kategori}
                                            onChange={(e) => setData('kategori', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Masukkan kategori..."
                                            required
                                        />
                                        {errors.kategori && (
                                            <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            Status
                                            <div className="ml-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setData('is_active', !data.is_active)}
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${data.is_active
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                        }`}
                                                >
                                                    {data.is_active ? (
                                                        <>
                                                            <ToggleRight className="w-3 h-3 mr-1" />
                                                            Aktif
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ToggleLeft className="w-3 h-3 mr-1" />
                                                            Tidak Aktif
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Entity (Opsional)
                                        </label>
                                        <div className="space-y-2">
                                            {data.entity.map((entity, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={entity}
                                                        onChange={(e) => updateEntity(index, e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="Masukkan entity..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEntity(index)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addEntity}
                                                className="inline-flex items-center px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                                            >
                                                <Plus className="w-4 h-4 mr-1" />
                                                Tambah Entity
                                            </button>
                                        </div>
                                        {errors.entity && (
                                            <p className="mt-1 text-sm text-red-600">{errors.entity}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={closeCreateModal}
                                        className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Edit Knowledge */}
                {showEditModal && editItem && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-lg font-semibold text-gray-800">Edit Knowledge</h2>
                                <button
                                    onClick={closeEditModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pertanyaan *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.pertanyaan}
                                            onChange={(e) => setData('pertanyaan', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Masukkan pertanyaan..."
                                            required
                                        />
                                        {errors.pertanyaan && (
                                            <p className="mt-1 text-sm text-red-600">{errors.pertanyaan}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Jawaban *
                                        </label>
                                        <textarea
                                            value={data.jawaban}
                                            onChange={(e) => setData('jawaban', e.target.value)}
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
                                            placeholder="Masukkan jawaban..."
                                            required
                                        />
                                        {errors.jawaban && (
                                            <p className="mt-1 text-sm text-red-600">{errors.jawaban}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kategori *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.kategori}
                                            onChange={(e) => setData('kategori', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Masukkan kategori..."
                                            required
                                        />
                                        {errors.kategori && (
                                            <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            Status
                                            <div className="ml-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setData('is_active', !data.is_active)}
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${data.is_active
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                        }`}
                                                >
                                                    {data.is_active ? (
                                                        <>
                                                            <ToggleRight className="w-3 h-3 mr-1" />
                                                            Aktif
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ToggleLeft className="w-3 h-3 mr-1" />
                                                            Tidak Aktif
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Entity (Opsional)
                                        </label>
                                        <div className="space-y-2">
                                            {data.entity.map((entity, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={entity}
                                                        onChange={(e) => updateEntity(index, e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="Masukkan entity..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEntity(index)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addEntity}
                                                className="inline-flex items-center px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                                            >
                                                <Plus className="w-4 h-4 mr-1" />
                                                Tambah Entity
                                            </button>
                                        </div>
                                        {errors.entity && (
                                            <p className="mt-1 text-sm text-red-600">{errors.entity}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </AdminLayout>
        </>
    );
}
