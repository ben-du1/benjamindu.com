import {useState} from 'react'
import SERVER_URL from '../lib/SERVER_URL'

export default function NewPost({show, onCreated}) {

    const [title,setTitle] = useState('')
    const [description,setDescription] = useState('')
    const [date,setDate] = useState('')
    const [content,setContent] = useState('')
    const [image,setImage] = useState('')
    const [category,setCategory] = useState('serious')
    const [keywords,setKeywords] = useState('')
    const [feedback, setFeedback] = useState('')
    const [saving, setSaving] = useState(false)

    const createPost = async () => {
        setSaving(true)
        setFeedback('Creating post...')
        try {
            const response = await fetch(SERVER_URL+'/createpost',{
                method:'POST',
                headers:{'content-type':'application/json'},
                body:JSON.stringify({
                    "password":sessionStorage.getItem('password'),
                    "title":title,
                    "description":description,
                    "date":date,
                    "content":content,
                    "image":image
                    ,"category":category
                    ,"keywords":keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean)
                })
            })
            if (!response.ok) {
                throw new Error('Failed to create post')
            }
            setTitle('')
            setDescription('')
            setDate('')
            setContent('')
            setImage('')
            setCategory('serious')
            setKeywords('')
            setFeedback('Post created successfully')
            if (onCreated) onCreated()
        } catch (err) {
            setFeedback(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="NewPost">
            {
                show === true ? (
                    <>
                    <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}></input> <br/>
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></input> <br/>
                    <input type="text" placeholder="Date (M.D.Y)" value={date} onChange={(e) => setDate(e.target.value)}></input> <br/>
                    <input type="text" placeholder="Image Link" value={image} onChange={(e) => setImage(e.target.value)}></input> <br/>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="serious">Serious</option>
                        <option value="fun">Fun</option>
                    </select> <br/>
                    <input type="text" placeholder="Keywords (comma-separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)}></input> <br/>
                    <textarea type="text" placeholder="Content (Markdown)" value={content} onChange={(e) => setContent(e.target.value)}></textarea> <br/>
                    <button disabled={saving} onClick={createPost}>{saving ? 'Creating...' : 'Create'}</button>
                    {feedback && <p className="console-feedback">{feedback}</p>}
                    </>
                ): ''
            }
            
        </div>
    )
}