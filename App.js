import './App.css';
import { useState, useEffect } from 'react';
import { Button, EditableText, InputGroup,Toaster } from '@blueprintjs/core';

/*Toaster object to see the messages of various op performed*/

const AppToaster=Toaster.create({
    position:"top"
})

function App() {
    const [users, setUsers] = useState([]);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newWebsite, setNewWebsite] = useState("");

    /*useEffect() hook to fetch the data from a fake rest API*/

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((json) => setUsers(json))
    }, [])

    /*Function to add user*/

    function addUser(){
        const name=newName.trim();
        const email=newEmail.trim();
        const website=newWebsite.trim();
        if(name && email && website){
            fetch('https://jsonplaceholder.typicode.com/users',
                {

                   /*POST API request to add a new user to the fake db*/

                    method: "POST",
                    body:JSON.stringify({
                        name,
                        email,
                        website
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    }
                }
            ).then((response)=>response.json())
            .then(data=>{setUsers([...users,data]);
                AppToaster.show({
                    message:"User Added Successfully",
                    intent:'success'
                })
                setNewName("");
                setNewEmail("");
                setNewWebsite("");
            })
        }
    }

    /*Function to change the website and email in the textbox when changed*/

    function onChangeHandler(id,key,value){
        setUsers((user)=>{
           return users.map(user=>{
                return user.id===id?{...user,[key]:value}:user;
            })
        })
    }

    /*function to update the user email and website,once the values of both are changed*/

    function updateUser(id){
        const user=users.find((user)=>user.id===id);
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
            {

                /*PUT API request to add updated data to the table*/

                 method: "PUT",
                body:JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            }
        ).then((response)=>response.json())
        .then(data=>{
            AppToaster.show({
                message:"User Updated Successfully",
                intent:'primary'
            })
        })
    }

    /*function to delete a user*/

    function deleteUser(id){
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
            {
                /*DELETE API request to delete a data from the fake db*/

                method: "DELETE",
            }
        ).then((response)=>response.json())
        .then(data=>{setUsers((users)=>{return users.filter(user=>user.id!==id)
        .map((user, index) => ({ ...user, id: index + 1 }));
        })

            AppToaster.show({
                message:"User deleted Successfully",
                intent:'danger'
            })
    })
    }

    /*Main jsx*/

    return (

        /*Table for the datas to be represented*/

        <div className="App">
            <table className='bp4-html-table modifier'>
                <thead>
                    <th>id</th>
                    <th>name</th>
                    <th>email</th>
                    <th>website</th>
                    <th>actions</th>
                </thead>
                <tbody>
                    {users.map(user => <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td><EditableText value={user.email} onChange={value=>onChangeHandler(user.id,'email',value)} /></td>
                        <td><EditableText value={user.website} onChange={value=>onChangeHandler(user.id,'website',value)}/></td>
                        <td><Button intent='primary' onClick={()=>updateUser(user.id)}>Update</Button>
                            <Button intent='danger' onClick={()=>deleteUser(user.id)}>Delete</Button></td>
                    </tr>)}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td><InputGroup
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder='Enter name...' /></td>

                        <td><InputGroup
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder='Enter email...' /></td>

                        <td><InputGroup
                            value={newWebsite}
                            onChange={(e) => setNewWebsite(e.target.value)}
                            placeholder='Enter website...' /></td>

                        <td><Button intent='success' onClick={addUser}>Add User</Button></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default App;
