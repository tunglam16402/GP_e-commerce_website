import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiContactEmail } from 'apis';
import { Breadcrumbs } from 'components';
import { useParams } from 'react-router-dom';

const Contact = () => {
    const { current } = useSelector((state) => state.user);
    const { contact } = useParams();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            message: '',
        },
    });

    useEffect(() => {
        if (current) {
            setValue('firstname', current.firstname || '');
            setValue('lastname', current.lastname || '');
            setValue('email', current.email || '');
        }
    }, [current, setValue]);

    const [status, setStatus] = useState({ message: '', type: '' });

    const onSubmit = async (data) => {
        setStatus({ message: 'Sending...', type: 'loading' });

        try {
            const response = await apiContactEmail(data);

            if (response?.success) {
                toast.success('Message sent successfully!');
                setStatus({ message: 'Message sent successfully!', type: 'success' });
            } else {
                toast.error('Failed to send message!');
                setStatus({ message: 'Failed to send message!', type: 'error' });
            }
        } catch (error) {
            toast.error('Error! Unable to send message.');
            setStatus({ message: 'Error! Unable to send message.', type: 'error' });
        }
    };

    return (
        <div className="w-full px-4">
            {/* Header */}
            <div className="h-[86px] flex flex-col justify-center items-center bg-gray-100">
                <div className=" w-main">
                    <h3 className="font-semibold text-[26px] uppercase">Contact</h3>
                    <Breadcrumbs contact={contact}></Breadcrumbs>
                </div>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-main mx-auto mt-8 p-8 bg-white shadow-lg rounded-lg flex flex-col gap-6"
            >
                {/* Input fields */}
                {[
                    { label: 'First Name', id: 'firstname' },
                    { label: 'Last Name', id: 'lastname' },
                    { label: 'Email Address', id: 'email', type: 'email' },
                ].map((field) => (
                    <div key={field.id} className="flex flex-col">
                        <label className="font-medium text-gray-700">{field.label}</label>
                        <input
                            type={field.type || 'text'}
                            {...register(field.id, { required: `${field.label} is required` })}
                            className="w-full p-2 border rounded"
                        />
                        {errors[field.id] && <span className="text-red-500">{errors[field.id].message}</span>}
                    </div>
                ))}

                {/* Message */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700">Message</label>
                    <textarea
                        {...register('message', { required: 'Message is required' })}
                        className="w-full p-2 border rounded"
                        placeholder="Enter your message..."
                        rows="5"
                    />
                    {errors.message && <span className="text-red-500">{errors.message.message}</span>}
                </div>

                {/* Submit Button */}
                {isDirty && (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-red-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                        >
                            {status.type === 'loading' ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                )}

                {/* Status Message */}
                {status.message && (
                    <p
                        className={`mt-4 text-center text-lg font-medium ${
                            status.type === 'success'
                                ? 'text-green-500'
                                : status.type === 'error'
                                ? 'text-red-500'
                                : 'text-blue-500'
                        }`}
                    >
                        {status.message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default Contact;
