import React,{useState, useRef, useEffect,} from 'react'
import useLocalStorage from 'use-local-storage'
import "./TaskManager.css"
import Task from './Task'

const TaskManager = () => {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    //const [tasks, setTasks] = useState([]);
    const [tasks, setTasks] = useLocalStorage("tasks", []);
    
    const [taskID, setTaskID] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    const nameInputRef = useRef(null);
    //autofocus the name input field when page refresh/re-renders
    useEffect(() => {
        nameInputRef.current.focus()
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if((!name && !date)  ||  !name  || !date) {
            //if name and date field are both empty OR if any of name or date is empty, run the following
            alert("Please enter task name and date")
        } else if (name && date && isEditing) {
            //when the name, date and isEditing states are true, run the following code
            //update the task you edited
            setTasks(
                tasks.map((task) => {
                    if (task.id === taskID) {
                        return {...task, name, date, complete: false}
                    }
                    return task;
                })
            );
            //empty input field
            setName("")
            setDate("");
            setIsEditing(false);
            setTaskID(null)
        } else {
            //if name and date field are not empty, run the following i.e create new task
            const newTask = {
                id: Date.now(),
                name: name,
                date: date,
                complete: false,
            };
            //console.log(newTask);

            setTasks([...tasks, newTask])
            //clear input fields after submission
            setName("")
            setDate("")
        }
    }

    const editTask = (id) => {
        //console.log(id);
        const thisTask = tasks.find((task) => task.id === id) //we are finding task details
        setIsEditing(true);
        setTaskID(id);
        //we want to push the information of  we edited back to the form 
        // console.log(thisTask.name)
        // console.log(thisTask.date)
        setName(thisTask.name)
        setDate(thisTask.date)
        //save edited task

    }

    const deleteTask = (id) => {
        if(window.confirm("Delete this task") === true) {
            const newTasks = tasks.filter((task) => task.id !== id);
            setTasks(newTasks);
        }
    }
    const completeTask = (id) => {
        setTasks(
            tasks.map((task) => {
                if(task.id === id) {
                    return {...task, complete: true }
                }
                return task;
            })
        )
    }


  return (
    <div className='--bg-primary'>
        <h1 className='--text --text-light'>Task Manager</h1> 
        <div className='--flex-center --p'>
            <div className='card --bg-light --width-500px --p --flex-center'>
                <form className='form --form-control' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='name'>Task:</label>
                        <input 
                            ref={nameInputRef}
                            type="text"
                            placeholder='Task name'
                            autocomplete="given-name"
                            name='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='date'>Date:</label>
                        <input 
                            type="date"
                            placeholder='date'
                            autocomplete="given-date"
                            name='date'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <button 
                        className='--btn --btn-success --btn-block'
                        type='submit'
                    >
                        {isEditing ? "Edit Task" : "Save Task"}
                    </button>
                </form>
            </div>
        </div>

        {/*Display Task */}
        <article className='--flex-center --my2'>
            <div className='--width-500px --p'>
                <h2 className='--text-light'>Task List</h2>
                <hr style={{background: "#fff"}} />
                {tasks.length === 0 
                    ? (
                        <p className='--text-light'>No task added...</p>
                    )
                    : (
                        <>
                            {tasks.map((task) => {
                                //const {id,name, date, complete } = task;
                                return (
                                    <Task 
                                        {...task} 
                                        editTask={editTask}
                                        deleteTask={deleteTask}
                                        completeTask={completeTask}
                                    />
                                )
                            })}
                        </>
                    )
                }
            </div>
        </article>
    </div>
  )
}

export default TaskManager

