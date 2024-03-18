const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Importing socket.io and http
const http = require('http');
const socketIO = require('socket.io');

const app = express();
// const port = 4000;
const port = process.env.PORT || 4000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require('jsonwebtoken');

//import your madeup models
const User = require('./models/user');
const LawyerProfile = require('./models/lawyerProfile');
const Chat = require('./models/chat');
const ChatModel = require('./models/chatModel');
const Message = require('./models/message');
const Post = require('./models/post');
const TrendingCase = require("./models/TrendingCase");
const CombinedCase = require("./models/CombinedCases"); // Import CombinedCase model
const ComparingCase = require("./models/ComparingCases")
const RapeCase = require("./models/RapeCases")
const LiteracyRate = require("./models/LiteracyRate")
const FemaleJudges= require("./models/PerFemaleJudges")

// Creating a http server instance
const server = http.createServer(app);

// Connecting socket.io to the server
const io = socketIO(server, {
  pingTimeout:60000,
  cors: {
    origin: 'http://10.0.2.2:4000/', // Adjust this origin to match your client's URL
  },
});

mongoose
  .connect(
    'mongodb+srv://maryaamkhanzada:qCzYKINdo5Uv0RYZ@cluster0.w7yf50k.mongodb.net/',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log('Connected to mongodb');
  })
  .catch(error => {
    console.log('error connecting to mongodb', error);
  });

// Add a route to handle requests to the root URL
app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(port, () => {
  console.log('Server running on port 4000');
});


io.on('connection', (socket)=>{
  console.log("connected to socket.io");

  socket.on("setup", (userId)=>{
    socket.join(userId);
    console.log(userId);
    socket.emit("connected");
  });

  socket.on("join chat", (room)=>{
    socket.join(room);
    console.log("user joined room", room);
  });

  // Listen for 'sendPost' event from the client
  socket.on('sendPost', async (postData) => {

    try {
      // Fetch the user corresponding to the userId
      const user = await User.findById(postData.userId);

      if (!user) {
        throw new Error('User not found');
      }
      // Create a new post
      const newPost = new Post({
        author: postData.author,
        content: postData.content,
        senderId: postData.senderId,
        url: postData.url,
        image:postData.image,
        userId: postData.userId,
        user: user //
      });
      // Save the new post to the database
      await newPost.save();

      // Emit the new post object to all connected clients
      io.emit('receivePostMessage', newPost);
      console.log('Received post message:', newPost);
      // Respond to the sender with success statusy
      socket.emit('postSent', {
        success: true,
        message: 'Post sent successfully',
      });

    } catch (error) {
      console.error('Error saving post:', error);
    }
  });

  // Deleting posts real time
  socket.on('delete_post', async (postId) => {
    try {
      io.emit('postDeleted', postId);
      console.log('Post deleted successfully:', postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  });


  socket.on("typing", (room)=> socket.in(room).emit("typing"));
  socket.on("stop typing", (room)=> socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived)=>{
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach(user =>{
      if(user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    })
  });
});



// Endpoint to delete a post
app.delete("/delete-post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by postId and delete it
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

//endpoint with socket for liking a particular post
app.put("/posts/:postId/:userId/like", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId; // Assuming you have a way to get the logged-in user's ID

  try {
    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } }, // Add user's ID to the likes array
      { new: true } // To return the updated post
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    updatedPost.user = post.user;

    io.emit("postLiked", updatedPost);

    res.json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while liking the post" });
  }
});

//endpoint with socket to unlike a post
app.put("/posts/:postId/:userId/unlike", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );

    updatedPost.user = post.user;

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Emit a 'postUnliked' event to inform clients about the updated post
    io.emit("postUnliked", updatedPost);

    res.json(updatedPost);
  } catch (error) {
    console.error("Error unliking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while unliking the post" });
  }
});

// //endpoint to get all the posts
app.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while getting the posts" });
  }
});

// Endpoint to get a single user's information
app.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




// // Socket.io logic goes here
// io.on('connection', async socket => {
//   // Listen for 'userLoggedIn' event
//   socket.on('userLoggedIn', async ({userId}) => {
//     console.log('User logged in:', userId);
//     // console.log(socket);
//     // Update the user's status here
//     await User.findByIdAndUpdate(userId, {CheckOnline: '1'});
//   });

//   // Listen for 'userLoggedOut' event
//   socket.on('userLoggedOut', async ({userId}) => {
//     console.log('User logged out:', userId);
//     // Update the user's status here
//     await User.findByIdAndUpdate(userId, {CheckOnline: '0'});
//   });

//   // Listen for 'sendMessage' event from the client
//   socket.on('sendMessage', async ({sender_id, receiver_id, message}) => {
//     try {
//       // Save the message to the database
//       const newChat = new Chat({
//         sender_id: sender_id,
//         receiver_id: receiver_id,
//         message: message,
//       });
//       await newChat.save();

//       // Joining rooms based on user IDs
//       socket.join(`user_${sender_id}`);
//       socket.join(`user_${receiver_id}`);

//       // Emit the message to the receiver's room
//       io.to(`user_${receiver_id}`).emit('receiveMessage', {sender_id, message});


//       // Respond to the sender with success status
//       socket.emit('messageSent', {
//         success: true,
//         message: 'Message sent successfully',
//       });
//     } catch (error) {
//       console.error('Error sending message', error);
//       socket.emit('messageSent', {
//         success: false,
//         error: 'Internal server error',
//       });
//     }
//   });

//   // Listen for 'disconnect' event
//   socket.on('disconnect', () => {});
// });

//endpoint to register a user
app.post('/register-user', async (req, res) => {
  try {
    const {name, email, password, image} = req.body;

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'email already registered'});
    }
    //create a new user
    const newUser = new User({name, email, password, image});

    //generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString('hex');

    //save the user to the database
    await newUser.save();

    //send the verification email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({message: 'Registration successful'});
  } catch (error) {
    console.log('Error registering user', error);
    res.status(500).json({message: 'error registering user'});
  }
});

const sendVerificationEmail = async (email, verificationToken) => 
{
  //create a nodemailer transporter

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'maryaamkhanzada@gmail.com',
      pass: 'xfrs qszx oyfn dfyn',
    },
  });

  //compose the email message
  const mailOptions = {
    from: 'Team AdalNow',
    to: email,
    subject: 'Email Verification',
    text: `Please click the following link to verify your email http://10.0.2.2:4000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log('error sending the email', error);
  }
};

app.get('/verify/:token', async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({verificationToken: token});
    if (!user) {
      return res.status(404).json({message: 'Invalid token'});
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({message: 'Email Verified Successfully'});
  } catch (error) {
    console.log('error getting the token', error);
    res.status(500).json({message: 'Email verification failed'});
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString('hex');
  return secretKey;
};

const secretKey = generateSecretKey();

//function  to create a token for the user
const createToken = userId => {
  //set the token payload
  const payload = {
    userId: userId,
  };
  //Generate a token with a secret key and expiration time
  const token = jwt.sign(payload, 'Q$r2K6W8n!jCW%Zk', {expiresIn: '1h'});
  return token;
};

//endpoint for login of that user
app.post('/login', (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(404).json({message: 'Email and passwords are required'});
  }
  //check for the user in the database
  User.findOne({email})
    .then(user => {
      if (!user) {
        //user not found
        return res.status(404).json({message: 'User not found'});
      }

      //comapre the provided password with the database's password
      if (user.password !== password) {
        return res.status(404).json({message: 'Invalid password'});
      }

      const token = createToken(user._id);
      res.status(200).json({token, userId: user._id});
    })
    .catch(error => {
      console.log('ERROR IN FINDING THE USER', error);
      res.status(500).json({message: 'Internal server error!'});
    });
});

//endpoint to register with base64 image
app.post('/lawyer-profile', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      image,
      specialization,
      education,
      experience,
      contact,
    } = req.body;

    const existingLawyer = await User.findOne({email});
    if (existingLawyer) {
      return res.status(400).json({message: 'lawyer already registered'});
    }
    //create a new user
    const newLawyer = new User({
      name,
      email,
      password,
      image,
      specialization,
      education,
      experience,
      contact,
      isLawyer: true,
    });

    //generate and store the verification token
    newLawyer.verificationToken = crypto.randomBytes(20).toString('hex');

    //save the user to the database
    await newLawyer.save();

    //send the verification email to the user
    sendVerificationEmail(newLawyer.email, newLawyer.verificationToken);

    res.status(200).json({message: 'Registration successful'});
  } catch (error) {
    console.log('Error registering Lawyer', error);
    res.status(500).json({message: 'error registering Lawyer'});
  }
});

//endpoint to get all the lawyers
app.get('/all-lawyers', async (req, res) => {
  try {
    const lawyers = await User.find({isLawyer: true});
    res.json(lawyers);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

//endpoint to get Single Lawyer Information
app.get('/SingleLawyer/:lawyerId', async (req, res) => {
  const {lawyerId} = req.params;
  try {
    const SingleLawyer = await User.findById(lawyerId);
    res.json(SingleLawyer);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Internal server Error'});
  }
});

//endpoint to update the rating for a lawyer profile
app.put('/lawyer/:id/rating', async (req, res) => {
  const lawyerId = req.params.id;
  let {rating} = req.body;
  try {
    const lawyer = await User.findById(lawyerId);
    if (!lawyer) {
      return res.status(404).json({message: 'Lawyer not found'});
    }
    lawyer.ratings.push(rating);
    const totalRatings = lawyer.ratings.reduce((acc, curr) => acc + curr, 0);
    const averageRating = totalRatings / lawyer.ratings.length;

    // Ensure averageRating is not greater than 5
    lawyer.averageRating = Math.min(averageRating, 5);

    // Ensure averageRating has only one number after the decimal
    lawyer.averageRating = parseFloat(lawyer.averageRating.toFixed(1));

    await lawyer.save();
    res.status(200).json({message: 'Rating updated successfully'});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  }
});

//endpoint to get the Lawyer details to design the chat Room header
app.get('/chat/:lawyerId', async (req, res) => {
  try {
    const {lawyerId} = req.params;

    //fetch the user data from the user Id
    const receipentId = await LawyerProfile.findById(lawyerId);

    res.json(receipentId);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal server Error'});
  }
});

// GET route to fetch all messages for a given chat
app.get('/chat/:userId/:lawyerId', async (req, res) => {
    const { userId, lawyerId } = req.params;
  
    try {
      // Find all messages where the sender_id or receiver_id matches either userId or lawyerId
      const messages = await Chat.find({
        $or: [
          { sender_id: userId, receiver_id: lawyerId },
          { sender_id: lawyerId, receiver_id: userId }
        ]
      });
  
      res.json({ messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  ///New apis that i am writing 
  app.get('/search-users/', async(req, res)=>{
    const {query} = req.query;
    try{
      const users = await User.find({name: {$regex: query, $options: 'i'}});
      res.json(users);
    } catch (error){
      console.error('Error searching the users', error);
      res.status(500).json({error: 'Internal server error'});
    }
  });
//for creating one-one chat
app.post('/access-chats',async(req, res)=>{
  const {userId, itemId} = req.body;

  if(!userId){
    console.log("UserId params not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await ChatModel.find({
    isGroupChat: false,
    $and: [
      { users: {$elemMatch: {$eq: itemId}}},
      { users: {$elemMatch: {$eq: userId}}},
    ],
  }).populate("users", "-password").populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name image email",
  });

  if (isChat.length>0){
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [itemId, userId],
    };
    try{
      const createdChat = await ChatModel.create(chatData);
      const FullChat = await ChatModel.findOne({_id: createdChat._id}).populate(
        "users", "-password"
      );
      res.status(200).send(FullChat);
    } catch(error){
      res.status(400);
      throw new Error(error.message);
    }
  }

})
//for fetching chatss
app.get('/fetch-chats', async(req, res)=>{
  const {userId} = req.query;
  try{
    ChatModel.find({users:{$elemMatch:{$eq:userId}}})
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({updatedAt: -1})
    .then(async(results)=>  {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name image email",
      });
      res.status(200).send(results);
    })
  }catch(err){
    res.status(400);
    throw new Error(err.message);
  }
});

//for creating groupchats
app.post('/create-groupchat', async (req, res) => {
  if (!req.body.users || !req.body.name || !req.body.userId) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  try {
    // Retrieve the admin user using the provided userId
    const adminUser = await User.findOne({ _id: req.body.userId });

    if (!adminUser) {
      return res.status(400).send("Admin user not found");
    }

    // Parse the users array from the request body
    const users = JSON.parse(req.body.users);

    // Ensure there are more than 2 users in the group chat
    if (users.length < 2) {
      return res.status(400).send("More than 2 users are required to form a group chat");
    }

    // Add the admin user to the users array
    users.push(adminUser);

    // Create the group chat
    const groupChat = await ChatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: adminUser._id, // Save admin's ID instead of the whole object
    });

    // Populate and send the full group chat details in the response
    const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password")
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).send("Error in creating group: " + error.message);
  }
});


//for renaming the group
app.put('/rename-groupchat', async(req, res)=>{
  const {chatId, chatName} = req.body;

  const updatedChat = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      chatName,
    }, {
      new: true,
    }
  ).populate("users", "-password").populate("groupAdmin", "-password");
  if (!updatedChat){
    res.status(404);
    throw new Error("Chat not found");
  } else{
    res.json(updatedChat);
  }
});

//for add to group
app.put('/add-to-group', async(req,res)=>{
  const {chatId, userId} = req.body;
  const added = await ChatModel.findByIdAndUpdate(chatId, {
    $push: {users: userId},
    
  }, {new: true}
  ).populate("users", "-password").populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

//for removing from group
app.put('/remove-from-group', async(req,res)=>{
  const {chatId, userId} = req.body;
  const removed = await ChatModel.findByIdAndUpdate(chatId, {
    $pull: {users: userId},
    
  }, {new: true}
  ).populate("users", "-password").populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});


//post request for sending messages
app.post('/send-message', async(req, res)=>{
  const {content, chatId, senderId} = req.body;
  
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: senderId,
    content: content,
    chat: chatId,
  };
  try{
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name image");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name image email"
    });
    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch(error){
    res.status(400);
    throw new Error(error.message);
  }
});


//api to get all messages for a certain chat
app.get('/get-all-messages/:chatId', async(req, res)=>{
  try{
    const messages = await Message.find({chat: req.params.chatId}).populate("sender", "name image email").populate("chat");
    res.json(messages);
  } catch(error){
    res.status(400);
    throw new Error(error.message);
  }
}) 


//endpoint to get the Lawyer details to design the chat Room header
app.get('/chat-for-user/:itemId', async (req, res) => {
  try {
    const {itemId} = req.params;

    //fetch the user data from the user Id
    const receipentId = await User.findById(itemId);

    res.json(receipentId);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal server Error'});
  }
});


//endpoint for fetching a specific chat
app.get('/specific-chat/:itemId', async (req, res)=>{
  try{
    const {itemId} = req.params;

    //fetch the chat data from the chatId
    const receipentChat = await ChatModel.findById(itemId);
    res.json(receipentChat);
  }catch(error){
    console.log(error);
    req.status(500).json({error: 'Internal server error'});
  }
});

//endpoint to fetch all group chats
app.get('/fetch-all-group-chats', async(req, res)=>{
  try{
    ChatModel.find({isGroupChat: true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({updatedAt: -1})
    .then(async(results)=>  {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name image email",
      });
      res.status(200).send(results);
    })
    
  }catch(error){
    console.log(error);
    req.status(500).json({error: 'Internal server error'});
  }
});


//DASHBOARD APISSS
// Define routes for TrendingCases
app.get("/api/trending-cases", async (req, res) => {
  try {
    const trendingCases = await TrendingCase.find();
    res.json(trendingCases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Define routes for CombinedCases
app.get("/api/combined-cases", async (req, res) => {
  try {
      const combinedCases = await CombinedCase.find();
      res.json(combinedCases);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


// Define routes for ComparingCases
app.get("/api/comparing-cases", async (req, res) => {
  try {
      const comparingCases = await ComparingCase.find();
      res.json(comparingCases);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Define routes for RapeCases
app.get("/api/rape-cases", async (req, res) => {
  try {
      const rapeCases = await RapeCase.find();
      res.json(rapeCases);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Define routes for LiteracyRate
app.get("/api/literacy-rate", async (req, res) => {
  try {
      const literacyRate = await LiteracyRate.find();
      res.json(literacyRate);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Define routes for PerFemaleJudges
app.get("/api/female-judges", async (req, res) => {
  try {
      const femaleJudges = await FemaleJudges.find();
      res.json(femaleJudges);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});