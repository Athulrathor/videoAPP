function Input({ className = "", ...props }) {
    return (
        <input
            className={`px-3 py-1.5 text-sm w-full
                  bg-[var(--bg)] 
                  border border-[var(--border)] 
                  rounded outline-none
                  focus:ring-2 focus:ring-[var(--primary)]
                  ${className}`}
            {...props}
        />
    );
}

export default Input;