const Loader = ({ text = "Loading..." }) => {
    return (
        <div className="loader-card">
            <div className="loader-dot" />
            <span>{text}</span>
        </div>
    );
};

export default Loader;