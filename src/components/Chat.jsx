import axios from 'axios';
import Message from './Message'
import {connect} from "socket.io-client";
import { useState , useEffect , useRef} from 'react';
// data attempt ...
import data from '../assets/data.js'
// ... (imports)




//connecting to the webSocket
const socket = connect('http://localhost:3000/');
let room 




function Chat(props) {

  let user  = props.user
  let person = props.person
  
  
  // chating essential info
  
  //!profiling stuff

  const [userp,setUserp] = useState()
  const [personp,setPersonp] = useState()
  
  const getProfil = async (user)=>{
        try{
          let profil = await axios.get(`http://localhost:3000/userProfil?user=${user}`)
          return(profil.data)
        }catch(err){console.log(err)}
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        var profil = await getProfil(user);
        setUserp(profil);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var profil = await getProfil(person);
        setPersonp(profil);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [person]);
  

  //? messages (conversation) state !!
  const [messages, setMessages] = useState([]);

  // ?user ref references to the element we gon scroll to bottom using....
  let chatViewRef = useRef(null);

  // mounting the initial conversation data
   // ? log in into a room the room id !!
   useEffect(()=>{
    socket.emit('login',room);
  },[room])


  //? obtain the conversation and the room id (which gon be used to enter real time room)
  useEffect(
    ()=>{
      const fetchConversation = async () => {

        try {
          const response = await fetch(`http://localhost:3000/api/getConv/room?user1=${user}&user2=${person}`);
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const conversationData = await response.json();
          setMessages(conversationData[1])
          room = conversationData[0]
        } catch (error) {
          console.error('Error:', error)
        }
      };
      fetchConversation();
    } , [person]
  )
  

  // elementing i'd say the new messages

  const messagesElements = messages.map((msg) => (
    <Message message={msg} user={userp} person={personp}/>
  ));
  
  


  const [message, setMessage] = useState('');


  const sendMessagae = (e) => {
    e.preventDefault();

if(message!== ''){
    let newMessage = {
      room_id : room ,
      sender : user ,
      receiver : person ,
      content : message ,
      time : new Date()
    }
    socket.emit('message-from-client', newMessage);
  }

    setMessage('');
  };

  useEffect(() => {

  const handleReceivedMessage = (data) => {
    console.log(data);
    setMessages((prevMessages) => [...prevMessages, data.text]);
    if (socket.id === data.id) {
      console.log('this message is mine');
    }
  };

  socket.on('message-from-server', handleReceivedMessage);

  return () => {
    socket.off('message-from-server', handleReceivedMessage);
    chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
  };
}, [messages]);
// Include socket, user, and person as dependencies

  return (
    <div className="chat">
        <div className='personBar'>
            <div className='info'>
              <img src={`/images/${(personp)? personp.pfp : 'pfp1.png'}`}/>
              <div className='text'>
              <p>{(personp) ? (personp.name) : 'person'}</p>
              <p>{(personp) ? (personp.type) : 'user'}</p>
              </div>
            </div>
        </div>

        <div className="chat-view" ref={chatViewRef}>
        {messagesElements}
        </div>
      <form id="chat-form" action="/messages.html" method="post">
        <input
          name="msg"
          id="msg-to-send"
          type="text"
          placeholder="type your message ..."
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button type="submit" className="send-msg" onClick={sendMessagae}>
        <svg xmlns="http://www.w3.org/2000/svg" height="21" width="21" viewBox="0 0 512 512"><path opacity="1" fill="#097FC7" d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/></svg>
        </button>
      </form>
  </div>
  );
}

export default Chat;
