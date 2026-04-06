function Card({ children, className = "" }) {
    return (
        <div
            className={`bg-[var(--surface)] 
                  border border-[var(--border)] 
                  rounded p-3
                  ${className}`}
        >
            {children}
        </div>
    );
}

export default Card;