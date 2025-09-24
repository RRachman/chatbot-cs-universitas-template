// resources/js/Pages/Admin/KnowledgeBase/CreateKnowledge.jsx

import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CreateKnowledge() {
    const { data, setData, post, processing, errors } = useForm({
        pertanyaan: '',
        jawaban: '',
        kategori: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.knowledge.store'));
    };

    return (
        <>
            <Head title="Tambah Knowledge" />
            <AdminLayout>
                <div className="bg-white p-6 rounded shadow">
                    <h1 className="text-xl font-bold mb-4">Tambah Knowledge</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-medium">Pertanyaan</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={data.pertanyaan}
                                onChange={(e) => setData('pertanyaan', e.target.value)}
                            />
                            {errors.pertanyaan && <div className="text-red-500 text-sm">{errors.pertanyaan}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium">Jawaban</label>
                            <textarea
                                className="w-full border rounded p-2"
                                value={data.jawaban}
                                onChange={(e) => setData('jawaban', e.target.value)}
                            ></textarea>
                            {errors.jawaban && <div className="text-red-500 text-sm">{errors.jawaban}</div>}
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium">Kategori</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                            />
                            {errors.kategori && <div className="text-red-500 text-sm">{errors.kategori}</div>}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Link href={route('admin.knowledge.index')} className="px-4 py-2 bg-gray-300 rounded">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded"
                                disabled={processing}
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </AdminLayout>
        </>
    );
}
