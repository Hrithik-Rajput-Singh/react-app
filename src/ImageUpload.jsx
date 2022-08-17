import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { db, storage} from "./firebase";
import './ImageUpload.css';
import firebase from 'firebase'
require('firebase/firestore')

function ImageUpload({username}) {
    const[caption, setCaption] = useState("");
    const[image, setImage] = useState(null);
    const[progress, setProgress] = useState(0)

    function handleCaptionChange(event) {
        setCaption(event.target.value)
    }

    function handleChange (e){      //it is a file input so these function tell upload the first image bcus sometime we click multiple file
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    function handleUpload(){
        // /these is doing uploading in database
        const uploadTask =storage.ref(`images/${image.name}`).put(image)    //acess to storage firebase get a reference to images (image name is here file name we choose)folder and put that image to storage 
        //these is going to show upload progress line 
           uploadTask.on(
               "state_changed",  //as state change give me the snaap shot
               (snapshot) =>{
                   //progress function
                   const progresss =Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100 );
                   setProgress(progresss);
               },
               (error) => {
                   //error function
                   console.log(error);
                   alert(error.message)
               },
               () => {
                   //complete function /these is here to get uploading image in data
                   storage           //go to ref images /go to (image.name child which is file here) /download the url
                      .ref("images")
                      .child(image.name)
                      .getDownloadURL()
                      .then(url => {
                          //post image inside data base and asign value of each
                          db.collection("instapost").add({
                              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                              caption: caption,   //caption from caption state
                              imageUrl: url ,   //it a download url we hold og in then
                              username: username,  //it from app.js
                          });
                          setProgress(0);   //reseting everything
                          setCaption("");
                          setImage(null);
                      })
               }
           ) 
    }
    return (
        <div className="image_upload">            
            <progress className="progress_bar" value={progress} max="100" /> 
            <input type="text" placeholder="Enter a captaion...." value={caption} onChange={handleCaptionChange} />                 
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>UPLOAD</Button>
        </div>
    )
}

export default ImageUpload;
