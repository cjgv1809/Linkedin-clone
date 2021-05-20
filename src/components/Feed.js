import React, { useState, useEffect } from "react";
import "./Feed.css";
import CreateIcon from "@material-ui/icons/Create";
import InputOption from "./InputOption";
import ImageIcon from "@material-ui/icons/Image";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import EventNoteIcon from "@material-ui/icons/EventNote";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";
import Post from "./Post";
import { db, storage } from "../firebase";
import firebase from "firebase";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";
import FlipMove from "react-flip-move";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import CloseIcon from "@material-ui/icons/Close";
import { Avatar, Button } from "@material-ui/core";
import ReactPlayer from "react-player";

function getModalStyle() {
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
    position: "absolute",
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1),
  },
}));

function Feed() {
  const user = useSelector(selectUser);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [shareImage, setShareImage] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [assetArea, setAssetArea] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  const handleChange = (e) => {
    const image = e.target.files[0];
    if (image === "" || image === undefined) {
      alert(`Not an image, the file is a ${typeof image}`);
      return;
    }
    setShareImage(image);
  };

  const switchAssetArea = (area) => {
    setShareImage("");
    setVideoLink("");
    setAssetArea(area);
  };

  const handleUpload = () => {
    if (shareImage) {
      const uploadTask = storage
        .ref(`images/${shareImage.name}`)
        .put(shareImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress Function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // Error function
          alert(error.message);
        },
        () => {
          // Finishing Function
          storage
            .ref("images")
            .child(shareImage.name)
            .getDownloadURL()
            .then((url) => {
              db.collection("posts").add({
                user: user.uid,
                name: user.displayName,
                description: user.email,
                message: input,
                photoUrl: user.photoUrl || "",
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                imageUrl: url || "",
                video: videoLink || "",
              });

              setProgress(0);
            });
        }
      );
    } else if (videoLink) {
      const uploadTask = storage.ref(`videos/${videoLink}`).put(videoLink);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress Function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // Error function
          alert(error.message);
        },
        () => {
          // Finishing Function
          db.collection("posts").add({
            user: user.uid,
            name: user.displayName,
            description: user.email,
            message: input,
            photoUrl: user.photoUrl || "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            imageUrl: "",
            video: videoLink || "",
          });

          setProgress(0);
        }
      );
    }
  };

  const sendPost = (e) => {
    e.preventDefault();
    handleUpload();

    setInput("");
    setShareImage("");
    setVideoLink("");
    setAssetArea("");
    setOpen(false);
  };

  return (
    <div className="feed">
      <div className="feed__inputContainer">
        <div className="feed__input" onClick={() => setOpen(true)}>
          <CreateIcon />
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Start a post by clicking here"
              readOnly
            />
          </form>
        </div>

        <div className="feed__inputOptions">
          <InputOption Icon={ImageIcon} title="Photo" color="#70B5F9" />
          <InputOption Icon={SubscriptionsIcon} title="Video" color="#E7A33E" />
          <InputOption Icon={EventNoteIcon} title="Event" color="#C0CBCD" />
          <InputOption
            Icon={CalendarViewDayIcon}
            title="Write article"
            color="#7FC15E"
          />
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        style={{ overflowY: "auto" }}
      >
        <div style={modalStyle} className={classes.paper}>
          <div className="feed__header">
            <h2>Create a post</h2>
            <button onClick={() => setOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="feed__sharedContent">
            <div className="feed__userInfo">
              {user?.photoURL ? (
                <Avatar src={user?.photoURL} className="feed__avatar" />
              ) : (
                <Avatar className="feed__avatar">
                  {user?.email[0]?.toUpperCase()}
                </Avatar>
              )}
              <span>{user?.displayName}</span>
            </div>
            <div className="feed__editor">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                placeholder="What do you want to talk about?"
              />

              {assetArea === "image" ? (
                <div className="feed__uploadImg">
                  <progress
                    className={progress !== 0 ? "progress" : "progress-false"}
                    value={progress}
                    max="100"
                  />
                  <input
                    type="file"
                    accept="image/gif, image/jpg, image/png"
                    name="image"
                    id="file"
                    style={{ display: "none" }}
                    onChange={handleChange}
                  />
                  <p>
                    <label htmlFor="file">
                      Select an image to share by clicking here
                    </label>
                  </p>
                  {shareImage && (
                    <img src={URL.createObjectURL(shareImage)} alt="" />
                  )}
                </div>
              ) : (
                assetArea === "media" && (
                  <>
                    <progress
                      className={progress !== 0 ? "progress" : "progress-false"}
                      value={progress}
                      max="100"
                    />
                    <input
                      type="text"
                      placeholder="Please input a video link"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      className="feed__uploadVideo"
                    />
                    {videoLink && (
                      <ReactPlayer
                        width="640"
                        height="360"
                        controls={true}
                        url={videoLink}
                      />
                    )}
                  </>
                )
              )}
            </div>
          </div>
          <div className="feed__shareCreation">
            <div className="feed__attachAssets">
              <button onClick={() => switchAssetArea("image")}>
                <img
                  src="https://raw.githubusercontent.com/walesoft28/linkedin-clone/46bbcd65c6586b6fe3e4271f4da9f2d01ac6b671/public/images/share-image.svg"
                  alt=""
                />
              </button>
              <button onClick={() => switchAssetArea("media")}>
                <img
                  src="https://raw.githubusercontent.com/walesoft28/linkedin-clone/46bbcd65c6586b6fe3e4271f4da9f2d01ac6b671/public/images/share-video.svg"
                  alt=""
                />
              </button>
            </div>
            <div className="feed__shareComment">
              <button>
                <img
                  src="https://raw.githubusercontent.com/walesoft28/linkedin-clone/46bbcd65c6586b6fe3e4271f4da9f2d01ac6b671/public/images/share-comment.svg"
                  alt=""
                />{" "}
                Anyone
              </button>
            </div>
            <Button
              className={`${
                input || shareImage || videoLink
                  ? "feed__postButton"
                  : "feed__postButton--disabled"
              }`}
              onClick={sendPost}
              variant="contained"
            >
              POST
            </Button>
          </div>
        </div>
      </Modal>

      <FlipMove>
        {posts.map(
          ({
            id,
            data: { name, description, message, photoUrl, imageUrl, video },
          }) => (
            <Post
              key={id}
              name={name}
              description={description}
              message={message}
              photoUrl={photoUrl}
              imageUrl={imageUrl}
              video={video}
            />
          )
        )}
      </FlipMove>
    </div>
  );
}

export default Feed;
