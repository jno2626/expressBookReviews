const express = require('express'); const jwt = require('jsonwebtoken'); const books = require('./booksdb.js');
const regd_users = express.Router(); const users = [];
const SECRET_KEY = process.env.JWT_SECRET || 'ibm_book_reviews_secret';
const isValid = (username) => { return users.some(user => user.username === username); };
const authenticatedUser = (username, password) => { return users.some( user => user.username === username && user.password === password ); };
// Login regd_users.post('/login', (req, res) => { const { username, password } = req.body;
if (!username || !password) { return res.status(400).json({ message: 'Username and password are required' }); }
if (!authenticatedUser(username, password)) { return res.status(401).json({ message: 'Invalid username or password' }); }
const token = jwt.sign( { username }, SECRET_KEY, { expiresIn: '1h' } );
return res.status(200).json({ message: 'Login successful!', token }); });
// Authentication middleware const verifyToken = (req, res, next) => { const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) { return res.status(401).json({ message: 'Authentication token required' }); }
const token = authHeader.split(' ')[1];
jwt.verify(token, SECRET_KEY, (err, decoded) => { if (err) { return res.status(401).json({ message: 'Invalid or expired token' }); }
if (!isValid(decoded.username)) {
  return res.status(401).json({
    message: 'User not found'
  });
}

req.user = { username: decoded.username };
next();
}); };
// Add or update review regd_users.put('/auth/review/:isbn', verifyToken, (req, res) => { const isbn = req.params.isbn; const { review } = req.body;
if (!books[isbn]) { return res.status(404).json({ message: 'Book not found' }); }
if (typeof review !== 'string' || !review.trim()) { return res.status(400).json({ message: 'A non-empty review is required' }); }
books[isbn].reviews[req.user.username] = review.trim();
return res.status(200).json({ message: 'Review added/updated successfully', reviews: books[isbn].reviews }); });
// Delete own review regd_users.delete('/auth/review/:isbn', verifyToken, (req, res) => { const isbn = req.params.isbn;
if (!books[isbn]) { return res.status(404).json({ message: 'Book not found' }); }
const reviews = books[isbn].reviews; const username = req.user.username;
if (!Object.prototype.hasOwnProperty.call(reviews, username)) { return res.status(404).json({ message: 'Review not found for this user' }); }
delete reviews[username];
return res.status(200).json({ message: Review for ISBN ${isbn} deleted }); });
module.exports.authenticated = regd_users; module.exports.isValid = isValid; module.exports.users = users;
