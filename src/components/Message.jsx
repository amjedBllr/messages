import Axios from 'axios'
import { useState , useContext } from 'react'
function Message(props){
    //? distracting the props and stuff ... (coming from messages component)
    const {content,time,sender,receiver,pfp}=props.message
    const user = props.user
    const person = props.person
    const isSender = (user.user_id==sender)

    return(
        <div className={`msg ${isSender ? 'sender' : 'receiver'}`}>
            <div className="pfp">
                {/*  */}
                <img src={`images/${isSender ? (user.pfp) : (person.pfp)}`}/>
            </div>

            <div className="info">

                <div className="upper">
                <p>{(isSender ? (user.name) : (person.name))}</p>
                <p className="time">{time.slice(11,19)}</p>
                </div>
                <div className="lower">
                    <p>
                        {content}
                    </p>
                </div>
            </div>

        </div>
    )
}

export default Message
 