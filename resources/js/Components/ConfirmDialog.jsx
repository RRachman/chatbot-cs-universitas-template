export default function ConfirmDialog({ message, onCancel, onConfirm }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
                <p className="mb-4">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded">Batal</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Yakin</button>
                </div>
            </div>
        </div>
    );
}
