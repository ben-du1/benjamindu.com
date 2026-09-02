import {useState,useEffect} from 'react'
import SERVER_URL from '../lib/SERVER_URL'
import PostOptions from './components/PostOptions'

export default function ManagePosts({show}) {

    const [posts, setPosts] = useState([])
    const [feedback, setFeedback] = useState('')
    const [loading, setLoading] = useState(true)
    const [reordering, setReordering] = useState(false)

    const getPosts = async () => {
        setLoading(true)
        try {
            const response = await fetch(SERVER_URL+'/posts')
            if (!response.ok) throw new Error('Failed to load posts')
            const data = await response.json()
            setPosts(data)
            setFeedback('')
        } catch (err) {
            setFeedback(err.message)
        } finally {
            setLoading(false)
        }
    }

    const reorderPosts = async (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= posts.length) {
            return
        }

        const reorderedPosts = [...posts]
        const [movedPost] = reorderedPosts.splice(fromIndex, 1)
        reorderedPosts.splice(toIndex, 0, movedPost)
        setPosts(reorderedPosts)
        setReordering(true)

        try {
            const response = await fetch(SERVER_URL+'/reorderposts', {
                method:'POST',
                headers:{'content-type':'application/json'},
                body:JSON.stringify({
                    'password':sessionStorage.getItem('password'),
                    'ids':reorderedPosts.map((post) => post.id)
                })
            })
            if (!response.ok) throw new Error('Failed to save post order')
            setFeedback('')
        } catch (err) {
            setFeedback(err.message)
            getPosts()
        } finally {
            setReordering(false)
        }
    }



    useEffect(() => {
        getPosts()
    },[])

   
    return (
        <div className="ManagePosts">
            {show === true ? loading ? <p className="console-feedback">Loading posts...</p> :
                <>
                {feedback && <p className="console-feedback">{feedback}</p>}
                {posts.map((post, index) => (
                <PostOptions
                    key={post.id}
                    reloadPosts={getPosts}
                    post={post}
                    canMoveUp={index > 0}
                    canMoveDown={index < posts.length - 1}
                    canReorder={!reordering}
                    moveUp={() => reorderPosts(index, index - 1)}
                    moveDown={() => reorderPosts(index, index + 1)}
                />
                       ))}
                </>
            : ''}
            
        </div>
    )
}