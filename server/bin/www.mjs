import app from '../app.mjs';
import {db} from '../db/db.mjs';

const PORT = process.env.PORT || 3001;
async function startServer(){
  try {
    

    db.connect('ProdProjectDb');
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Click here to open: http://localhost:${PORT}`);
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server...');
      db.close();
      console.log('Closed DB connection');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

startServer();