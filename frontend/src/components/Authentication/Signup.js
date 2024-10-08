import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import {useHistory} from 'react-router-dom'

const Signup = () => {
    const[show, setShow] = useState(false)
    const[name, setName] = useState()
    const[email, setEmail] = useState();
    const[password, setPassword] = useState();
    const[confirmpassword, setConfirmPassword] = useState();
    const[pic, setPic] = useState();
    const[loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();


    const handleClick =()=> setShow(!show);

    const postDetails =(pics) => {
        setLoading(true);
        if(pics === undefined){
         toast({
          title: 'Please select an image!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
        return;

        }

        if(pics.type ==="image/jpeg" || pics.type === "image/png" || pics.type ==="image/jpg"){
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "shwetacoder");
            fetch("https://api.cloudinary.com/v1_1/shwetacoder/image/upload",{
                method:'post',
                body: data,
            })
            .then((res) => res.json())
            .then((data) => {
                setPic(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
            })
            .catch((err) =>{
                console.log(err);
                setLoading(false);
            });
        }else{
             toast({
          title: 'Please select an Image!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
        }

    };

    const submitHandler =async() => {
        setLoading(true);
        if(!name || !email || !password || !confirmpassword){
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            
            });
            setLoading(false);
            return;
        }
        if(password !== confirmpassword){
            toast({
                title: "passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            
            });
            return;
        }
        try {
            const config = {
                headers:{
                    "Content-type": "application/json",
                },
            };
            const {data} = await axios.post('/api/user',
                 {name,email, password,pic}, 
                 config
                );
            toast({
                title: "Registration successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            
            });

            localStorage.setItem('userInfo', JSON.stringify(data));

            setLoading(false);
            history.push('/chats');

            
        } catch (error) {
            toast({
                title: "Error occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            
            });
            setLoading(false);
        }
    };

    

  return <VStack spacing ='5px'>
    <FormControl id ="first-name" isRequired>
       <FormLabel>Name</FormLabel> 
       <Input
       placeholder ='Enter your Name'
       onChange={(e)=> setName(e.target.value)}

       
       ></Input>
    </FormControl>

    <FormControl id ="email" isRequired>
       <FormLabel>Email</FormLabel> 
       <Input
       placeholder ='Enter your Email'
       onChange={(e)=> setEmail(e.target.value)}

       
       ></Input>
    </FormControl>

    <FormControl id ="password" isRequired>
     <FormLabel>Password</FormLabel> 
     <InputGroup>
       <Input
       type ={show ? "text" : "password"}
       placeholder ='Enter your Password'
       onChange={(e)=> setPassword(e.target.value)}

       ></Input>
       <InputRightElement width ="4.5rem">
       <Button h ="1.75rem" size ="sm" onClick={handleClick}>
        {show? "Hide" : "Show"}
        </Button>
        </InputRightElement>

    </InputGroup>
</FormControl>

<FormControl id ="password" isRequired>
     <FormLabel>Confirm Password</FormLabel> 
     <InputGroup size ="md">
       <Input
       type ={show ? "text" : "password"}
       placeholder ='ConfirmPassword'
       onChange={(e)=> setConfirmPassword(e.target.value)}

       ></Input>
       <InputRightElement width ="4.5rem">
       <Button h ="1.75rem" size ="sm" onClick={handleClick}>
        {show? "Hide" : "Show"}
        </Button>
        </InputRightElement>

    </InputGroup>
</FormControl>

<FormControl id = "pic">
    <FormLabel>Upload your picture</FormLabel>
    <Input
    type ="file"
    p={.5}
    accept ="image/*"
    onChange={(e) => postDetails(e.target.files[0])}
    />
</FormControl>

<Button
colorScheme='blue'
width ="100%"
style ={{marginTop:15}}
onClick ={submitHandler}
isLoading ={loading}
>
    Sign Up

</Button>
</VStack>;
}

export default Signup
