import React, { useState , useEffect} from "react";
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from "./firebase";


function Post({postId , imageUrl , user, username , caption}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");        //to keep track of a single comment

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe=db.collection('instapost').doc(postId).collection("comments").onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));

                });     //in simple word here we are summoning from comments which is on firebase db 
           
        }
        return() => {
            unsubscribe();
        }


    },[postId])

    function postComment(event){
        event.preventDefault();
        db.collection('instapost').doc(postId).collection("comments").add({    //simple word here we are adding it in a comments section of db
            text: comment,
            username: user.displayName

        })
        setComment('');

    }
    return (
        <div className="post">
        <div className="post_header">
            <Avatar className="post_avatar" alt="" src=""/>
            <h3>{username}</h3>
        </div>

            
            <img className="post_image" alt="" src={imageUrl}></img>
            <h4 className="post_text"><strong>{username}</strong> {caption}</h4>
            <div className="coment_display">
                {comments.map((cmt)=>(
                    <p><strong>{cmt.username}</strong>{cmt.text}</p>    //came from database 
                ))}
            </div>
            
            {user && (
                <form className="post_commentBox">
                   <input className="post_input" type="text" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
                   <button disabled={!comment} className="post_button" type="submit" onClick={postComment} >post</button>
               </form>
            )}        

            {/* user && is for when user is there then only show add a comment button */}

            
        </div>
    )
}

export default Post;
