// Part1: Node Internals (3 Grades):
/**
  * 1. What is the Node.js Event Loop?
    -> The fundamental mechanism that allows Node.js to perform non-blocking I/O operations.
    Since Node.js is single-threaded, it handles I/O operations by moving them to libUV to 
    complete their execution. When the operation finishes, it goes back to the event queue, 
    and then the event loop checks if the main thread is empty <idle>. If it is, the event loop 
    moves this operation to the main thread to execute its callback function on the main thread.
    ---------------------------------------------------------------------------------------
    ---------------------------------------------------------------------------------------
  * 2. What is Libuv and What Role Does It Play in Node.js?
    -> libUV is a group of threads that executes operations such as:
    1- Cryptography, 2- DNS, 3- I/O, 4- Compression.
    These operations can take time, so if they run on the main thread, they will block the 
    execution of the next code. Therefore, they are handled by libUV, and when they finish 
    their execution, the callbacks go to the event queue, then the event loop takes them 
    and puts them on the main thread to execute their callback functions.
    ---------------------------------------------------------------------------------------
    ---------------------------------------------------------------------------------------
  * 3. How Does Node.js Handle Asynchronous Operations Under the Hood? 
    -> Node.js handles asynchronous operations using libUV and the event loop.
    - Node.js uses a single thread to execute JavaScript code.
    - When an asynchronous operation happens, Node.js doesn't wait for it to finish.
    - The operation is handled by libUV.
    - Once the operation is finished, its callback function is placed in a queue.
    - The event loop continuously checks this queue and moves callbacks when the main thread 
    is free.
    ---------------------------------------------------------------------------------------
    ---------------------------------------------------------------------------------------
  * 4.What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js?
    -> Call Stack: A data structure inside the main thread that keeps track of the currently 
    executing JavaScript functions. It executes JavaScript functions synchronously, one at a time.
    -> Event Queue: Stores callbacks from completed asynchronous operations, waiting to be executed.
    -> Event Loop: Continuously checks if the Call Stack is empty and moves callbacks from the 
    Event Queue to the Call Stack.
    ---------------------------------------------------------------------------------------
    ---------------------------------------------------------------------------------------
  * 5.What is the Node.js Thread Pool and How to Set the Thread Pool Size? 
    -> The Thread Pool is a group of background threads managed by libUV.
    - It is used for certain blocking or expensive operations, such as:
    - File system operations
    - DNS lookup
    - crypto
    - zlib
    - This prevents these operations from blocking the main JavaScript thread.
    - By default, the Thread Pool has 4 threads.
    - To set the thread pool size: ${UV_THREADPOOL_SIZE=8 node app.js}
    ---------------------------------------------------------------------------------------
    ---------------------------------------------------------------------------------------
  * 6.How Does Node.js Handle Blocking and Non-Blocking Code Execution?
    -> Blocking: Stops the main thread until the operation finishes. Other code must wait.
    Non-Blocking: Starts the operation and allows Node.js to continue executing other code.
    The result is handled later through the Event Loop.
 */
