import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "react-router";
import { useEffect,useState } from "react";
import SERVER_URL from "../lib/SERVER_URL";

const markdownTest =
`
## Introduction
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at tellus varius, molestie magna vitae, auctor nisi. Aliquam eleifend mi sem, eget interdum odio dignissim eu. Nunc ac sapien quis leo pharetra molestie sit amet et eros. Nullam auctor enim lacinia turpis interdum, in auctor lacus tempor. Etiam in bibendum ligula. Sed augue dolor, luctus quis arcu vel, condimentum placerat magna. Fusce sodales urna non sagittis hendrerit. Nam posuere, massa non hendrerit hendrerit, risus nisl volutpat arcu, at dapibus arcu erat auctor enim. Quisque venenatis at nunc vitae fermentum. 
## Supplies
Below are the supplies.
| Syntax      | Description | Price  |
| :--       |    :----  |          :--- |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |

You can find more on amazon.

## Build
The basic steps are outlined.
1. Find Stuff
2. Buy Stuff
3. Glue Stuff
4. Shoot Stuff

![Picture of Coder](assets/coding.jpg)

## Conclusion
You can find the code [here](https://google.com)  \n
This is the result.  \n
![Picture of Cannon](assets/cannon.jpg)
`

export default function Post () {
    const {postId} = useParams()

    const [title,setTitle] = useState()
    const [description,setDescription] = useState()
    const [date,setDate] = useState()
    const [image,setImage] = useState()
    const [content,setContent] = useState('')

    
    const getPost = async () => {
        const response = await fetch(SERVER_URL+'/post?id='+postId)
        const data = await response.json()
        setTitle(data.title)
        setDescription(data.description)
        setDate(data.date)
        setContent(data.content)
        setImage(data.image)
    }

    useEffect(() => {
        getPost()
    },[])

    return (
        <div className="Post">
            <header>
                <h1>{title}</h1>
                <h2>{description}</h2>
                <h3>{date}</h3>
            </header>
            <img src={image} />
            <div className='markdown'>

            <Markdown remarkPlugins={[remarkGfm]}>
                {content}
            </Markdown> 
            </div>
        </div>
    )
}