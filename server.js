@@ .. @@
 const express = require('express');
 const sqlite3 = require('sqlite3').verbose();
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');
 const cors = require('cors');
 const path = require('path');
 require('dotenv').config();
 
 const app = express();
-const PORT = process.env.PORT || 3000;
+const PORT = process.env.PORT || 8080;
 const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';