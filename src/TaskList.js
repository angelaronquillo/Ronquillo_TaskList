import React, { useState, useEffect } from "react";
import "./App.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [markedForDeletion, setMarkedForDeletion] = useState([]);
  const [sortType, setSortType] = useState("quantity");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    sortTasks();
  }, [tasks, sortType]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addTask = () => {
    if (inputValue.trim() !== "") {
      if (editIndex !== null) {
        const newTasks = [...tasks];
        newTasks[editIndex] = {
          id: Date.now(),
          text: inputValue,
          quantity: newTasks[editIndex].quantity,
          isCompleted: newTasks[editIndex].completed,
        };
        setTasks(newTasks);
        setEditIndex(null);
      } else {
        setTasks([
          ...tasks,
          {
            id: Date.now(),
            text: inputValue,
            quantity: quantity,
            completed: false,
          },
        ]);
      }
      setInputValue("");
      setQuantity(1);
    }
  };

  const editTask = (index) => {
    setInputValue(tasks[index].text);
    setQuantity(tasks[index].quantity);
    setEditIndex(index);
  };

  const deleteTask = (id) => {
    const updatedTask = tasks.find((task) => task.id === id);

    updatedTask.completed = !updatedTask.completed;

    setTasks((tasks) => {
      return tasks.map((item) => {
        if (item.id === id) {
          return updatedTask;
        }
        return item;
      });
    });

    // const newTasks = [...tasks];
    // newTasks[index] = {
    //   ...newTasks[index],
    //   completed: !newTasks[index].completed,
    // };
    // setTasks(newTasks);
  };

  const deleteAllTasks = () => {
    setTasks([]);
  };

  const sortTasks = () => {
    let sortedTasks = [...tasks];
    if (sortType === "quantity") {
      sortedTasks = sortedTasks.sort((a, b) => a.quantity - b.quantity);
    } else if (sortType === "name") {
      sortedTasks = sortedTasks.sort((a, b) =>
        a.text.toLowerCase().localeCompare(b.text.toLowerCase()),
      );
    }
    setTasks(sortedTasks);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const incompleteTasks = tasks.filter(
    (task, index) =>
      !task.completed &&
      task.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !markedForDeletion.includes(index),
  );

  const completedTasks = tasks.filter(
    (task, index) =>
      task.completed &&
      task.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !markedForDeletion.includes(index),
  );

  const allTasks = [...incompleteTasks, ...completedTasks];

  const filteredTasks =
    filterType === "completed"
      ? completedTasks
      : filterType === "incomplete"
        ? incompleteTasks
        : allTasks;

  return (
    <div className="app">
      <h1 className="title">Grocery List</h1>
      <div className="task-input">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="task-input">
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Add a task..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <select
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <button style={{ marginRight: "10px" }} onClick={addTask}>
          {editIndex !== null ? "Edit" : "Add"}
        </button>
        <label>
          <strong>Sort By:</strong>
          <select
            style={{ marginRight: "10px" }}
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="quantity">Quantity</option>
          </select>
        </label>
        <label>
          <strong>Filter By:</strong>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </label>
        <button style={{ marginLeft: "10px" }} onClick={deleteAllTasks}>
          Delete All
        </button>
      </div>
      <ul className="task-list">
        {filteredTasks.map((task, index) => (
          <li key={index} className={task.completed ? "completed" : ""}>
            <span>
              {task.text} <small>{task.quantity}</small>
            </span>
            <div>
              <button onClick={() => editTask(index)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>
                {task.completed ? "Restore" : "Mark Complete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
