

const NotFound = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>404 - Страница не найдена</h1>
            <p style={styles.message}>К сожалению, запрашиваемая страница не существует.</p>
            <a href="/2024-2-VK-EDU-Frontend-A-Fedorova/" style={styles.link}>Вернуться на главную страницу</a>
        </div>
    );
};


const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: '3rem',
        marginBottom: '1rem',
        lineHeight: 'normal',
    },
    message: {
        fontSize: '1.5rem',
        marginBottom: '2rem',
    },
    link: {
        fontSize: '1.25rem',
        color: '#007bff',
        textDecoration: 'none',
    },
};

export default NotFound;