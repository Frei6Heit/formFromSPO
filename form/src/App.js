import React, { useEffect, useState } from "react";

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

const SurveyForm = () => {
  const [group, setGroup] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const url = window.location.href;
    const tokenMatch = url.match(/\/([a-f0-9]{32})$/);
    if (tokenMatch) {
      const extractedToken = tokenMatch[1];

      fetch(`http://192.168.88.123:8000/forms/${extractedToken}`)
        .then((res) => res.json())
        .then((data) => {
          setGroup(data.group);
          setAnswers(
            questionsData[data.group]
              ? {
                  group: data.group,
                  ...questionsData[data.group].question_answer.reduce((acc, q) => {
                    acc[q] = { value: "", isSatisfied: false }; // Добавляем поле isSatisfied
                    return acc;
                  }, {}),
                  ...questionsData[data.group].question_choice.questions.reduce((acc, q) => {
                    acc[q] = 0;
                    return acc;
                  }, {}),
                }
              : {}
          );
        });
    }
  }, []);

  const handleYesNoChange = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const handleTextChange = (question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: { ...prev[question], value },
    }));
  };

  const handleCheckboxToggle = (question) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: {
        ...prev[question],
        isSatisfied: !prev[question].isSatisfied,
        value: prev[question].isSatisfied ? prev[question].value : "", // Очищаем поле, если галочка снята
      },
    }));
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
        sections: rest["Нуждаетесь ли вы в дополнительных мероприятиях в колледже?"]?.value || 0,
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
      <h1 className="mb-4">Анкета для {group}</h1>

      <h2>Вопросы с выбором</h2>
      {questionsData[group]?.question_choice?.questions.map((q, idx) => (
        <div key={idx} className="mb-3">
          <p>{q}</p>
          <button
            className={`btn ${answers[q] === 1 ? "btn-success" : "btn-outline-success"} me-2`}
            onClick={() => handleYesNoChange(q, 1)}
          >
            Да
          </button>
          <button
            className={`btn ${answers[q] === 0 ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => handleYesNoChange(q, 0)}
          >
            Нет
          </button>
        </div>
      ))}

      <h2 className="mt-4">Расширенные вопросы</h2>
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
          <input
            type="text"
            className="form-control"
            value={answers[q]?.value || ""}
            onChange={(e) => handleTextChange(q, e.target.value)}
            disabled={answers[q]?.isSatisfied || false}
          />
        </div>
      ))}

      <button className="btn btn-primary mt-4" onClick={handleSubmit}>
        Отправить
      </button>
    </div>
  );
};

export default SurveyForm;