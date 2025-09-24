export default function InputError({ message, className = '', ...props }) {
    if (!message) return null;

    // Kalau message array, gabungkan jadi string
    const errorMessage = Array.isArray(message) ? message.join(' ') : message;

    return (
        <p
            {...props}
            className={'text-sm text-red-600 ' + className}
        >
            {errorMessage}
        </p>
    );
}
