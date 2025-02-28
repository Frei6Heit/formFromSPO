import React from "react";

const AlreadySubmitted = () => {
    return (
        <div className="center-container">
            <div className="message-box">
                <h1>Вы уже заполнили форму сегодня.</h1>
                <p>Попробуйте снова через 24 часа.</p>
            </div>
        </div>
    );
};

export default AlreadySubmitted;