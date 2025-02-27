import React, { useEffect, useState } from "react";
import queryString from 'query-string';

const questionsData = {
  students: {
    question_choice: {
      type: "yesNo",
      questions: [
        "Нуждаетесь ли вы в дополнительных мероприятиях в колледже?",
        "Удовлетворены ли вы скоростью решения вопросов администрацией колледжа?",
      ],
    },
    question_answer: [
      "Укажите проблемные зоны в официальном сайте колледжа",
      "Укажите проблемные зоны в ведение социальных сетей и чатов",
      "Укажите проблемные зоны в работе буфета и колледжа",
    ],
  },
  teachers: {
    question_choice: {
      type: "yesNo",
      questions: [
        "Всегда ли доступна Вам вся необходимая информация, касающаяся учебного процесса?",
        "Нуждаетесь ли Вы лично в повышении квалификации?",
      ],
    },
    question_answer: [
      "Укажите проблемные зоны в аудиториях",
      "Укажите проблемы учебного процесса",
    ],
  },
  parents: {
    question_choice: {
      type: "yesNo",
      questions: [
        "Комфортно ли ощущает Ваш ребенок себя в колледже?",
        "Всегда ли при необходимости Вы можете обратиться в колледж за советом?",
      ],
    },
    question_answer: [
      "Укажите проблемные зоны в спортивном зале",
      "Укажите проблемы родительских собраний",
    ],
  },
};

// Словарь для перевода group на русский язык
const groupTranslations = {
  students: "студентов",
  teachers: "преподавателей",
  parents: "родителей",
};

const SurveyForm = () => {
  const [group, setGroup] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({}); // Состояние для хранения ошибок

  useEffect(() => {
    const { uuid } = queryString.parse(window.location.search);

    console.log(uuid);

    if (uuid) {
      fetch(`http://192.168.88.123:8000/forms/${uuid}`)
        .then((res) => res.json())
        .then((data) => {
          setGroup(data.group);
          setAnswers(
            questionsData[data.group]
              ? {
                  group: data.group,
                  ...questionsData[data.group].question_answer.reduce((acc, q) => {
                    acc[q] = { value: "", isSatisfied: false, satisfiedReason: "" }; // Добавляем поле isSatisfied и satisfiedReason
                    return acc;
                  }, {}),
                  ...questionsData[data.group].question_choice.questions.reduce((acc, q) => {
                    acc[q] = { answer: null, satisfiedReason: "", dissatisfiedReason: "" }; // Добавляем поля для причин
                    return acc;
                  }, {}),
                }
              : {}
          );
        });
    }
  }, []);

  const handleYesNoChange = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: { ...prev[question], answer: value, satisfiedReason: "", dissatisfiedReason: "" }, // Сбрасываем причины при изменении ответа
    }));
    setErrors((prev) => ({ ...prev, [question]: null })); // Очищаем ошибку при изменении
  };

  const handleTextChange = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: { ...prev[question], value },
    }));
    setErrors((prev) => ({ ...prev, [question]: null })); // Очищаем ошибку при изменении
  };

  const handleSatisfiedReasonChange = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: { ...prev[question], satisfiedReason: value },
    }));
    setErrors((prev) => ({ ...prev, [question]: null })); // Очищаем ошибку при изменении
  };

  const handleDissatisfiedReasonChange = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: { ...prev[question], dissatisfiedReason: value },
    }));
    setErrors((prev) => ({ ...prev, [question]: null })); // Очищаем ошибку при изменении
  };

  const handleCheckboxToggle = (question) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: {
        ...prev[question],
        isSatisfied: !prev[question].isSatisfied,
        value: prev[question].isSatisfied ? prev[question].value : "", // Очищаем поле, если галочка снята
        satisfiedReason: prev[question].isSatisfied ? prev[question].satisfiedReason : "", // Очищаем поле, если галочка снята
      },
    }));
    setErrors((prev) => ({ ...prev, [question]: null })); // Очищаем ошибку при изменении
  };

  // Функция для проверки заполненности всех полей
  const validateForm = () => {
    const newErrors = {};

    // Проверка yes/no вопросов
    questionsData[group]?.question_choice?.questions.forEach((q) => {
      if (answers[q]?.answer === null) {
        newErrors[q] = "Это поле обязательно для заполнения";
      } else if (answers[q]?.answer === 1 && !answers[q]?.satisfiedReason.trim()) {
        newErrors[q] = "Пожалуйста, укажите, что именно вас устраивает";
      } else if (answers[q]?.answer === 0 && !answers[q]?.dissatisfiedReason.trim()) {
        newErrors[q] = "Пожалуйста, укажите, что именно вас не устраивает";
      }
    });

    // Проверка текстовых вопросов
    questionsData[group]?.question_answer?.forEach((q) => {
      if (!answers[q]?.isSatisfied && !answers[q]?.value.trim()) {
        newErrors[q] = "Это поле обязательно для заполнения";
      }
      if (answers[q]?.isSatisfied && !answers[q]?.satisfiedReason.trim()) {
        newErrors[q] = "Пожалуйста, укажите, что именно вас устраивает";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Возвращает true, если ошибок нет
  };

  const mapAnswersToJson = (group, answers) => {
    const { group: _, ...rest } = answers; // Убираем поле group из answers

    if (group === "students") {
      return {
        unit_id: 0, // Замените на реальный ID, если он есть
        site: rest["Укажите проблемные зоны в официальном сайте колледжа"]?.value || null,
        social: rest["Укажите проблемные зоны в ведение социальных сетей и чатов"]?.value || null,
        buffet: rest["Укажите проблемные зоны в работе буфета и колледжа"]?.value || null,
        audiences: "",
        bathrooms: "",
        common_areas: "",
        equipment: "",
        sections: rest["Нуждаетесь ли вы в дополнительных мероприятиях в колледже?"]?.value || "",
        education: "",
        administration: rest["Удовлетворены ли вы скоростью решения вопросов администрацией колледжа?"] || 0,
      };
    } else if (group === "teachers") {
      return {
        unit_id: 0, // Замените на реальный ID, если он есть
        audiences: rest["Укажите проблемные зоны в аудиториях"]?.value || null,
        bathrooms: "",
        common_areas: "",
        equipment: "",
        info_accessibility: rest["Всегда ли доступна Вам вся необходимая информация, касающаяся учебного процесса?"] || 0,
        event_info_accessibility: 0,
        education: rest["Укажите проблемы учебного процесса"]?.value || null,
        teacher_practice: "",
      };
    } else if (group === "parents") {
      return {
        unit_id: 0, // Замените на реальный ID, если он есть
        comfortably: rest["Комфортно ли ощущает Ваш ребенок себя в колледже?"] || 0,
        equipment: rest["Укажите проблемные зоны в спортивном зале"]?.value || null,
        consult: rest["Всегда ли при необходимости Вы можете обратиться в колледж за советом?"] || 0,
        difficulties: 0,
        info_amount: 0,
        meetings: rest["Укажите проблемы родительских собраний"]?.value || null,
        conditions: 0,
      };
    }

    return {};
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      console.log("Пожалуйста, заполните все обязательные поля");
      return; // Прерываем отправку, если есть ошибки
    }

    const { group } = answers; // Извлекаем group из answers
    const jsonData = mapAnswersToJson(group, answers);

    fetch(`http://192.168.88.123/${group}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Ответ успешно отправлен");
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
    <div className="container mt-5">
      {/* Используем словарь для перевода group на русский язык */}
      <h1 className="mb-4">Анкета для {groupTranslations[group]}</h1>
      {questionsData[group]?.question_choice?.questions.map((q, idx) => (
        <div key={idx} className="mb-3">
          <p>{q}</p>
          <button
            className={`btn ${answers[q]?.answer === 1 ? "btn-success" : "btn-outline-success"} me-2`}
            onClick={() => handleYesNoChange(q, 1)}
          >
            Да
          </button>
          <button
            className={`btn ${answers[q]?.answer === 0 ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => handleYesNoChange(q, 0)}
          >
            Нет
          </button>
          {errors[q] && <div className="text-danger">{errors[q]}</div>} {/* Отображение ошибки */}
          {answers[q]?.answer === 1 && (
            <div className="mt-2">
              <p>Что именно Вас устраивает?</p>
              <input
                type="text"
                className="form-control"
                value={answers[q]?.satisfiedReason || ""}
                onChange={(e) => handleSatisfiedReasonChange(q, e.target.value)}
              />
              {errors[q] && <div className="text-danger">{errors[q]}</div>} {/* Отображение ошибки */}
            </div>
          )}
          {answers[q]?.answer === 0 && (
            <div className="mt-2">
              <p>Что именно Вас не устраивает?</p>
              <input
                type="text"
                className="form-control"
                value={answers[q]?.dissatisfiedReason || ""}
                onChange={(e) => handleDissatisfiedReasonChange(q, e.target.value)}
              />
              {errors[q] && <div className="text-danger">{errors[q]}</div>} {/* Отображение ошибки */}
            </div>
          )}
        </div>
      ))}
      {questionsData[group]?.question_answer?.map((q, idx) => (
        <div key={idx} className="mb-3">
          <p>{q}</p>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id={`satisfied-${idx}`}
              checked={answers[q]?.isSatisfied || false}
              onChange={() => handleCheckboxToggle(q)}
            />
            <label className="form-check-label" htmlFor={`satisfied-${idx}`}>
              Меня все устраивает
            </label>
          </div>
          {answers[q]?.isSatisfied ? (
            <div>
              <p>Что именно Вас устраивает?</p>
              <input
                type="text"
                className="form-control"
                value={answers[q]?.satisfiedReason || ""}
                onChange={(e) => handleSatisfiedReasonChange(q, e.target.value)}
              />
              {errors[q] && <div className="text-danger">{errors[q]}</div>} {/* Отображение ошибки */}
            </div>
          ) : (
            <div>
              <input
                type="text"
                className="form-control"
                value={answers[q]?.value || ""}
                onChange={(e) => handleTextChange(q, e.target.value)}
              />
              {errors[q] && <div className="text-danger">{errors[q]}</div>} {/* Отображение ошибки */}
            </div>
          )}
        </div>
      ))}

      <button className="btn btn-primary mt-4" onClick={handleSubmit}>
        Отправить
      </button>
    </div>
  );
};

export default SurveyForm;