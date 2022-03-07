import { useState } from "react";
import styled from "styled-components";

/* input의 value를 state와 연결하기
 */
function App() {
  const [value, setValue] = useState("");
  const onChange = () => {
    setValue("");
  };
  return (
    <div>
      <form>
        <input
          value={value}
          onChange={onChange}
          type="text"
          placeholder="username"
        />
        <button>Log in</button>
      </form>
    </div>
  );
}

export default App;
