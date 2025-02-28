import React, { useEffect, useState } from "react";
import queryString from 'query-string';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate для перенаправления
import '../styles/form.css';

// Данные вопросов с уточняющими вопросами
const questionsData = {
    students: {
        questions: [
            {
                text: "Нуждаетесь ли вы в дополнительных мероприятиях в колледже?",
                key: "events",
                followUp: {
                    yes: "В каких именно мероприятиях вы нуждаетесь?",
                    no: "Почему вы не нуждаетесь в дополнительных мероприятиях?"
                }
            },
            {
                text: "Удовлетворены ли вы скоростью решения вопросов администрацией колледжа?",
                key: "administration",
                followUp: {
                    yes: "Что именно Вас устраивает в скорости решения вопросов?",
                    no: "Что именно Вас не устраивает в скорости решения вопросов?"
                }
            },
            {
                text: "Удовлетворены ли Вы сайтиом колледжа?",
                key: "website",
                followUp: {
                    yes: "Что именно Вас устраивает в официальном сайте колледжа?",
                    no: "Что именно Вас не устраивает в официальном сайте колледжа?"
                }
            },
            {
                text: "Удловлетворены ли Вы ведением наших социальных сетей?",
                key: "social",
                followUp: {
                    yes: "Что именно Вас устраивает в ведении социальных сетей и чатов?",
                    no: "Что именно Вас не устраивает в ведении социальных сетей и чатов?"
                }
            },
            {
                text: "Удовлетворены ли вы работой буфета?",
                key: "cafeteria",
                followUp: {
                    yes: "Что именно Вас устраивает в работе буфета?",
                    no: "Что именно Вас не устраивает в работе буфета?"
                }
            },
            {
                text: "Удовлетворены ли Вы учебными аудиториями?",
                key: "audience",
                followUp: {
                    yes: "Что именно Вас устраивает в аудиториях?",
                    no: "Что именно Вас не устраивает в аудиториях?"
                }
            },
            {
                text: "Удовлетворены ли Вы санузлами в колледже?",
                key: "bathrooms",
                followUp: {
                    yes: "Что именно Вас устраивает в санузлах?",
                    no: "Что именно Вас не устраивает в санузлах?"
                }
            },
            {
                text: "Удовлетворены ли Вы помещениями общего пользования в колледже?",
                key: "public_premises",
                followUp: {
                    yes: "Что именно Вас устраивает в помещениях общего пользования?",
                    no: "Что именно Вас не устраивает в помещаениях общего пользования?"
                }
            },
            {
                text: "Удовлетворены ли Вы материально-техническим оснащением помещений?",
                key: "equipment",
                followUp: {
                    yes: "Что именно Вас устраивает в материально-техническом оснащением помещений?",
                    no: "Что именно Вас не устраивает в материально-техническом оснащением помещений?"
                }
            },
            {
                text: "Удовлетворены ли Вы работой охраны колледжа?",
                key: "security",
                followUp: {
                    yes: "Что именно Вас устраивает в работе охраны колледжа?",
                    no: "Что именно Вас не устраивает в работе охраны колледжа?"
                }
            },
            {
                text: "Удовлетворены ли Вы организацией учебного процесса?",
                key: "educational",
                followUp: {
                    yes: "Что именно Вас устраивает в организации учебного процесса?",
                    no: "Что именно Вас не устраивает в организации учебного процесса?"
                }
            }
        ]
    },
    teachers: {
        questions: [
            {
                text: "Всегда ли доступна Вам вся необходимая информация, касающаяся учебного процесса?",
                key: "info",
                followUp: {
                    yes: "Что именно Вам нравится в доступности информации?",
                    no: "С какими проблемами Вы сталкиваетесь при получении информации?"
                }
            },
            {
                text: "Нуждаетесь ли Вы лично в повышении квалификации?",
                key: "professional_development",
                followUp: {
                    yes: "В каких именно областях Вы хотели бы повысить квалификацию?",
                    no: "Почему Вы не нуждаетесь в повышении квалификации?"
                }
            },
            {
                text: "Удовлетворены ли Вы учебными аудиториями?",
                key: "audience",
                followUp: {
                    yes: "Что именно Вас устраивает в аудиториях?",
                    no: "Что именно Вас не устраивает в аудиториях?"
                }
            },
            {
                text: "Удовлетворены ли Вы санузлами?",
                key: "bathrooms",
                followUp: {
                    yes: "Что именно Вас устраивает в санузлах?",
                    no: "Что именно Вас не устраивает в аудиториях?"
                }
            },
            {
                text: "Удовлетворены ли Вы помещениями общего пользования в колледже?",
                key: "public_premises",
                followUp: {
                    yes: "Что именно Вас устраивает в помещениях общего пользования?",
                    no: "Что именно Вас не устраивает в помещаениях общего пользования?"
                }
            },
            {
                text: "Удовлетворены ли Вы материально-техническим оснащением помещений?",
                key: "equipment",
                followUp: {
                    yes: "Что именно Вас устраивает в материально-техническом оснащением помещений?",
                    no: "Что именно Вас не устраивает в материально-техническом оснащением помещений?"
                }
            },
            {
                text: "Всегда ли доступна Вся необходимая информация, касающаяся планируемых мероприятиях в колледже?",
                key: "info_events",
                followUp: {
                    yes: "Что именно Вас устраивает в доступе информации?",
                    no: "Что именно Вас не устраивает в доступе информации?"
                }
            },
            {
                text: "Удовлетворены ли Вы организацией учебного процесса?",
                key: "educational",
                followUp: {
                    yes: "Что именно Вас устраивает в учебном процессе?",
                    no: "Что именно Вас не устраивает в учебном процессе?"
                }
            },
            {
                text: "Удовлетворены ли Вы повседневной педагогической практикой?",
                key: "pedagogical",
                followUp: {
                    yes: "Что именно Вас не устраивает в повседневной педагогической практике?",
                    no: "Что именно Вас устраивает в повседневной педагогической практике?"
                }
            }
        ]
    },
    parents: {
        questions: [
            {
                text: "Комфортно ли ощущает Ваш ребенок себя в колледже?",
                key: "child_comfort",
                followUp: {
                    yes: "Что именно способствует комфорту Вашего ребенка?",
                    no: "Что именно вызывает дискомфорт у Вашего ребенка?"
                }
            },
            {
                text: "Всегда ли при необходимости Вы можете обратиться в колледж за советом?",
                key: "consultation_access",
                followUp: {
                    yes: "Что именно Вам нравится в доступности консультаций?",
                    no: "С какими проблемами Вы сталкиваетесь при обращении за советом?"
                }
            },
            {
                text: "Удовлетворены ли Вы спортивным залом колледжа?",
                key: "gym",
                followUp: {
                    yes: "Что именно Вас устраивает в спортивном зале?",
                    no: "Что именно Вас не устраивает в спортивном зале?"
                }
            },
            {
                text: "Удовлетворены ли Вы помещениями общего пользования в колледже?",
                key: "public_premises",
                followUp: {
                    yes: "Что именно Вас устраивает в помещениях общего пользования?",
                    no: "Что именно Вас не устраивает в помещаениях общего пользования?"
                }
            },
            {
                text: "Удовлетворены ли Вы материально-техническим оснащением помещений?",
                key: "equipment",
                followUp: {
                    yes: "Что именно Вас устраивает в материально-техническом оснащением помещений?",
                    no: "Что именно Вас не устраивает в материально-техническом оснащением помещений?"
                }
            },
            {
                text: "Удовлетворены ли Вы проведением родительских собраний?",
                key: "parent_meetings",
                followUp: {
                    yes: "Что именно Вам нравится в родительских собраниях?",
                    no: "Что именно Вас не устраивает в родительских собраниях?"
                }
            },
            {
                text: "Испытывает ли Ваш ребенок трудности в процессе обучения?",
                key: "difficulties_child",
                followUp: {
                    yes: "Что именно вызывает эти трудности?",
                    no: "Что именно помогает Вашему ребенку не испытывать трудности?"
                }
            },
            {
                text: "Удовлетворены ли Вы объемом информации, которая поступает от колледжа (классного руководителя, преподавателей по другим предметам) по вопросам успеваемости и поведения ребенка?",
                key: "info",
                followUp: {
                    yes: "Что именно Вас устраивает в объеме предоставляемой информации?",
                    no: "Что именно Вас не устраивает в объеме предоставляемой информации?"
                }
            },
            {
                text: "Согласны ли Вы с тем, что в колледже созданы условия для обеспечения родителей необходимой информацией (электронный журнал, работа сайта колледжа)?",
                key: "info_parent",
                followUp: {
                    yes: "Что именно Вы используете для получения необходимой информации?",
                    no: "Что именно Вам не хватает для получения необходимой информации?"
                }
            }
        ]
    }
};

const groupTranslations = {
    students: "студентов",
    teachers: "преподавателей",
    parents: "родителей",
};

const SurveyForm = () => {
    const [group, setGroup] = useState(null);
    const [structuralUnitId, setStructuralUnitId] = useState(0);
    const [answers, setAnswers] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // Хук для перенаправления

    useEffect(() => {
        const { uuid } = queryString.parse(window.location.search);

        if (uuid) {
            fetch(`http://192.168.88.123:8000/forms/${uuid}`)
                .then((res) => res.json())
                .then((data) => {
                    setGroup(data.group);
                    setStructuralUnitId(data.structural_unit_id);
                    const initialAnswers = {};
                    questionsData[data.group].questions.forEach(q => {
                        initialAnswers[q.key] = { mark: null, comment: "" };
                    });
                    setAnswers(initialAnswers);
                });
        }
    }, []);

    const handleAnswerChange = (key, mark) => {
        setAnswers(prev => ({
            ...prev,
            [key]: { ...prev[key], mark, comment: "" }
        }));
        setErrors(prev => ({ ...prev, [key]: null }));
    };

    const handleCommentChange = (key, comment) => {
        setAnswers(prev => ({
            ...prev,
            [key]: { ...prev[key], comment }
        }));
        setErrors(prev => ({ ...prev, [key]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        questionsData[group]?.questions.forEach(q => {
            if (answers[q.key]?.mark === null) {
                newErrors[q.key] = "Пожалуйста, выберите ответ";
            } else if (!answers[q.key]?.comment.trim()) {
                newErrors[q.key] = "Пожалуйста, укажите комментарий";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            console.log("Пожалуйста, заполните все обязательные поля");
            return;
        }

        const jsonData = {
            unit_id: structuralUnitId,
            group: group,
            marks: questionsData[group].questions.map(q => ({
                sector_type: q.key,
                mark: answers[q.key].mark,
                comment: answers[q.key].comment
            }))
        };

        fetch(`https://api.phystech.pro/api/v1/forms/answer/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Ответ успешно отправлен");
                    navigate("/thank-you"); // Перенаправляем на страницу с благодарностью
                } else {
                    console.error("Ошибка при отправке");
                }
            })
            .catch((error) => {
                console.error("Ошибка сети", error);
            });
    };

    if (!group) return <p>Загрузка...</p>;

    return (
        <div className="center-container">
            {/* Контейнер для логотипа и формы */}
            <div className="logo-and-form">
                {/* Логотип */}
                <img src="/moskovskoj.png" alt="Логотип" className="logo" />
                {/* Форма */}
                <div className="survey-form">
                    <h1 className="mb-4">Анкета для {groupTranslations[group]}</h1>
                    {questionsData[group]?.questions.map((q, idx) => (
                        <div key={idx} className="mb-3">
                            <p>{q.text}</p>
                            <button
                                className={`btn ${answers[q.key]?.mark === 1 ? "btn-success" : "btn-outline-success"} me-2`}
                                onClick={() => handleAnswerChange(q.key, 1)}
                            >
                                Да
                            </button>
                            <button
                                className={`btn ${answers[q.key]?.mark === 0 ? "btn-danger" : "btn-outline-danger"}`}
                                onClick={() => handleAnswerChange(q.key, 0)}
                            >
                                Нет
                            </button>
                            {errors[q.key] && <div className="text-danger">{errors[q.key]}</div>}
                            {(answers[q.key]?.mark !== null) && (
                                <div className="mt-2">
                                    <p>{answers[q.key]?.mark === 1 ? q.followUp.yes : q.followUp.no}</p>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={answers[q.key]?.comment || ""}
                                        onChange={(e) => handleCommentChange(q.key, e.target.value)}
                                    />
                                    {errors[q.key] && <div className="text-danger">{errors[q.key]}</div>}
                                </div>
                            )}
                        </div>
                    ))}
                    <button className="btn btn-primary mt-4" onClick={handleSubmit}>
                        Отправить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurveyForm;