// app.js

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const route = require('./routes/route');
const socket = require('./routes/socket/socket');
const { conn } = require('./middleware/db'); // MySQL connection
// const socket = require("socket.io");

dotenv.config({ path: './config.env' });

const app = express();
const server = http.createServer(app);
const io = socket.init(server); // socket.io instance

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());

app.use(session({
  secret: process.env.SESSION_SECRET || 'nodedemo',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 } // 1 hour
}));

// View engine & layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'partials/layout-vertical');


//Socket for helpdesk chat

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("🔗 New client connected", socket.id);

  // When user joins (after login)
  socket.on("join", (userData) => {
    onlineUsers[userData.id] = socket.id;
    console.log(" User joined:", userData);
  });
  

  socket.on("sendMessage", (data) => {
    const { senderId, receiverId, message } = data;


  if (onlineUsers[receiverId]) {
      io.to(onlineUsers[receiverId]).emit("receiveMessage", data);
    }
  });
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
     for (let uid in onlineUsers) {
      if (onlineUsers[uid] === socket.id) {
        delete onlineUsers[uid];
      }
    }
  });
});


// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Flash messages as locals
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.errors = req.flash('errors');
  next();
});
// roles and required data as locals
app.use((req, res, next) => {
  let token;
  
  // Try to get token from cookie
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Or try to get token from Authorization header (Bearer <token>)
  else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } 

  if (token) {
    try {
      const decoded = jwt.decode(token); // Decode without verifying
      // Assign decoded values to EJS access variables
      res.locals.assignedRoles = decoded.rolesArray || [];
      res.locals.userId = decoded.id;
      res.locals.username = decoded.username;
      res.locals.userFullName = `${decoded.name || ''} ${decoded.last_name || ''}`;
      res.locals.name = decoded.name;
      res.locals.Rolename = decoded.roleName;
      res.locals.userLogoPath = decoded.logo_path;
     res.locals.companyName = decoded.company_name;

    } catch (err) {
      console.error("Failed to decode JWT:", err);
    }
  }

  next();
});
// Script injection from DB
app.use((req, res, next) => {
  conn.query("SELECT data FROM tbl_validate", (err, results) => {
    if (err) {
      console.error('Error fetching script data:', err);
      return next(err);
    }
    res.locals.scriptFile = results?.[0]?.data || '';
    next();
  });
});

// Trust proxy (if using reverse proxy)
app.set('trust proxy', 1);

// Routes
app.use('/', route);

// 404 Handler
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).redirect('/view/login');                                                 
  }

  console.error("App Error:", err);
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Something went wrong',
  });
}); 

// Server Start
const PORT = process.env.PORT || 8001;
server.listen(PORT,"0.0.0.0", () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
