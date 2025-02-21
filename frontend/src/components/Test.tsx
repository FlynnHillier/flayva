import { useHello } from "@/hooks/useHello";
import { useEcho } from "@/hooks/useEcho";
import { useState } from "react";

function HelloTest() {
  const { isPending, error, data } = useHello();

  if (isPending) return "Loading Message...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>Message Received!</h1>
      <p>{data}</p>
    </div>
  );
}

function EchoTest() {
  const [message, setMessage] = useState<string>("");
  const { isPending, error, data, mutate } = useEcho();

  function handleButtonClick() {
    mutate(message);
  }

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      {data && (
        <>
          <h1>Echo Heard!</h1>
          <p>{data}</p>
        </>
      )}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="echo"
      />
      <button disabled={!message} onClick={handleButtonClick}>
        Echo
      </button>
    </div>
  );
}

export function Test() {
  return (
    <>
      <HelloTest />
      <EchoTest />
    </>
  );
}
