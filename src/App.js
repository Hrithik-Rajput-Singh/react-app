import React,{ useState, useEffect} from "react"
import './App.css';
import Post from "./Post";
import { db, auth} from "./firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';


//for syling in modal 
//everything is there in material ui modal
function getModalStyle() {      //these style will help to give us like popup sign in and mail
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles(); //we have hook here makestyle which have accesss of useSTyle and then we give it acess to const classes so that we can use it on <modal component for styling
  const [modalStyle] = React.useState(getModalStyle);     
  const [posts, setposts] = useState([])
  const [open, setOpen] = useState(false); 
  const [openSignIn, setOpenSignIn] = useState(false); 
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);             

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {            //any single time auth change it fires these listner
      if (authUser){                     //if user has logged in 
        setUser(authUser);
      }else{                             //useer has log out
        setUser(null);
      }
    })
    return () => {                            //run a listner one then unsubscribe before listning again
      unsubscribe()
    }
  }, [user, username]);           //in simple world is that these is used when we are using some state so we have to put here 

  // it run a piece of a code based on a specific condition
  useEffect(() => {
    //these is where the code run
    db.collection('instapost').orderBy('timestamp','desc').onSnapshot(snapshot => {
      //everytime these code is added a new code fire 
      //below tell whenever codes get fire change state of set post to these
      //go to snapshot then in document then map and date here is caption img username
      //to get id we have created here object 
      setposts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    });
  }, []) ;   //these is called conditon or if we leave these blank the code gonna run once then it will not run and if we fill with posts then code gonna run once and it goona run everytime posts chaange
  

  //
  //these is modal handle close function
  //onCose listen to a click outside the modal whenever u click outside the modal it closes
 

  function signUp(event){
    setOpen(true);
    event.preventDefault();
  }

  function signIn(event){
    setOpenSignIn(true);
    event.preventDefault();
  }

  function popupSignup (event){
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)  //these is first part these is gonna create the user email password came from state
      .then((authUser) => {
        // Signed  
        return authUser.user.updateProfile({                  //user came from state variable 
          displayName: username,
        });
        // ...
      })
      .catch((error) => alert(error.message));
      //so these listner is telling create email password in email and password variable then update display name as username 
      setOpen(false);      //we don't want that modal to open when we click sign up then so to close it we set to false
  }

  function popupSignIn (event){
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password) 
    .catch((error) => alert(error.message));
    setOpenSignIn(false);
  }

  return (
 
    <div className="app">

    <Modal open={open} onClose={()=> setOpen(false)}>   

    <div style={modalStyle} className={classes.paper}>  

          <form action="/examples/actions/confirmation.php" method="post">
            
            <center> 
              <img 
              src="https://png.pngitem.com/pimgs/s/104-1044084_insta-logo-hd-png-download.png" 
              alt=""  
              style={{
                width: 50,
                height: 40,
                marginBottom: 8,
                }}
                />
                <h3 style={{fontStyle: 'italic',}}>New to instagram <p>Signup here</p></h3> 
            </center>
            <div class="form-group">
              <input type="text" class="form-control" name="username" placeholder="Username" required="required" value={username}  onChange={(e)=> setUsername(e.target.value) }/>
            </div>
            <div class="form-group">
              <input type="text" class="form-control" name="email" placeholder="email" required="required" value={email} onChange={(e)=> setEmail(e.target.value)}/>
            </div>
            <div class="form-group">
              <input type="password" class="form-control" name="password" placeholder="Password" required="required" value={password} onChange={(e)=> setPassword(e.target.value)}/>	
            </div>        
            <div class="form-group">
              <button type="submit" class="btn btn-primary btn-lg btn-block login-btn" onClick={popupSignup}>Signup</button>
            </div>
				</form>
          
      
    </div>
    </Modal>

{/* these is sign in modal and up one is for sign up modal */}
    <Modal open={openSignIn} onClose={()=> setOpenSignIn(false)}> 

    <div style={modalStyle} className={classes.paper}>  

          <form action="/examples/actions/confirmation.php" method="post">
            
            <center> 
              <img 
              src="https://png.pngitem.com/pimgs/s/104-1044084_insta-logo-hd-png-download.png" 
              alt=""  
              style={{
                width: 50,
                height: 40,  
                marginBottom: 8,
                }}
                />
                <h3 style={{fontStyle: 'italic',}}> <p>SIGNIN HERE</p></h3> 
            </center>
            <div class="form-group">
              <input type="text" class="form-control" name="email" placeholder="email" required="required" value={email} onChange={(e)=> setEmail(e.target.value)}/>
            </div>
            <div class="form-group">
              <input type="password" class="form-control" name="password" placeholder="Password" required="required" value={password} onChange={(e)=> setPassword(e.target.value)}/>	
            </div>        
            <div class="form-group">
              <button type="submit" class="btn btn-primary btn-lg btn-block login-btn" onClick={popupSignIn}>SignIN</button>
            </div>
				</form>
          
      
    </div>
    </Modal>
      
      <div className="app_header">
        <img          
          src="https://png.pngitem.com/pimgs/s/104-1044084_insta-logo-hd-png-download.png" 
          alt=""  
          style={{
            width: 40,
            height: 50,
            borderRadius: 30, 
            marginBottom: 3,
            objectFit: 'contain',
            }}>
        </img>
        <h1 className="title">Instagram</h1>

        {user ?(
        <Button onClick={()=> auth.signOut()}>SIGN OUT</Button>
        ) : (
          <div className="sign_container">
            <Button onClick={signIn}>SIGN IN</Button>  
            <Button onClick={signUp}>SIGN UP</Button>
          </div>
          
          )}

      </div>

      {user?.displayName?(             //here we are telling sign in first before uploading /so if user has display name then only upload these component otherwise say u need to login first and the first questionmark after user to tell don't break if displayname not found 
        <ImageUpload username={user.displayName}/>
        ):(
          <h3 className="text_upload">SIGNIN TO UPLOAD PHOTO</h3>
        )}

      {/* conditional button says if user is not null  then i want to render these where the button says to signout else new user is then signup */}
      <div className="app_post">
        <div className="app_postLeft">
          {posts.map(({id, post}) =>{   //we have use destructure method here for id
            return(
              <Post key={id} postId={id} user={user}username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            )
          })}



        </div>
        
        <div className="app_posRight">

        {/* these below instagram emded is not working */}
        <InstagramEmbed
          url='https://www.instagram.com/_singh_hrithik_/'
          clientAccessToken='123|456'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />

        </div>

      </div>



    </div>
  );
}

export default App;
