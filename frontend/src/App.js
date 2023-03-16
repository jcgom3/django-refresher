import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [activeItem, setActiveItem] = useState({
    id: null,
    title: "",
    completed: false,
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === `${name}=`) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const fetchTasks = () => {
    console.log("Fetching...");

    fetch("http://127.0.0.1:8000/api/task-list/")
      .then((response) => response.json())
      .then((data) => setTodoList(data));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    setActiveItem({
      ...activeItem,
      title: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ITEM:", activeItem);

    const csrftoken = getCookie("csrftoken");

    let url = "http://127.0.0.1:8000/api/task-create/";

    if (editing) {
      url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`;
      setEditing(false);
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(activeItem),
    })
      .then(() => {
        fetchTasks();
        setActiveItem({
          id: null,
          title: "",
          completed: false,
        });
      })
      .catch((error) => {
        console.log("ERROR:", error);
      });
  };

  const startEdit = (task) => {
    setActiveItem(task);
    setEditing(true);
  };

  const deleteItem = (task) => {
    const csrftoken = getCookie("csrftoken");

    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then(() => {
      fetchTasks();
    });
  };

  const strikeUnstrike = (task) => {
    task.completed = !task.completed;
    const csrftoken = getCookie("csrftoken");
    const url = `http://127.0.0.1:8000/api/task-update/${task.id}/`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ completed: task.completed, title: task.title }),
    }).then(() => {
      fetchTasks();
    });

    console.log("TASK", task.completed);
  };

  return (
    <div className="container">
      <h1 style={{display: 'flex', justifyContent:'center', marginTop: 40}}>Django-React Todo</h1>
      <div id="task-container">
        <div id="form-wrapper">
          <form onSubmit={handleSubmit} id="form">
            <div className="flex-wrapper">
              <div style={{ flex: 6 }}>
                <input
                  onChange={handleChange}
                  className="form-control"
                  id="title"
                  value={activeItem.title}
                  type="text"
                  name="title"
                  placeholder="Add task.."
                />
              </div>

              <div style={{ flex: 1 }}>
                <input
                  id="submit"
                  className="btn btn-warning"
                  type="submit"
                  name="Add"
                />
              </div>
            </div>
          </form>
        </div>

        <div id="list-wrapper">
          {todoList.map((task, index) => (
            <div key={index} className="task-wrapper flex-wrapper">
              <div onClick={() => strikeUnstrike(task)} style={{ flex: 7 }}>
                {task.completed === false ? (
                  <span>{task.title}</span>
                ) : (
                  <strike>{task.title}</strike>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <button
                  onClick={() => startEdit(task)}
                  className="btn btn-sm btn-outline-warning"
                >
                  Edit
                </button>
              </div>

              <div style={{ flex: 1 }}>
                <button
                  onClick={() => deleteItem(task)}
                  className="btn btn-sm btn-outline-dark delete"
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;
