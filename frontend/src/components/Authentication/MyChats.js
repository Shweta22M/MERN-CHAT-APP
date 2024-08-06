import React from 'react'
import { useState, useEffect } from "react";
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

const MyChats = () => {
  const[loggedUser, setLoggedUser] = useState();
  const { user,  setSelectedChat,chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async() =>{
    try {
      const config= {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
          title: 'Error Occured',
          description:"Failed to Load the chats",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      
    }
  };
  useEffect(() => {
    const userInfo =setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    if (userInfo && userInfo.token) {
    fetchChats();
    }
  }, [user])
  return <div> My Chats </div>;
  
}

export default MyChats
