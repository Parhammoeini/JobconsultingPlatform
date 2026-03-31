import Availability from "./Availability";
import Booking from "./Booking";
import SystemStatus from "./SystemStatus";

function App() {
  return (
    <div>
      <h1>Consultant Dashboard</h1>

      <Availability />

      <hr />

      <Booking />
    </div>
  );
}

export default App;
