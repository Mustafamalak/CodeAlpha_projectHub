const Loader = ({ text = "Loading..." }) => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0" }}>
            <div className="loader-card">
                <div className="loader-dots">
                    <div className="loader-dot" />
                    <div className="loader-dot" />
                    <div className="loader-dot" />
                </div>
                <span>{text}</span>
            </div>
        </div>
    );
};

export default Loader;