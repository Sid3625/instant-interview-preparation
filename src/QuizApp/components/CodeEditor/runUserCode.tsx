export const runUserCode = (
  code: string,
  onOutput: (msg: string) => void,
  onError: (msg: string) => void
) => {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";

  // Add necessary sandbox permissions
  iframe.sandbox.add("allow-scripts");
  iframe.sandbox.add("allow-same-origin"); // This is important

  const logs: string[] = [];

  // Bridge console.log → parent using postMessage
  const handleMessage = (event: MessageEvent) => {
    // Verify the message is from our iframe
    if (event.source !== iframe.contentWindow) return;

    if (event.data.type === "log") {
      logs.push(event.data.message);
      onOutput(logs.join("\n"));
    } else if (event.data.type === "error") {
      onError(event.data.message);
    }
  };

  window.addEventListener("message", handleMessage);

  // Create the document content with built-in messaging
  iframe.srcdoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <script>
          // Override console.log to send messages to parent
          const originalLog = console.log;
          const originalError = console.error;
          
          console.log = function(...args) {
            window.parent.postMessage({
              type: 'log',
              message: args.join(' ')
            }, '*');
            originalLog.apply(console, args);
          };
          
          console.error = function(...args) {
            window.parent.postMessage({
              type: 'error', 
              message: args.join(' ')
            }, '*');
            originalError.apply(console, args);
          };
          
          // Handle uncaught errors
          window.addEventListener('error', (event) => {
            window.parent.postMessage({
              type: 'error',
              message: event.message || 'Unknown error'
            }, '*');
          });
          
          // Handle promise rejections
          window.addEventListener('unhandledrejection', (event) => {
            window.parent.postMessage({
              type: 'error',
              message: event.reason?.message || 'Unhandled promise rejection'
            }, '*');
          });
        </script>
      </head>
      <body>
        <script>
          try {
            ${code}
          } catch (e) {
            console.error(e.message);
          }
        </script>
      </body>
    </html>
  `;

  iframe.onload = () => {
    // No need to access iframe content directly anymore
  };

  document.body.appendChild(iframe);

  // Cleanup
  return () => {
    window.removeEventListener("message", handleMessage);
    if (iframe.parentNode) {
      document.body.removeChild(iframe);
    }
  };
};
