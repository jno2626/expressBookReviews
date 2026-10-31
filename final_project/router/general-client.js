const axios = require('axios');
const BASE_URL = 'http://localhost:5000';
async function getAllBooks() { try { const response = await axios.get(${BASE_URL}/); return response.data; } catch (error) { console.error('Error fetching books:', error.message); throw error; } }
async function getBookByISBN(isbn) { try { const response = await axios.get( ${BASE_URL}/isbn/${encodeURIComponent(isbn)} ); return response.data; } catch (error) { console.error('Error fetching book by ISBN:', error.message); throw error; } }
async function getBooksByAuthor(author) { try { const response = await axios.get( ${BASE_URL}/author/${encodeURIComponent(author)} ); return response.data; } catch (error) { console.error('Error fetching books by author:', error.message); throw error; } }
async function getBooksByTitle(title) { try { const response = await axios.get( ${BASE_URL}/title/${encodeURIComponent(title)} ); return response.data; } catch (error) { console.error('Error fetching books by title:', error.message); throw error; } }
module.exports = { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle };
