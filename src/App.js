import 'bootstrap/dist/css/bootstrap.min.css';
import Lobby from './Components/Lobby';
import {HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import { useState } from 'react';
import Chat from './Components/Chat';
import './App.css'
function App() {
  const [connection, setConnection] = useState()
  const [messages, setMessages] = useState([])

  const joinRoom = async (user, room) =>{
    try{
      //Creo la conexion
      const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:44365/chat")
      .configureLogging(LogLevel.Information) //Esto es para que me notifique errores y cosas asi
      .build();
      //Configuramos los controladores
      connection.on("ReceiveMessage", (user, message)=>{
        //console.log('message received; ', message);
        //Hasta aca solo mostrabamos que se recibia el mensaje en tiempo real, ahora lo vamos a guardar
        setMessages(messages => [...messages,{ user, message }]);
      })
      //Comenzamos la conexion
      await connection.start()
      //Invocamos el meteodo de union a la sala esto ya es propio de este proyecto
      await connection.invoke("JoinRoom", {user, room})
      setConnection(connection)
    }catch(e){
      console.log(e)
    }
  }

  const sendMessage = async (message)=>{
    try{
      await connection.invoke("SendMessage", message);
    }catch(e){
      console.log(e)
    }
  }
  return (
    <div className='app'>
      <h2>My chat</h2>
      <hr className='line'></hr>
      {!connection ? <Lobby joinRoom={joinRoom}/> :<Chat messages={messages} sendMessage={sendMessage}/> }
      
    </div>
  );
}

export default App;
