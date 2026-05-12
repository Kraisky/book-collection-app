import axios from 'axios';

export async function searchMetadata(title, author = null) {
  const results = [];

  try {
    // Try Google Books API first
    const query = author ? `${title} ${author}` : title;
    const googleRes = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: query,
        maxResults: 3
      },
      timeout: 5000
    });

    if (googleRes.data.items) {
      const book = googleRes.data.items[0]?.volumeInfo;
      if (book) {
        results.push({
          source: 'google',
          title: book.title || '',
          author: (book.authors || []).join(', '),
          isbn: (book.industryIdentifiers || [])
            .find(id => id.type === 'ISBN_13')?.identifier || '',
          cover_url: book.imageLinks?.thumbnail || '',
          description: book.description || '',
          published_date: book.publishedDate || ''
        });
      }
    }
  } catch (error) {
    console.log('Google Books error:', error.message);
  }

  try {
    // Try Open Library API
    const query = author ? `${title} ${author}` : title;
    const openRes = await axios.get('https://openlibrary.org/search.json', {
      params: {
        title: query,
        limit: 3
      },
      timeout: 5000
    });

    if (openRes.data.docs?.length > 0) {
      const book = openRes.data.docs[0];
      results.push({
        source: 'openlibrary',
        title: book.title || '',
        author: (book.author_name || []).join(', '),
        isbn: (book.isbn || []).pop() || '',
        cover_url: book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : '',
        description: book.first_sentence ? book.first_sentence[0] : '',
        published_date: book.first_publish_year ? String(book.first_publish_year) : ''
      });
    }
  } catch (error) {
    console.log('Open Library error:', error.message);
  }

  return results;
}

export async function extractISBN(filename) {
  // Try to extract ISBN from filename (e.g., "Book Title - 978-3-16-148410-0.pdf")
  const isbnPattern = /(\d{3}[-]?\d{1}[-]?\d{5}[-]?\d{1}|\d{10}(?:\d{3})?)/;
  const match = filename.match(isbnPattern);
  return match ? match[0].replace(/-/g, '') : null;
}
