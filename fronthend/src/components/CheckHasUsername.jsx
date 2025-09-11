import React, { useState, useCallback } from 'react';
import { User, CheckCircle, AlertCircle, Loader, Edit3, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAccountDetails } from '../redux/features/user';
import { useAppearance } from '../hooks/appearances';

const UserName = () => {
    const { appearanceSettings } = useAppearance();
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(null);
    const [focusedSuggestion, setFocusedSuggestion] = useState(-1);

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
            setError('Failed to check username availability', err);
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

    const handleKeyDown = (e) => {
        const suggestions = generateSuggestions(user?.email);
        if (!suggestions.length) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedSuggestion(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedSuggestion(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
                break;
            case 'Enter':
                if (focusedSuggestion >= 0) {
                    e.preventDefault();
                    setUsername(suggestions[focusedSuggestion]);
                    setFocusedSuggestion(-1);
                }
                break;
            case 'Escape':
                setFocusedSuggestion(-1);
                break;
            default:
                break;
        }
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
            setError('Failed to update username. Please try again.', err);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestions = generateSuggestions(user?.email);

    return (
        <div>
            {!user?.username && (
                <div
                    className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        fontFamily: 'var(--font-family)'
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="username-title"
                    aria-describedby="username-description"
                >
                    {/* Modal */}
                    <div
                        className="rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all"
                        style={{
                            backgroundColor: 'var(--color-bg-primary)',
                            transitionDuration: 'var(--animation-duration)'
                        }}
                    >
                        {/* Header */}
                        <div
                            className="text-white p-6 rounded-t-2xl"
                            style={{
                                background: 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))',
                                padding: 'var(--section-gap)'
                            }}
                        >
                            <div
                                className="flex items-center space-x-3"
                                style={{ gap: 'var(--spacing-unit)' }}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                >
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2
                                        id="username-title"
                                        className="text-xl font-bold"
                                        style={{
                                            fontSize: 'var(--font-size-xl)',
                                            fontFamily: 'var(--font-family)'
                                        }}
                                    >
                                        Complete Your Profile
                                    </h2>
                                    <p
                                        className="text-sm"
                                        style={{
                                            color: 'rgba(255, 255, 255, 0.8)',
                                            fontSize: 'var(--font-size-sm)'
                                        }}
                                    >
                                        Choose a unique username
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            className="p-6"
                            style={{ padding: 'var(--section-gap)' }}
                        >
                            {/* Welcome Message */}
                            <div
                                className="text-center mb-6"
                                style={{ marginBottom: 'var(--section-gap)' }}
                            >
                                <p
                                    id="username-description"
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: 'var(--font-size-base)'
                                    }}
                                >
                                    Welcome! To continue using our platform, please choose a username for your account.
                                </p>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                                style={{ gap: 'var(--section-gap)' }}
                                role="form"
                                aria-label="Username selection form"
                            >
                                {/* Username Input */}
                                <div>
                                    <label
                                        htmlFor="username-input"
                                        className="block text-sm font-medium mb-2"
                                        style={{
                                            color: 'var(--color-text-primary)',
                                            fontSize: 'var(--font-size-sm)',
                                            fontFamily: 'var(--font-family)',
                                            marginBottom: 'var(--spacing-unit)'
                                        }}
                                    >
                                        Choose Username *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="username-input"
                                            type="text"
                                            value={username}
                                            onChange={handleUsernameChange}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Enter your username"
                                            className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none transition-all`}
                                            style={{
                                                padding: 'var(--spacing-unit)',
                                                paddingRight: '3rem',
                                                borderColor: error
                                                    ? 'var(--color-error)'
                                                    : isAvailable === true
                                                        ? 'var(--color-success)'
                                                        : 'var(--color-border)',
                                                backgroundColor: error
                                                    ? 'rgba(239, 68, 68, 0.05)'
                                                    : isAvailable === true
                                                        ? 'rgba(34, 197, 94, 0.05)'
                                                        : 'var(--color-bg-secondary)',
                                                color: 'var(--color-text-primary)',
                                                fontSize: 'var(--font-size-base)',
                                                fontFamily: 'var(--font-family)',
                                                transitionDuration: 'var(--animation-duration)'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = 'var(--accent-color)';
                                                e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                                            }}
                                            onBlur={(e) => {
                                                if (!error && isAvailable !== true) {
                                                    e.target.style.borderColor = 'var(--color-border)';
                                                }
                                                e.target.style.boxShadow = 'none';
                                            }}
                                            disabled={isLoading}
                                            autoFocus
                                            aria-describedby={error ? "username-error" : isAvailable === true ? "username-success" : undefined}
                                            aria-invalid={!!error}
                                            autoComplete="username"
                                            spellCheck="false"
                                        />

                                        {/* Status Icon */}
                                        <div
                                            className="absolute right-3 top-3.5"
                                            style={{ right: 'var(--spacing-unit)' }}
                                            aria-hidden="true"
                                        >
                                            {isChecking ? (
                                                <Loader
                                                    className="w-5 h-5 animate-spin"
                                                    style={{
                                                        color: 'var(--color-text-secondary)',
                                                        animationDuration: appearanceSettings.reducedMotion ? '0s' : '1s'
                                                    }}
                                                />
                                            ) : isAvailable === true ? (
                                                <CheckCircle
                                                    className="w-5 h-5"
                                                    style={{ color: 'var(--color-success)' }}
                                                />
                                            ) : isAvailable === false ? (
                                                <X
                                                    className="w-5 h-5"
                                                    style={{ color: 'var(--color-error)' }}
                                                />
                                            ) : username && !error ? (
                                                <Edit3
                                                    className="w-5 h-5"
                                                    style={{ color: 'var(--accent-color)' }}
                                                />
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div
                                            id="username-error"
                                            className="mt-2 flex items-center text-sm"
                                            style={{
                                                color: 'var(--color-error)',
                                                fontSize: 'var(--font-size-sm)',
                                                marginTop: 'var(--spacing-unit)',
                                                gap: 'calc(var(--spacing-unit) * 0.5)'
                                            }}
                                            role="alert"
                                            aria-live="polite"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Success Message */}
                                    {isAvailable === true && (
                                        <div
                                            id="username-success"
                                            className="mt-2 flex items-center text-sm"
                                            style={{
                                                color: 'var(--color-success)',
                                                fontSize: 'var(--font-size-sm)',
                                                marginTop: 'var(--spacing-unit)',
                                                gap: 'calc(var(--spacing-unit) * 0.5)'
                                            }}
                                            role="status"
                                            aria-live="polite"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Username is available!
                                        </div>
                                    )}
                                </div>

                                {/* Username Requirements */}
                                <div
                                    className="p-4 rounded-xl"
                                    style={{
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        padding: 'var(--spacing-unit)'
                                    }}
                                >
                                    <h4
                                        className="text-sm font-medium mb-2"
                                        style={{
                                            color: 'var(--color-text-primary)',
                                            fontSize: 'var(--font-size-sm)',
                                            fontFamily: 'var(--font-family)',
                                            marginBottom: 'var(--spacing-unit)'
                                        }}
                                    >
                                        Username Requirements:
                                    </h4>
                                    <ul
                                        className="text-xs space-y-1"
                                        style={{
                                            fontSize: 'var(--font-size-xs)',
                                            gap: 'calc(var(--spacing-unit) * 0.5)'
                                        }}
                                        role="list"
                                    >
                                        <li
                                            className={`flex items-center`}
                                            style={{
                                                color: username.length >= 3 ? 'var(--color-success)' : 'var(--color-text-secondary)',
                                                gap: 'var(--spacing-unit)'
                                            }}
                                            role="listitem"
                                        >
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full`}
                                                style={{
                                                    backgroundColor: username.length >= 3 ? 'var(--color-success)' : 'var(--color-border)'
                                                }}
                                            />
                                            3-20 characters long
                                        </li>
                                        <li
                                            className={`flex items-center`}
                                            style={{
                                                color: /^[a-zA-Z0-9_]*$/.test(username) ? 'var(--color-success)' : 'var(--color-text-secondary)',
                                                gap: 'var(--spacing-unit)'
                                            }}
                                            role="listitem"
                                        >
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full`}
                                                style={{
                                                    backgroundColor: /^[a-zA-Z0-9_]*$/.test(username) ? 'var(--color-success)' : 'var(--color-border)'
                                                }}
                                            />
                                            Letters, numbers, and underscores only
                                        </li>
                                        <li
                                            className={`flex items-center`}
                                            style={{
                                                color: username && !username.includes(' ') ? 'var(--color-success)' : 'var(--color-text-secondary)',
                                                gap: 'var(--spacing-unit)'
                                            }}
                                            role="listitem"
                                        >
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full`}
                                                style={{
                                                    backgroundColor: username && !username.includes(' ') ? 'var(--color-success)' : 'var(--color-border)'
                                                }}
                                            />
                                            No spaces allowed
                                        </li>
                                    </ul>
                                </div>

                                {/* Username Suggestions */}
                                {!username && user?.email && suggestions.length > 0 && (
                                    <div>
                                        <h4
                                            className="text-sm font-medium mb-3"
                                            style={{
                                                color: 'var(--color-text-primary)',
                                                fontSize: 'var(--font-size-sm)',
                                                fontFamily: 'var(--font-family)',
                                                marginBottom: 'var(--spacing-unit)'
                                            }}
                                        >
                                            Suggested usernames:
                                        </h4>
                                        <div
                                            className="flex flex-wrap gap-2"
                                            style={{ gap: 'var(--spacing-unit)' }}
                                            role="listbox"
                                            aria-label="Username suggestions"
                                        >
                                            {suggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        setUsername(suggestion);
                                                        setFocusedSuggestion(-1);
                                                    }}
                                                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all`}
                                                    style={{
                                                        backgroundColor: focusedSuggestion === index
                                                            ? 'var(--color-accent-bg)'
                                                            : 'var(--color-bg-secondary)',
                                                        color: focusedSuggestion === index
                                                            ? 'var(--accent-color)'
                                                            : 'var(--color-text-primary)',
                                                        borderColor: focusedSuggestion === index
                                                            ? 'var(--accent-color)'
                                                            : 'var(--color-border)',
                                                        fontSize: 'var(--font-size-sm)',
                                                        padding: 'calc(var(--spacing-unit) * 0.75) var(--spacing-unit)',
                                                        transitionDuration: 'var(--animation-duration)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (focusedSuggestion !== index) {
                                                            e.target.style.backgroundColor = 'var(--color-hover)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (focusedSuggestion !== index) {
                                                            e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                                                        }
                                                    }}
                                                    role="option"
                                                    aria-selected={focusedSuggestion === index}
                                                    tabIndex={focusedSuggestion === index ? 0 : -1}
                                                    aria-label={`Use suggested username: ${suggestion}`}
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                        <p
                                            className="text-xs mt-2"
                                            style={{
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--font-size-xs)',
                                                marginTop: 'var(--spacing-unit)'
                                            }}
                                        >
                                            Use arrow keys to navigate suggestions, Enter to select
                                        </p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !username || error || isAvailable === false}
                                    className="w-full text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                                    style={{
                                        background: (!isLoading && username && !error && isAvailable !== false)
                                            ? 'linear-gradient(135deg, var(--accent-color), var(--color-accent-hover))'
                                            : 'var(--color-text-secondary)',
                                        opacity: (!isLoading && username && !error && isAvailable !== false) ? 1 : 0.5,
                                        cursor: (!isLoading && username && !error && isAvailable !== false) ? 'pointer' : 'not-allowed',
                                        fontSize: 'var(--font-size-base)',
                                        fontFamily: 'var(--font-family)',
                                        padding: 'var(--spacing-unit) calc(var(--spacing-unit) * 1.5)',
                                        gap: 'var(--spacing-unit)',
                                        transitionDuration: 'var(--animation-duration)'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isLoading && username && !error && isAvailable !== false) {
                                            e.target.style.transform = 'translateY(-1px)';
                                            e.target.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.15)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isLoading && username && !error && isAvailable !== false) {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                                        }
                                    }}
                                    aria-label={isLoading ? "Setting username..." : "Continue with chosen username"}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader
                                                className="w-5 h-5 animate-spin"
                                                style={{
                                                    animationDuration: appearanceSettings.reducedMotion ? '0s' : '1s'
                                                }}
                                            />
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
                            <div
                                className="mt-6 text-center"
                                style={{ marginTop: 'var(--section-gap)' }}
                            >
                                <p
                                    className="text-xs"
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: 'var(--font-size-xs)'
                                    }}
                                >
                                    This username will be visible to other users and cannot be changed later.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Live Region for Screen Reader Announcements */}
                    <div
                        className="sr-only"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {isChecking && "Checking username availability"}
                        {isAvailable === true && "Username is available"}
                        {isAvailable === false && "Username is not available"}
                        {error && `Error: ${error}`}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserName;
