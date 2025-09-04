import React from "react";

const ErrorPage = () => {
    return (
        <div style={styles.container}>
            <img
                src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
                alt="404 Not Found"
                style={styles.image}
            />
            <h1 style={styles.title}>404</h1>
            <p style={styles.message}>Oops! The page you are looking for does not exist.</p>
            <a href="/" style={styles.link}>Go back home</a>
        </div>
    );
};

const styles = {
    container: {
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#f9fafb",
    },
    image: {
        maxWidth: "150px",
        width: "30vw",
        height: "auto",
        marginBottom: "20px",
    },
    title: {
        fontSize: "8vw",
        margin: "0",
        fontWeight: "700",
        color: "#4b5563",
    },
    message: {
        fontSize: "1.5rem",
        color: "#6b7280",
        marginBottom: "20px",
        maxWidth: "400px",
    },
    link: {
        fontSize: "1.125rem",
        color: "#3b82f6",
        textDecoration: "none",
        fontWeight: "600",
    },
};

export default ErrorPage;