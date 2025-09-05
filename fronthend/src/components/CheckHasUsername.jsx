import React, { useState, useCallback } from 'react';
import { User, CheckCircle, AlertCircle, Loader, Edit3, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAccountDetails } from '../redux/features/user';

const UserName = () => {
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(null);

    const { user } = useSelector(state => state.user);

    const validateUsername = useCallback((value) => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters long';
        if (value.length > 20) return 'Username must be less than 20 characters';
        if (!usernameRegex.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return null;
    }, []);

    const checkUsernameAvailability = useCallback(async (value) => {
        if (!value || validateUsername(value)) return;

        setIsChecking(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const takenUsernames = ['admin', 'user', 'test', 'demo', 'john', 'jane'];
            const available = !takenUsernames.includes(value.toLowerCase());

            setIsAvailable(available);
            if (!available) {
                setError('This username is already taken');
            } else {
                setError('');
            }
        } catch (err) {
            setError('Failed to check username availability',err);
        } finally {
            setIsChecking(false);
        }
    }, [validateUsername]);

    const handleUsernameChange = useCallback((e) => {
        const value = e.target.value;
        setUsername(value);
        setIsAvailable(null);

        const validationError = validateUsername(value);
        if (validationError) {
            setError(validationError);
        } else {
            setError('');
            setTimeout(() => checkUsernameAvailability(value), 500);
        }
    }, [validateUsername, checkUsernameAvailability]);

    const generateSuggestions = (email) => {
        if (!email) return [];
        const emailPrefix = email.split('@')[0];
        return [
            emailPrefix,
            `${emailPrefix}123`,
            `${emailPrefix}_user`
        ].slice(0, 3);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateUsername(username);
        if (validationError) {
            setError(validationError);
            return;
        }

        if (isAvailable === false) {
            setError('Please choose a different username');
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(updateAccountDetails({ username }));
        } catch (err) {
            setError('Failed to update username. Please try again.',err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {!user?.username && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    {/* Modal */}
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Complete Your Profile</h2>
                                    <p className="text-blue-100 text-sm">Choose a unique username</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Welcome Message */}
                            <div className="text-center mb-6">
                                <p className="text-gray-600">
                                    Welcome! To continue using our platform, please choose a username for your account.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Username Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Choose Username *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={handleUsernameChange}
                                            placeholder="Enter your username"
                                            className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${error
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                    : isAvailable === true
                                                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                                                        : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                            disabled={isLoading}
                                            autoFocus
                                        />

                                        {/* Status Icon */}
                                        <div className="absolute right-3 top-3.5">
                                            {isChecking ? (
                                                <Loader className="w-5 h-5 text-gray-400 animate-spin" />
                                            ) : isAvailable === true ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : isAvailable === false ? (
                                                <X className="w-5 h-5 text-red-500" />
                                            ) : username && !error ? (
                                                <Edit3 className="w-5 h-5 text-blue-500" />
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="mt-2 flex items-center text-sm text-red-600">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Success Message */}
                                    {isAvailable === true && (
                                        <div className="mt-2 flex items-center text-sm text-green-600">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Username is available!
                                        </div>
                                    )}
                                </div>

                                {/* Username Requirements */}
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Username Requirements:</h4>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li className={`flex items-center ${username.length >= 3 ? 'text-green-600' : ''}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${username.length >= 3 ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            3-20 characters long
                                        </li>
                                        <li className={`flex items-center ${/^[a-zA-Z0-9_]*$/.test(username) ? 'text-green-600' : ''}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${/^[a-zA-Z0-9_]*$/.test(username) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            Letters, numbers, and underscores only
                                        </li>
                                        <li className={`flex items-center ${username && !username.includes(' ') ? 'text-green-600' : ''}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${username && !username.includes(' ') ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            No spaces allowed
                                        </li>
                                    </ul>
                                </div>

                                {/* Username Suggestions */}
                                {!username && user?.email && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">Suggested usernames:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {generateSuggestions(user.email).map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => setUsername(suggestion)}
                                                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !username || error || isAvailable === false}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Setting Username...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Continue with Username
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer Note */}
                            <div className="mt-6 text-center">
                                <p className="text-xs text-gray-500">
                                    This username will be visible to other users and cannot be changed later.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserName;