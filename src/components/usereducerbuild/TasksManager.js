import React,{useState, useRef, useEffect,} from 'react'
import useLocalStorage from 'use-local-storage'
import "../usereducerbuild/TasksManager.css"
import Tasks from '../usereducerbuild/Tasks'
import Alert from './alert/Alert'
import Confirm from './confimModal/Confirm'
import { taskReducer } from './TaskReducer'



const TasksManager = () => {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [tasks, setTasks] = useLocalStorage("tasks", []);

    const initialState = {
        tasks: tasks, //local-storage task
        taskID: null,
        isAlertOpen: false,
        alertContent: "This is an alert",
        alertClass: "danger",
        isEditing: false,
        isEditModalOpen: false,
        isDeleteModalOpen: false,
        modalTitle: "Delete Task",
        modalMsg: "You are about to Delete this task",
        modalActionText: "Ok"
    }
    const [state, dispatch] = React.useReducer(taskReducer, initialState);
    
    const nameInputRef = useRef(null);
    //autofocus the name input field when page refresh/re-renders
    useEffect(() => {
        nameInputRef.current.focus()
    }, []);

    const CloseAlert = () => {
        //console.log("close alert btn clicked")
        dispatch({
            type: "CLOSE_ALERT"
        })
        
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log("submit")
        if(!name || !date) {
            dispatch({
                type: "EMPTY_FIELD",
            })
        }
        if(name && date && state.isEditing) {
            const updatedTask = {
                id: state.taskID,
                name,
                date,
                complete: false,
            }
            dispatch({
                type: "UPDATE_TASK",
                payload: updatedTask
                //update task in reducer
            })
            setName("");
            setDate("");
            setTasks(
                tasks.map((task) => {
                    //save task to localStorage
                    if(task.id === updatedTask.id) {
                        return {
                            ...task,
                            name,
                            date,
                            complete: false
                        }
                    }
                    return task;
                })
            )  
            return; //stops code at this point
        }

        if(name && date) {
            const newTask = {
                id: Date.now(),
                name,
                date,
                complete: false,
            }
            dispatch({
                type: "ADD_TASK",
                payload: newTask
            })
            setName("")
            setDate("")
            setTasks([...tasks, newTask]) //add/persist new tasks to local storage
        }
        
    }

    const openEditModal = (id) => {
        dispatch({
            type: "OPEN_EDIT_MODAL",
            payload: id
        })
    }

    const editTask = () => {
        console.log(state.taskID)
        const id = state.taskID
        dispatch({
            type: "EDIT_TASK",
            payload: id
        })
        const thisTask = state.tasks.find((task) => {
            return (
                task.id === id
            )
        })
        console.log(thisTask);
        //push the name and date states back into our input field
        //when Edit-btn is clicked
        setName(thisTask.name);
        setDate(thisTask.date);
        //close modal when the Edit-btn is clicked.
        closeModal();
    }
    const closeModal = (id) => {
       dispatch({
            type: "CLOSE_MODAL"
       })
       //update to localStorage
       setTasks(
        tasks.map((task) => {
            if(task.id === id) {
                return {
                    ...task,
                    complete: true
                }
            }
            return task;
        })
       )
    }

    const deleteTask = () => {
        //console.log(state.taskID);
        const id = state.taskID
        dispatch({
            type: "DELETE_TASK",
            payload: id
        })
        //delete Task from localStorage
        const newTasks = tasks.filter((task) => task.id !== id)
        setTasks(newTasks)

    }
    const openDeleteModal = (id) => {
        dispatch({
            type: "OPEN_DELETE_MODAL",
            payload: id
        })
    }
    const completeTask = (id) => {
       console.log(state.id)
       dispatch({
        type: "COMPLETE_TASK",
        payload: id
       })

    }


  return (
    <div className='--bg-primary'>
        {state.isAlertOpen && 
            <Alert 
                alertContent={state.alertContent}
                alertClass={state.alertClass}
                onCloseAlert={CloseAlert}
            />
        }
        {state.isEditModalOpen && 
            <Confirm 
                modalTitle={state.modalTitle}
                modalMsg={state.modalMsg} 
                modalActionText={state.modalActionText} 
                modalAction={editTask} 
                onCloseModal={closeModal}
            />  
        }
        {state.isDeleteModalOpen && (
            <Confirm 
                modalTitle={state.modalTitle}
                modalMsg={state.modalMsg} 
                modalActionText={state.modalActionText} 
                modalAction={deleteTask} 
                onCloseModal={closeModal}
            />  
          )
        }
        <h2 className='--text --text-light'>Task Manager Reducer</h2> 
        <div className='--flex-center --p'>
            <div className='card --bg-light --width-500px --p --flex-center'>
                <form className='form --form-control' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='name'>Task:</label>
                        <input 
                            ref={nameInputRef}
                            type="text"
                            placeholder='Task name'
                            autoComplete="given-name"
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
                        onClick={handleSubmit}
                    >
                        {state.isEditing ? "Edit Task" : "Save Task"}
                    </button>
                </form>
            </div>
        </div>

        {/*Display Task */}
        <article className='--flex-center --my2'>
            <div className='--width-500px --p'>
                <h2 className='--text-light'>Task List</h2>
                <hr style={{background: "#fff"}} />
                {state.tasks.length === 0 
                    ? (
                        <p className='--text-light'>No task added...</p>
                    )
                    : (
                        <>
                            {state.tasks.map((task) => {
                                //const {id,name, date, complete } = task;
                                return (
                                    <Tasks
                                        {...task} 
                                        editTask={openEditModal}
                                        deleteTask={openDeleteModal}
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

export default TasksManager

