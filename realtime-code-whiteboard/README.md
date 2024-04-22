# Real-time Collaborative Whiteboard

## Technology Used

1. React for the frontend, 
2. WebSockets for real-time functionality, 
3. PostgreSQL via Docker for the database, 
4. Fabric.js for drawing on the whiteboard, 
5. Keycloak for secure authentication, 
6. TypeScript for type safety, 
7. and Bootstrap for layout

## Features

1. Users can create a new whiteboard session or join an existing one. 
2. The whiteboard support drawing using different colors and brush sizes.
3. Ability to undo/redo the last action on the whiteboard.
4. Users should be able to see the cursors of other connected users moving in real-time, indicating their, drawing actions. 
5. Option to save the whiteboard content as an image or PDF file. 
6. Authentication (user signup and login) to ensure that only authorized users can access the whiteboard.

## Describing Screenshot of UI

Based on the code, the UI for the collaborative whiteboard application would likely consist of the following elements:

1. **Canvas**: A large canvas area where users can draw using the provided tools.
2. **Toolbar**: A set of controls and options above the canvas, likely including:
   Undo and Redo buttons
   Clear Canvas button
   Save as Image button
   Brush Color picker
   Brush Size slider or input field
3. **Cursor Indicator**: A small circle or dot that represents the current position of other users' cursors on the canvas, as implemented in the code using the Socket.IO events.
   
The overall layout would likely be a centered canvas, with the toolbar positioned above it. The toolbar controls should be arranged in a clean and intuitive manner, allowing users to easily access the various whiteboard features.

   
