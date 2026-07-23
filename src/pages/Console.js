import ManagePosts from "../manager/ManagePosts";
import NewPost from "../manager/NewPost";
import {useEffect, useState} from 'react'
import UploadMedia from "../manager/UploadMedia";
import ManageMedia from "../manager/ManageMedia";
import SERVER_URL from "../lib/SERVER_URL";

export default function Console() {

    const [password,setPassword] = useState('')
    const [authed,setAuthed] = useState(false)
    const [showNewPost, setShowNewPost] = useState(false)
    const [showManagePosts, setShowManagePosts] = useState(false)
    const [showUploadMedia,setShowUploadMedia] = useState(false)
    const [showManageMedia,setShowManageMedia] = useState(false)

    const authenticate = async () => {
        const response = await fetch(SERVER_URL+'/auth',{
            method:'POST',
            headers:{'content-type':'application/json'},
            body:JSON.stringify({
                'password':password
            })
        })
        const status = response.status

        console.log(status)

        if (status === 200) {
            setAuthed(true)
            sessionStorage.setItem('password',password)
        } else {
            setAuthed(false)
        }

    }

    useEffect(() => {
        if (sessionStorage.getItem('password') != undefined) {
            setAuthed(true)
        }
    },[])

    return (
        <div className="Console">
            <h1>Console</h1>
            <div className="password-container">
                <input type="text" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}}></input>
                <footer>
                    <button onClick={() => authenticate()}>Authenticate</button>

                    <h3>
                    {authed ? 
                    'Authentication Successful' : 'Awaiting Authentication'}
                    </h3>
                </footer>

            </div>
            <div className="new-post-container">
                <button onClick={() => {setShowNewPost(!showNewPost)}}>New Post</button>
                <NewPost show={showNewPost}/>
            </div>
            <div className="manage-posts-container">
                <button  onClick={() => {setShowManagePosts(!showManagePosts)}}>Manage Posts</button>
                <ManagePosts show={showManagePosts} />
            </div>
            <div className="upload-media">
                <button onClick={() => {setShowUploadMedia(!showUploadMedia)}}>Upload Media</button>
                <UploadMedia show={showUploadMedia}/>
            </div>
            <div className="manage-media">
                <button onClick={() => {setShowManageMedia(!showManageMedia)}}>Manage Media</button>
                <ManageMedia show={showManageMedia} />
            </div>
        </div>
    )
}