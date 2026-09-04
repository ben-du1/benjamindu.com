import ManagePosts from "../manager/ManagePosts";
import NewPost from "../manager/NewPost";
import {useEffect, useState} from 'react'
import UploadMedia from "../manager/UploadMedia";
import ManageMedia from "../manager/ManageMedia";
import SERVER_URL from "../lib/SERVER_URL";

export default function Console() {

    const [password,setPassword] = useState('')
    const [authed,setAuthed] = useState(false)
    const [activeTab, setActiveTab] = useState('new-post')
    const [authMessage, setAuthMessage] = useState('Awaiting Authentication')
    const [mediaRefreshKey, setMediaRefreshKey] = useState(0)

    const authenticate = async () => {
        try {
            const response = await fetch(SERVER_URL+'/auth',{
                method:'POST',
                headers:{'content-type':'application/json'},
                body:JSON.stringify({
                    'password':password
                })
            })
            if (!response.ok) {
                throw new Error('Authentication failed')
            }
            setAuthed(true)
            setAuthMessage('Authentication Successful')
            sessionStorage.setItem('password',password)
        } catch (err) {
            setAuthed(false)
            setAuthMessage(err.message)
        }
    }

    useEffect(() => {
        const storedPassword = sessionStorage.getItem('password')
        if (storedPassword) {
            fetch(SERVER_URL+'/auth',{
                method:'POST',
                headers:{'content-type':'application/json'},
                body:JSON.stringify({'password':storedPassword})
            }).then((response) => {
                if (response.ok) {
                    setAuthed(true)
                    setAuthMessage('Authentication Successful')
                } else {
                    sessionStorage.removeItem('password')
                }
            }).catch(() => {
                sessionStorage.removeItem('password')
            })
        }
    },[])

    return (
        <div className="Console">
            <h1>Console</h1>
            <div className="password-container">
                <input type="password" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}}></input>
                <footer>
                    <button onClick={() => authenticate()}>Authenticate</button>

                    <h3>
                    {authMessage}
                    </h3>
                </footer>

            </div>
            <div className="console-tabs" role="tablist" aria-label="Console actions">
                <button
                    className={activeTab === 'new-post' ? 'active' : ''}
                    role="tab"
                    aria-selected={activeTab === 'new-post'}
                    onClick={() => setActiveTab('new-post')}
                >
                    New Post
                </button>
                <button
                    className={activeTab === 'manage-posts' ? 'active' : ''}
                    role="tab"
                    aria-selected={activeTab === 'manage-posts'}
                    onClick={() => setActiveTab('manage-posts')}
                >
                    Manage Posts
                </button>
                <button
                    className={activeTab === 'upload-media' ? 'active' : ''}
                    role="tab"
                    aria-selected={activeTab === 'upload-media'}
                    onClick={() => setActiveTab('upload-media')}
                >
                    Upload Media
                </button>
                <button
                    className={activeTab === 'manage-media' ? 'active' : ''}
                    role="tab"
                    aria-selected={activeTab === 'manage-media'}
                    onClick={() => setActiveTab('manage-media')}
                >
                    Manage Media
                </button>
            </div>
            <div className="console-panel" role="tabpanel">
                {!authed ? (
                    <p className="console-locked">Authenticate to manage posts and media.</p>
                ) : (
                    <>
                        {activeTab === 'new-post' && <NewPost show={true}/>}
                        {activeTab === 'manage-posts' && <ManagePosts show={true}/>}
                        {activeTab === 'upload-media' && (
                            <UploadMedia
                                show={true}
                                onUploaded={() => setMediaRefreshKey((key) => key + 1)}
                            />
                        )}
                        {activeTab === 'manage-media' && (
                            <ManageMedia show={true} refreshKey={mediaRefreshKey}/>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}