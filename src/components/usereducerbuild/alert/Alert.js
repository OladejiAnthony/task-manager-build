import React,{useEffect} from 'react'
import "./Alert.css"
import { FaTimes, FaExclamationCircle } from 'react-icons/fa'

const Alert = ({alertContent, alertClass, onCloseAlert}) => {

  useEffect(() => {
    const int = setTimeout(() => {
      onCloseAlert()
      //console.log("alert closed after 3secs")
    }, 3000);
    return () => { //cleanup function
      clearTimeout(int)
    }
  })
  return (
    <div className={`alert  ${alertClass}`}>
        <FaExclamationCircle className='icon-x' size={16}  />
        <span className='msg'>{alertContent}</span>
        <div className='close-btn' onClick={onCloseAlert}>
            <FaTimes className='icon-x' size={19}   />
        </div>
    </div>
  )
}

export default Alert


